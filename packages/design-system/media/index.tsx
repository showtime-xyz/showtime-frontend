import { withMemoAndColorScheme } from "app/components/memo-with-theme";
import type { NFT } from "app/types";
import { getMediaUrl } from "app/utilities";

import { Play } from "design-system/icon";
import { Image } from "design-system/image";
import { Model } from "design-system/model";
import { PinchToZoom } from "design-system/pinch-to-zoom";
import { Video } from "design-system/video";
import { View } from "design-system/view";

type Props = {
  item: NFT & { loading?: boolean };
  numColumns: number;
  tw?: string;
  resizeMode?: "contain" | "cover";
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

  const mediaUri = item?.loading
    ? item?.source_url
    : getMediaUrl({ nft: item, stillPreview: false });
  const mediaStillPreviewUri = getMediaUrl({ nft: item, stillPreview: true });

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
      {item?.mime_type?.startsWith("image") &&
      item?.mime_type !== "image/gif" ? (
        <PinchToZoom
          onPinchStart={onPinchStart}
          onPinchEnd={onPinchEnd}
          disabled={numColumns > 1}
        >
          <Image
            source={{
              uri: mediaUri,
            }}
            tw={size}
            blurhash={item?.blurhash}
            resizeMode={resizeMode}
          />
        </PinchToZoom>
      ) : null}

      {item?.mime_type?.startsWith("video") ||
      item?.mime_type === "image/gif" ? (
        <PinchToZoom
          onPinchStart={onPinchStart}
          onPinchEnd={onPinchEnd}
          disabled={numColumns > 1}
        >
          {numColumns > 1 && (
            <View tw="bg-transparent absolute z-1 bottom-1 right-1">
              <Play height={24} width={24} color="white" />
            </View>
          )}
          <Video
            source={{
              uri: mediaUri,
            }}
            posterSource={{
              uri: mediaStillPreviewUri,
            }}
            tw={size}
            blurhash={item?.blurhash}
            resizeMode={resizeMode}
          />
        </PinchToZoom>
      ) : null}

      {item?.mime_type?.startsWith("model") ? (
        <Model
          url={item?.source_url}
          // TODO: update this to get a preview from CDN v2
          fallbackUrl={item?.still_preview_url}
          numColumns={numColumns}
          tw={size}
          blurhash={item?.blurhash}
          resizeMode={resizeMode}
        />
      ) : null}
    </View>
  );
}

const MemoizedMedia = withMemoAndColorScheme(Media);

export { MemoizedMedia as Media };
