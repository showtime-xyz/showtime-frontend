import { ComponentProps, CSSProperties } from "react";
import { ImageURISource, ImageResizeMode } from "react-native";

// @ts-ignore
import { getImgFromArr } from "array-to-image";
import { decode } from "blurhash";
import Image from "next/image";

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
  alt: string; // Required from Next.js 13
  blurhash?: string;
  style?: CSSProperties;
};

function Img({
  source,
  loading = "lazy",
  width,
  height,
  resizeMode,
  onLoad,
  style,
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
        style={{
          objectFit: resizeModeToObjectFit(
            resizeMode ??
              // When using intrinsic size use contain to avoid
              // rounding errors causing some pixel lost.
              (width != null ? "contain" : "cover")
          ),
          ...style,
        }}
        loading={loading}
        width={width}
        height={height}
        onLoadingComplete={(e) => {
          onLoad?.({
            nativeEvent: {
              width: e.naturalWidth,
              height: e.naturalHeight,
            },
          });
        }}
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
        width={width}
        height={height}
        layout={!hasHeightOrWidth ? "fill" : undefined}
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

const preload = () => {};

export { StyledImage as Image, preload };
