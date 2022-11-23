import { useMemo } from "react";
import { Platform } from "react-native";

import { Video, ResizeMode } from "expo-av";
import type { ResizeMode as ImgResizeMode } from "react-native-fast-image";

import { Image } from "@showtime-xyz/universal.image";
import { styled } from "@showtime-xyz/universal.tailwind";

export const supportedImageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
export const supportedVideoExtensions = ["mp4", "mov", "avi", "mkv", "webm"];

type PreviewProps = {
  file?: File | string;
  type?: "image" | "video";
  tw?: string;
  style?: any;
  resizeMode?: ImgResizeMode | ResizeMode;
  width: number;
  height: number;
};

const StyledVideo = styled(Video);

export const Preview = ({
  tw = "",
  style,
  type,
  file,
  resizeMode = "cover",
  width,
  height,
}: PreviewProps) => {
  const uri = getLocalFileURI(file);

  const fileType = useMemo(() => {
    if (type) return type;

    if (typeof file === "string") {
      // try to get file type from file extension
      const fileExtension =
        typeof file === "string" ? file?.split(".").pop() : undefined;
      const isVideo =
        (fileExtension && supportedVideoExtensions.includes(fileExtension)) ||
        file.includes("data:video/");

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
          width={width}
          height={height}
          onLoad={() => {
            revokeObjectURL(uri);
          }}
          alt="Preview Image"
        />
      );
    }

    if (fileType === "video") {
      return (
        <StyledVideo
          tw={tw}
          style={[{ width, height }, style]}
          resizeMode={resizeMode as ResizeMode}
          source={{ uri: uri as string }}
          isMuted
          shouldPlay
          onLoad={() => {
            revokeObjectURL(uri);
          }}
        />
      );
    }
  }

  return null;
};

export const getLocalFileURI = (file?: string | File) => {
  if (!file) return null;

  if (typeof file === "string") return file;

  if (Platform.OS === "web") return (URL || webkitURL)?.createObjectURL(file);

  return file;
};
/**
 * Browsers will release object URLs automatically when the document is unloaded;
 * for optimal performance and memory usage
 * if there are safe times when you can explicitly unload them, you should do so.
 * @param uri
 * @returns
 */
export const revokeObjectURL = (uri: any) => {
  if (!uri || Platform.OS !== "web" || typeof uri !== "string") return;
  (URL || webkitURL).revokeObjectURL(uri);
};
