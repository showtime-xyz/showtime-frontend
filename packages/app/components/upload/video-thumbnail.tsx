import React, { useState, useEffect, useCallback } from "react";
import { Platform } from "react-native";
import { useWindowDimensions } from "react-native";

import * as VideoThumbnails from "expo-video-thumbnails";

import { Image } from "@showtime-xyz/universal.image";
import Spinner from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

interface VideoThumbnailProps {
  videoUri: string;
  timeFrame?: number;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  videoUri,
  timeFrame = 0,
}) => {
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const { height } = useWindowDimensions();

  const generateThumbnailForWeb = useCallback(
    async (uri: string, time: number): Promise<string> => {
      return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        video.src = uri;
        video.crossOrigin = "anonymous";
        video.addEventListener("loadeddata", () => {
          try {
            video.currentTime = time;
          } catch (e) {
            reject(e);
          }
        });

        video.addEventListener("error", (e) => {
          console.log(e.message);
        });

        video.addEventListener("seeked", () => {
          try {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const imageUrl = canvas.toDataURL();
              setHasError(false);
              resolve(imageUrl);
            } else {
              setHasError(true);
              reject(new Error("Failed to get canvas context"));
            }
          } catch (e) {
            setHasError(true);
            reject(e);
          }
        });

        video.load();
      });
    },
    []
  );

  const generateThumbnail = useCallback(async () => {
    if (Platform.OS === "web") {
      try {
        const thumbnailUrl = await generateThumbnailForWeb(videoUri, timeFrame);
        setThumbnailUri(thumbnailUrl);
      } catch (e) {
        console.warn("Error generating thumbnail for web:", e);
      }
    } else {
      try {
        const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
          time: timeFrame * 1000,
        });
        setThumbnailUri(uri);
        setHasError(false);
      } catch (e) {
        console.warn("Error generating thumbnail for mobile:", e);
        setHasError(true);
      }
    }
  }, [generateThumbnailForWeb, timeFrame, videoUri]);

  useEffect(() => {
    generateThumbnail();
  }, [videoUri, timeFrame, generateThumbnail]);

  return (
    <View
      tw="items-center justify-center overflow-hidden rounded-3xl border-2 border-gray-500 bg-black dark:border-gray-800"
      style={{
        aspectRatio: 11 / 16,
        height: height * 0.2,
      }}
    >
      {thumbnailUri && !hasError ? (
        <Image
          source={thumbnailUri}
          alt="Video Thumbnail"
          height={height * 0.2}
          width={150}
          contentFit="cover"
          style={{
            aspectRatio: 11 / 16,
            backgroundColor: "black",
            overflow: "hidden",
          }}
        />
      ) : hasError ? (
        <Text tw="text-white">No Preview</Text>
      ) : (
        <Spinner />
      )}
    </View>
  );
};

export default VideoThumbnail;
