import { ComponentProps } from "react";
import {
  // Image as ReactNativeImage,
  ImageProps as ReactNativeImageProps,
  Platform,
} from "react-native";
import { Blurhash } from "react-native-blurhash";
import FastImage from "react-native-fast-image";

import { tw as tailwind } from "design-system/tailwind";
import type { TW } from "design-system/tailwind/types";

function Img({ source, width, height, ...props }: ReactNativeImageProps) {
  return (
    <FastImage
      // @ts-ignore
      source={
        source.uri
          ? { uri: source.uri, cache: FastImage.cacheControl.immutable }
          : source
      }
      width={width}
      height={height}
      {...props}
    />
  );
  // return (
  //   <ReactNativeImage
  //     // @ts-ignore
  //     source={source.uri ? { uri: source.uri, cache: "force-cache" } : source}
  //     width={width}
  //     height={height}
  //     resizeMode="cover" // Default
  //     // @ts-ignore
  //     cache="force-cache" // iOS
  //     // resizeMethod="resize" // Android
  //     progressiveRenderingEnabled={true} // Android
  //     fadeDuration={0} // Android
  //     {...props}
  //   />
  // );
}

type ImageProps = {
  tw?: TW;
  alt?: string;
  blurhash?: string;
} & ComponentProps<typeof Img>;

function StyledImage({ tw, style, blurhash, ...props }: ImageProps) {
  const width = Number(tailwind.style(tw).width);
  const height = Number(tailwind.style(tw).height);
  // const borderRadius = Number(tailwind.style(tw).borderRadius) ?? 0

  // <View sx={{ borderRadius, overflow: 'hidden' }}>

  // TODO: fix Blurhash on Android
  if (blurhash && Platform.OS === "ios") {
    return (
      <Blurhash
        blurhash={blurhash}
        decodeWidth={16}
        decodeHeight={16}
        decodeAsync={true}
        // resizeMode={props.resizeMode}
      >
        <Img
          style={[style, tailwind.style(tw, "bg-white dark:bg-black")]}
          width={width}
          height={height}
          {...props}
        />
      </Blurhash>
    );
  }

  return (
    <Img
      style={[style, tailwind.style(tw)]}
      width={width}
      height={height}
      {...props}
    />
  );
}

export { StyledImage as Image };
