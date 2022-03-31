import { withMemoAndColorScheme } from "app/components/memo-with-theme";
import type { NFT } from "app/types";

import { Play } from "design-system/icon";
import { Image } from "design-system/image";
import { Model } from "design-system/model";
import { PinchToZoom } from "design-system/pinch-to-zoom";
import { Video } from "design-system/video";
import { View } from "design-system/view";

const getImageUrl = (tokenAspectRatio: string, imgUrl?: string) => {
  if (imgUrl && imgUrl.includes("https://lh3.googleusercontent.com")) {
    if (tokenAspectRatio && Number(tokenAspectRatio) > 1) {
      imgUrl = imgUrl.split("=")[0] + "=h1328";
    } else {
      imgUrl = imgUrl.split("=")[0] + "=w1328";
    }
  }
  return imgUrl;
};

type Props = {
  item: NFT & { loading?: boolean };
  numColumns: number;
  tw?: string;
  resizeMode?: "contain";
  onPinchStart?: () => void;
  onPinchEnd?: () => void;
};

function Media({
  item,
  numColumns,
  tw,
  resizeMode: propResizeMode,
  onPinchStart,
  onPinchEnd,
}: Props) {
  const resizeMode = propResizeMode ?? "cover";

  const imageUri =
    numColumns === 1
      ? getImageUrl(
          item?.token_aspect_ratio,
          item?.still_preview_url
            ? item?.still_preview_url
            : item?.token_img_url
            ? item?.token_img_url
            : item?.source_url
        )
      : getImageUrl(
          item?.token_aspect_ratio,
          item?.mime_type === "image/gif"
            ? // Would be cool if this was handled on the backend
              // `still_preview_url` should be a still image
              `${
                process.env.NEXT_PUBLIC_BACKEND_URL
              }/v1/media/format/img?url=${encodeURIComponent(
                item?.still_preview_url
              )}`
            : item?.still_preview_url
            ? item?.still_preview_url
            : item?.token_img_url
            ? item?.token_img_url
            : item?.source_url
        );

  const videoUri =
    item?.animation_preview_url && numColumns > 1
      ? item?.animation_preview_url
      : item?.source_url
      ? item?.source_url
      : item?.token_animation_url;

  const size = tw
    ? tw
    : numColumns === 3
    ? "w-[33vw] h-[33vw]"
    : numColumns === 2
    ? "w-[50vw] h-[50vw]"
    : "w-[100vw] h-[100vw]";

  return (
    <View
      tw={[
        numColumns >= 3 ? "m-[1px]" : numColumns === 2 ? "m-[2px]" : "",
        item?.loading ? "opacity-50" : "opacity-100",
      ]}
    >
      {imageUri &&
      (item?.mime_type === "image/svg+xml" || imageUri.includes(".svg")) ? (
        <PinchToZoom onPinchEnd={onPinchEnd} onPinchStart={onPinchStart}>
          <Image
            source={{
              uri: `${
                process.env.NEXT_PUBLIC_BACKEND_URL
              }/v1/media/format/img?url=${encodeURIComponent(imageUri)}`,
            }}
            tw={size}
            blurhash={item?.blurhash}
            resizeMode={resizeMode}
          />
        </PinchToZoom>
      ) : null}

      {item?.mime_type?.startsWith("image") &&
      item?.mime_type !== "image/svg+xml" ? (
        <PinchToZoom onPinchStart={onPinchStart} onPinchEnd={onPinchEnd}>
          {numColumns > 1 && item?.mime_type === "image/gif" && (
            <View tw="bg-transparent absolute z-1 bottom-1 right-1">
              <Play height={24} width={24} color="white" />
            </View>
          )}
          <Image
            source={{
              uri: imageUri,
            }}
            tw={size}
            blurhash={item?.blurhash}
            resizeMode={resizeMode}
          />
        </PinchToZoom>
      ) : null}

      {item?.mime_type?.startsWith("video") ? (
        <View>
          {numColumns > 1 && (
            <View tw="bg-transparent absolute z-1 bottom-1 right-1">
              <Play height={24} width={24} color="white" />
            </View>
          )}
          <PinchToZoom onPinchStart={onPinchStart} onPinchEnd={onPinchEnd}>
            <Video
              source={{
                uri: videoUri,
              }}
              posterSource={{
                uri: item?.still_preview_url,
              }}
              tw={size}
              resizeMode={resizeMode}
            />
          </PinchToZoom>
        </View>
      ) : null}

      {item?.mime_type?.startsWith("model") ? (
        <View tw={size}>
          <Model
            url={item?.source_url}
            fallbackUrl={item?.still_preview_url}
            numColumns={numColumns}
            blurhash={item?.blurhash}
            // {...mediaProps}
          />
        </View>
      ) : null}
    </View>
  );
}

const MemoizedMedia = withMemoAndColorScheme(Media);

export { MemoizedMedia as Media };
