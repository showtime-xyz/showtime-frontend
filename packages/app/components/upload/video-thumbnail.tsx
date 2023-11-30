import React, { useState, useEffect, useCallback, memo } from "react";
import { Platform } from "react-native";
import { useWindowDimensions } from "react-native";

import * as VideoThumbnails from "expo-video-thumbnails";

import { Image } from "@showtime-xyz/universal.image";
import Spinner from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { VideoThumbnailProps } from "./types";

const VideoThumbnail: React.FC<VideoThumbnailProps> = memo(
  ({ videoUri, timeFrame = 0 }) => {
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
            setHasError(true);
          });

          video.addEventListener("seeked", () => {
            try {
              const canvas = document.createElement("canvas");
              const maxDimension = 1000;

              // Calculate aspect ratio of the video
              const videoAspectRatio = video.videoWidth / video.videoHeight;
              let canvasWidth, canvasHeight;

              // Determine canvas dimensions based on aspect ratio
              if (video.videoWidth > video.videoHeight) {
                // Video is wider than tall
                canvasWidth = Math.min(video.videoWidth, maxDimension);
                canvasHeight = canvasWidth / videoAspectRatio;
              } else {
                // Video is taller than wide
                canvasHeight = Math.min(video.videoHeight, maxDimension);
                canvasWidth = canvasHeight * videoAspectRatio;
              }

              // Set canvas dimensions
              canvas.width = canvasWidth;
              canvas.height = canvasHeight;

              const ctx = canvas.getContext("2d");
              if (ctx) {
                // Draw the image on the canvas (this will cover the canvas)
                ctx.drawImage(
                  video,
                  0,
                  0,
                  video.videoWidth,
                  video.videoHeight,
                  0,
                  0,
                  canvasWidth,
                  canvasHeight
                );
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
      if (!videoUri) return;
      if (Platform.OS === "web") {
        try {
          const thumbnailUrl = await generateThumbnailForWeb(
            videoUri,
            timeFrame
          );
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
      if (videoUri) {
        generateThumbnail();
      }
    }, [videoUri, timeFrame, generateThumbnail]);

    return (
      <View
        tw="items-center justify-center overflow-hidden rounded-3xl border-2 border-gray-500 bg-black dark:border-gray-800"
        style={{
          aspectRatio: 12 / 16,
          maxHeight: 220,
          width: 160,
          minHeight: 220,
          height: "100%",
        }}
      >
        {!hasError && videoUri && thumbnailUri ? (
          <Image
            source={thumbnailUri}
            alt="Video Thumbnail"
            contentFit="cover"
            style={{
              backgroundColor: "black",
              overflow: "hidden",
              width: "100%",
              height: "100%",
            }}
          />
        ) : hasError ? (
          <Text tw="text-white">No Preview</Text>
        ) : (
          <Spinner />
        )}
      </View>
    );
  }
);

VideoThumbnail.displayName = "VideoThumbnail";

export default VideoThumbnail;
