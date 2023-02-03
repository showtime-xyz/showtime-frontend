import { Image, ImageProps as ExpoImageProps } from "expo-image";

import { styled } from "@showtime-xyz/universal.tailwind";

export type ImgProps = ExpoImageProps & {
  height?: number;
  width?: number;
  borderRadius?: number;
};

const StyledExpoImage = styled(Image);

type ImageProps = Omit<ExpoImageProps, "resizeMode"> & {
  tw?: string;
  alt?: string;
  blurhash?: string;
  resizeMode?: any;
} & ImgProps;

function StyledImage({
  borderRadius,
  source,
  height,
  width,
  style,
  contentFit,
  resizeMode,
  blurhash,
  ...rest
}: ImageProps) {
  return (
    <StyledExpoImage
      source={source}
      style={[{ height, width, borderRadius }, style as any]}
      contentFit={contentFit ?? resizeMode}
      placeholder={{ blurhash, width, height }}
      {...rest}
    />
  );
}

export { StyledImage as Image };
