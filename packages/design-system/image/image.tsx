import { ComponentProps } from "react";

import { Blurhash } from "react-native-blurhash";
import FastImage from "react-native-fast-image";
import type { FastImageProps, Source } from "react-native-fast-image";

import { styled } from "@showtime-xyz/universal.tailwind";
import type { TW } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

export type ImgProps = FastImageProps & {
  height?: number;
  width?: number;
  borderRadius?: number;
};

const StyledFastImage = styled(FastImage);

function Img({ source, height, width, borderRadius, ...props }: ImgProps) {
  return (
    <StyledFastImage
      {...props}
      source={
        Object.prototype.hasOwnProperty.call(source, "uri")
          ? { ...(source as Source), cache: FastImage.cacheControl.immutable }
          : source
      }
      style={[props.style, { height, width, borderRadius }]}
    />
  );
}

type ImageProps = {
  tw?: TW;
  alt?: string;
  blurhash?: string;
} & ComponentProps<typeof Img>;

function StyledImage({
  width = 0,
  height = 0,
  borderRadius = 0,
  blurhash,
  ...props
}: ImageProps) {
  if (blurhash) {
    return (
      <>
        <View tw="absolute">
          <Blurhash
            {...props}
            blurhash={blurhash}
            decodeWidth={16}
            decodeHeight={16}
            decodeAsync={true}
          />
        </View>
        <Img
          {...props}
          width={width}
          height={height}
          borderRadius={borderRadius}
        />
      </>
    );
  }

  return (
    <Img {...props} width={width} height={height} borderRadius={borderRadius} />
  );
}

const preload = (sources: string[]) => {
  FastImage.preload(sources.map((source) => ({ uri: source })));
};

export { StyledImage as Image, preload };
