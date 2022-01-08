import { ComponentProps } from "react";
import {
  ImageProps as ReactNativeImageProps,
  ImageURISource,
  ImageResizeMode,
} from "react-native";
import Image from "next/image";
import { decode } from "blurhash";
import { getImgFromArr } from "array-to-image";

import { tw as tailwind } from "@showtime/universal-ui.tailwind";
import type { TW } from "@showtime/universal-ui.tailwind";
import { View } from "@showtime/universal-ui.view";

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

type Props = ReactNativeImageProps & {
  className: string;
  source: ImageURISource;
  loading: "lazy" | "eager";
  width: number;
  height: number;
  borderRadius: number;
  layout: "fixed" | "intrinsic" | "responsive" | "fill";
  alt?: string;
  blurhash?: string;
};

function Img({
  source,
  loading = "lazy",
  width,
  height,
  layout,
  resizeMode,
  ...props
}: Props) {
  if (source?.uri && typeof source?.uri === "string") {
    return (
      // @ts-ignore
      <Image
        src={source.uri}
        loading={loading}
        width={width}
        height={height}
        layout={layout}
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
            : null
        }
        {...props}
      />
    );
  }

  // @ts-ignore
  return (
    <Image
      src={source as string}
      loading={loading}
      width={width}
      height={height}
      {...props}
    />
  );
}

type ImageProps = { tw?: TW } & ComponentProps<typeof Img>;

function StyledImage({ tw, ...props }: ImageProps) {
  const width = Number(tailwind.style(tw).width);
  const height = Number(tailwind.style(tw).height);
  const borderRadius = Number(tailwind.style(tw).borderRadius);

  return (
    <View sx={{ borderRadius, overflow: "hidden" }}>
      <Img className={tw} width={width} height={height} {...props} />
    </View>
  );
}

export { StyledImage as Image };
