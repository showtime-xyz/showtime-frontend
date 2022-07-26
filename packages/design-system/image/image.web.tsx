import { ComponentProps } from "react";
import { ImageURISource, ImageResizeMode } from "react-native";

// @ts-ignore
import { getImgFromArr } from "array-to-image";
import { decode } from "blurhash";
import Image from "next/image";

import { tw as tailwind } from "@showtime-xyz/universal.tailwind";
import type { TW } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { ImgProps } from "./image";

const resizeModeToObjectFit = (resizeMode: ImageResizeMode) => {
  switch (resizeMode) {
    case "cover":
      return "cover";
    case "contain":
      return "contain";
    case "stretch":
      return "fill";
    case "center":
      return "none";
    default:
      throw new Error("Unsupported resize mode: " + resizeMode);
  }
};

const getBase64Blurhash = (blurhash: string): string => {
  const pixels = decode(blurhash, 16, 16); // Uint8ClampedArray
  const image = getImgFromArr(pixels, 16, 16); // HTMLImageElement
  const src = image.src; // data:image/png;base64,iVBORw0KGgoAA...
  return src;
};

type Props = Pick<ImgProps, "source" | "resizeMode" | "onLoad"> & {
  className: string;
  source: ImageURISource;
  loading: "lazy" | "eager";
  width: number;
  height: number;
  borderRadius?: number;
  layout?: "fixed" | "intrinsic" | "responsive" | "fill";
  alt?: string;
  blurhash?: string;
};

function Img({
  source,
  loading = "lazy",
  width,
  height,
  resizeMode,
  onLoad,
  ...props
}: Props) {
  const actualHeight =
    !isNaN(height) && typeof height === "number" ? height : undefined;
  const actualWidth =
    !isNaN(width) && typeof width === "number" ? width : undefined;

  const hasHeightOrWidth = actualHeight || actualWidth;

  if (source?.uri && typeof source?.uri === "string") {
    return (
      <Image
        src={source.uri}
        loading={loading}
        width={actualWidth}
        height={actualHeight}
        onLoadingComplete={(e) => {
          onLoad?.({
            nativeEvent: {
              width: e.naturalWidth,
              height: e.naturalHeight,
            },
          });
        }}
        objectFit={resizeModeToObjectFit(
          resizeMode ??
            // When using intrinsic size use contain to avoid
            // rounding errors causing some pixel lost.
            (width != null ? "contain" : "cover")
        )}
        placeholder={width > 40 && props.blurhash ? "blur" : "empty"}
        blurDataURL={
          width > 40 && props.blurhash
            ? getBase64Blurhash(props.blurhash)
            : undefined
        }
        layout={!hasHeightOrWidth ? "fill" : undefined}
        unoptimized // We already optimize the images with our CDN
        {...props}
      />
    );
  }

  if (source) {
    return (
      <Image
        src={source as string}
        loading={loading}
        width={actualWidth}
        height={actualHeight}
        layout={!hasHeightOrWidth ? "fill" : undefined}
        {...props}
      />
    );
  }

  return null;
}

type ImageProps = { tw?: TW } & ComponentProps<typeof Img>;

function StyledImage({
  tw,
  width: propWidth = 0,
  height: propHeight = 0,
  borderRadius: propBorderRadius = 0,
  ...props
}: ImageProps) {
  const width = Number(tailwind.style(tw).width) || propWidth;
  const height = Number(tailwind.style(tw).height) || propHeight;
  const borderRadius =
    Number(tailwind.style(tw).borderRadius) || propBorderRadius;

  return (
    <View style={{ borderRadius, overflow: "hidden" }}>
      <Img
        {...props}
        className={Array.isArray(tw) ? tw.join(" ") : tw ?? ""}
        width={width}
        height={height}
      />
    </View>
  );
}

const preload = () => {};

export { StyledImage as Image, preload };
