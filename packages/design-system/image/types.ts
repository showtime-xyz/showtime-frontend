import type {
  FastImageProps,
  ResizeMode as FastImageResizeMode,
} from "react-native-fast-image";

export type ContentFit = "cover" | "contain" | "fill" | "none" | "scale-down";

export type ImageNativeProps = FastImageProps;

// it's from expo-image prop, will use expo-image' ImageSource type if we bring back to expo-iamge.
export type ImageSource = {
  /**
   * A string representing the resource identifier for the image,
   * which could be an http address, a local file path, or the name of a static image resource.
   */
  uri?: string;
  /**
   * An object representing the HTTP headers to send along with the request for a remote image.
   */
  headers?: Record<string, string>;
  /**
   * Can be specified if known at build time, in which case the value
   * will be used to set the default `<Image/>` component dimension
   */
  width?: number;
  /**
   * Can be specified if known at build time, in which case the value
   * will be used to set the default `<Image/>` component dimension
   */
  height?: number;

  /**
   * The blurhash string to use to generate the image. You can read more about the blurhash
   * on [`woltapp/blurhash`](https://github.com/woltapp/blurhash) repo. Ignored when `uri` is provided.
   * When using the blurhash, you should also provide `width` and `height` (higher values reduce performance),
   * otherwise their default value is `16`.
   */
  blurhash?: string;
};

export type ResizeMode = FastImageResizeMode;
export type ImageProps = FastImageProps & {};
