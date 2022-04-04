import { withMemoAndColorScheme } from "app/components/memo-with-theme";
import type { NFT } from "app/types";

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

  const mediaUri = item?.loading
    ? item?.source_url
    : `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/media/nft/${item?.chain_name}/${item?.contract_address}/${item?.token_id}`;
  const mediaStillPreviewUri = mediaUri + "?still_preview";

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
      {item?.mime_type?.startsWith("image") ? (
        <PinchToZoom
          onPinchStart={onPinchStart}
          onPinchEnd={onPinchEnd}
          disabled={numColumns > 1}
        >
          {numColumns > 1 && item?.mime_type === "image/gif" && (
            <View tw="bg-transparent absolute z-1 bottom-1 right-1">
              <Play height={24} width={24} color="white" />
            </View>
          )}
          <Image
            source={{
              uri:
                numColumns > 1 && item?.mime_type === "image/gif"
                  ? mediaStillPreviewUri
                  : mediaUri,
            }}
            tw={size}
            blurhash={item?.blurhash}
            resizeMode={resizeMode}
          />
        </PinchToZoom>
      ) : null}

      {item?.mime_type?.startsWith("video") ? (
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
            resizeMode={resizeMode}
          />
        </PinchToZoom>
      ) : null}

      {item?.mime_type?.startsWith("model") ? (
        <View tw={size}>
          <Model
            url={item?.source_url}
            // TODO: update this to get a preview from CDN v2
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
