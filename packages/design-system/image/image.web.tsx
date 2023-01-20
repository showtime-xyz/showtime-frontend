import { ComponentProps, CSSProperties, useCallback } from "react";
import { ImageURISource } from "react-native";

// @ts-ignore
import { getImgFromArr } from "array-to-image";
import { decode } from "blurhash";
import Image, { ImageProps as NextImageProps } from "next/image";

import type { TW } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { ResizeMode, ImageNativeProps, ContentFit } from "./types";

const getBase64Blurhash = (blurhash: string): string => {
  const pixels = decode(blurhash, 16, 16); // Uint8ClampedArray
  const image = getImgFromArr(pixels, 16, 16); // HTMLImageElement
  const src = image.src; // data:image/png;base64,iVBORw0KGgoAA...
  return src;
};

type Props = Pick<ImageNativeProps, "source" | "onLoad"> &
  Omit<NextImageProps, "src"> & {
    className: string;
    source: ImageURISource;
    loading: "lazy" | "eager";
    width: number;
    height: number;
    borderRadius?: number;
    layout?: "fixed" | "intrinsic" | "responsive" | "fill";
    alt: string; // Required from Next.js 13
    blurhash?: string;
    style?: CSSProperties;
    resizeMode?: ResizeMode;
    contentFit?: ContentFit;
  };

function Img({
  source,
  loading = "lazy",
  width,
  height,
  resizeMode = "cover",
  contentFit,
  onLoad,
  style,
  onLoadingComplete: onLoadingCompleteProps,
  ...props
}: Props) {
  const actualHeight =
    !isNaN(height) && typeof height === "number" ? height : undefined;
  const actualWidth =
    !isNaN(width) && typeof width === "number" ? width : undefined;

  const hasHeightOrWidth = actualHeight || actualWidth;

  const onLoadingComplete = useCallback(
    (e: HTMLImageElement) => {
      // this is for using expo-image
      // onLoad?.({
      //   cacheType: "none",
      //   source: {
      //     url: e.currentSrc,
      //     width: e.naturalWidth,
      //     height: e.naturalHeight,
      //     mediaType: null,
      //   },
      // });
      onLoad?.({
        nativeEvent: {
          width: e.naturalWidth,
          height: e.naturalHeight,
        },
      });
      onLoadingCompleteProps?.(e);
    },
    [onLoad, onLoadingCompleteProps]
  );
  if (source?.uri && typeof source?.uri === "string") {
    return (
      <Image
        src={source.uri}
        style={{
          objectFit: (contentFit ?? resizeMode) as any,
          ...style,
        }}
        loading={loading}
        width={width}
        height={height}
        onLoadingComplete={onLoadingComplete}
        placeholder={width > 40 && props.blurhash ? "blur" : "empty"}
        blurDataURL={
          width > 40 && props.blurhash
            ? getBase64Blurhash(props.blurhash)
            : undefined
        }
        fill={!hasHeightOrWidth}
        unoptimized // We already optimize the images with our CDN
        {...props}
      />
    );
  }

  if (typeof source === "string") {
    return (
      <Image
        src={source}
        loading={loading}
        width={width}
        height={height}
        fill={!hasHeightOrWidth}
        {...props}
      />
    );
  }

  return null;
}

type ImageProps = { tw?: TW; style?: any } & ComponentProps<typeof Img>;

function StyledImage({ borderRadius = 0, tw = "", ...props }: ImageProps) {
  return (
    <View
      style={{
        borderRadius,
        overflow: "hidden",
      }}
    >
      <Img {...props} className={Array.isArray(tw) ? tw.join(" ") : tw} />
    </View>
  );
}

export { StyledImage as Image };
