import { ComponentProps } from "react";

import { Blurhash } from "react-native-blurhash";
import FastImage from "react-native-fast-image";
import type { FastImageProps, Source } from "react-native-fast-image";

import { tw as tailwind } from "@showtime-xyz/universal.tailwind";
import type { TW } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

export type ImgProps = FastImageProps & {
  height?: number;
  width?: number;
  borderRadius?: number;
};

function Img({ source, height, width, borderRadius, ...props }: ImgProps) {
  return (
    <FastImage
      source={
        Object.prototype.hasOwnProperty.call(source, "uri")
          ? { ...(source as Source), cache: FastImage.cacheControl.immutable }
          : source
      }
      style={[props.style, { height, width, borderRadius }]}
      {...props}
    />
  );
}

type ImageProps = {
  tw?: TW;
  alt?: string;
  blurhash?: string;
} & ComponentProps<typeof Img>;

function StyledImage({
  tw,
  style,
  width: propWidth = 0,
  height: propHeight = 0,
  borderRadius: propBorderRadius = 0,
  blurhash,
  ...props
}: ImageProps) {
  const width = Number(tailwind.style(tw).width) || propWidth;
  const height = Number(tailwind.style(tw).height) || propHeight;
  const borderRadius =
    Number(tailwind.style(tw).borderRadius) || propBorderRadius;

  if (blurhash) {
    return (
      <View>
        <View tw="absolute">
          <Blurhash
            blurhash={blurhash}
            decodeWidth={16}
            decodeHeight={16}
            decodeAsync={true}
            style={[style, tailwind.style(tw)]}
          />
        </View>
        <Img
          {...props}
          style={[style, tailwind.style(tw)]}
          width={width}
          height={height}
          borderRadius={borderRadius}
        />
      </View>
    );
  }

  return (
    <Img
      style={[style, tailwind.style(tw)]}
      width={width}
      height={height}
      borderRadius={borderRadius}
      {...props}
    />
  );
}

const preload = (sources: string[]) => {
  FastImage.preload(sources.map((source) => ({ uri: source })));
};

export { StyledImage as Image, preload };
