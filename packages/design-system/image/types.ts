import type { ImageProps as ExpoImageProps } from "expo-image";

export type ContentFit = "cover" | "contain" | "fill" | "none" | "scale-down";

export type ImageNativeProps = ExpoImageProps;
export type ImageSource = ExpoImageProps["source"];
export type ResizeMode = ExpoImageProps["contentFit"];
export type ImageProps = ExpoImageProps & {};
