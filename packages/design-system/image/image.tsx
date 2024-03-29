import { useMemo, forwardRef } from "react";

import { Image, ImageProps as ExpoImageProps, ImageSource } from "expo-image";

import { styled } from "@showtime-xyz/universal.tailwind";

import { Logger } from "app/lib/logger";

import { ResizeMode } from "./types";

export type ImgProps = ExpoImageProps & {
  height?: number;
  width?: number;
  borderRadius?: number;
};

const StyledExpoImage = styled(Image);

type ImageProps = Omit<ImgProps, "resizeMode"> & {
  tw?: string;
  alt?: string;
  blurhash?: string;
  resizeMode?: ResizeMode;
  loading?: "eager" | "lazy";
};

const StyledImage = forwardRef<any, ImageProps>(
  (
    {
      borderRadius,
      source,
      height,
      width,
      style,
      contentFit,
      resizeMode,
      blurhash,
      ...rest
    },
    ref
  ) => {
    const imageSource = useMemo(
      () =>
        typeof source === "object"
          ? {
              ...source,
              headers: {
                Accept: "image/webp,*/*;q=0.8",
              },
            }
          : source,
      [source]
    );
    if (typeof source === "object" && !(source as ImageSource)?.uri) {
      Logger.warn("Image source is not a valid uri", source);
      return null;
    }

    return (
      <StyledExpoImage
        ref={ref}
        style={[{ height, width, borderRadius }, style as any]}
        contentFit={contentFit ?? resizeMode}
        placeholder={{ blurhash, width, height }}
        source={imageSource}
        cachePolicy={"disk"}
        {...rest}
      />
    );
  }
);

StyledImage.displayName = "StyledImage";

export { StyledImage as Image };
