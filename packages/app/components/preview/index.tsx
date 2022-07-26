import { useMemo } from "react";
import { Platform } from "react-native";

import { Video, ResizeMode } from "expo-av";
import type { ResizeMode as ImgResizeMode } from "react-native-fast-image";

import { Image } from "@showtime-xyz/universal.image";
import { tw as tailwind } from "@showtime-xyz/universal.tailwind";

export const supportedImageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
export const supportedVideoExtensions = ["mp4", "mov", "avi", "mkv", "webm"];

type PreviewProps = {
  file?: File | string;
  type?: "image" | "video";
  tw?: string;
  style?: any;
  resizeMode?: ImgResizeMode | ResizeMode;
};

export const Preview = ({
  tw = "",
  style,
  type,
  file,
  resizeMode = "cover",
}: PreviewProps) => {
  const uri = getLocalFileURI(file);

  const fileType = useMemo(() => {
    if (type) return type;

    if (typeof file === "string") {
      // try to get file type from file extension
      const fileExtension =
        typeof file === "string" ? file?.split(".").pop() : undefined;
      const isVideo =
        fileExtension && supportedVideoExtensions.includes(fileExtension);

      return isVideo ? "video" : "image";
    } else if (typeof file === "object") {
      return file?.type.includes("video") ? "video" : "image";
    }
  }, [file, type]);

  if (uri) {
    if (fileType === "image") {
      return (
        <Image
          tw={tw}
          style={style}
          resizeMode={resizeMode as ImgResizeMode}
          source={{
            uri: uri as string,
          }}
        />
      );
    }

    if (fileType === "video") {
      return (
        <Video
          source={{ uri: uri as string }}
          style={[tailwind.style(tw), style]}
          resizeMode={resizeMode as ResizeMode}
          isMuted
          shouldPlay
        />
      );
    }
  }

  return null;
};

export const getLocalFileURI = (file?: string | File) => {
  if (!file) return null;

  if (typeof file === "string") return file;

  if (Platform.OS === "web") return URL.createObjectURL(file);

  return file;
};
