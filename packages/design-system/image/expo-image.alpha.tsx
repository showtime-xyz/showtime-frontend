// import { ImageStyle as RNImageStyle } from "react-native";

// import { Image, ImageProps as ExpoImageProps } from "expo-image";

// import { styled } from "@showtime-xyz/universal.tailwind";
// import type { TW } from "@showtime-xyz/universal.tailwind";

// import { ResizeMode } from "./types";

// export type ImgProps = Omit<ExpoImageProps, "resizeMode"> & {
//   height?: number;
//   width?: number;
//   borderRadius?: number;
//   blurhash?: string;
//   resizeMode?: ResizeMode;
// };

// const StyledExpoImage = styled(Image);

// type ImageProps = {
//   tw?: TW;
//   alt?: string;
// } & ImgProps;

// function Img({
//   source,
//   height,
//   width,
//   borderRadius,
//   style,
//   blurhash,
//   resizeMode = "cover",
//   contentFit,
//   ...rest
// }: ImgProps) {
//   return (
//     <StyledExpoImage
//       source={source}
//       style={[{ height, width, borderRadius }, style as RNImageStyle]}
//       contentFit={contentFit ?? resizeMode}
//       placeholder={{ blurhash, width, height }}
//       cachePolicy="memory-disk"
//       {...rest}
//     />
//   );
// }
// function StyledImage({ width, height, borderRadius, ...rest }: ImageProps) {
//   return (
//     <Img width={width} height={height} borderRadius={borderRadius} {...rest} />
//   );
// }

// export { StyledImage as Image };
