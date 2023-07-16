import { useMemo, RefObject } from "react";
import { Platform } from "react-native";

import { Video as ExpoVideo } from "expo-av";

import { Play } from "@showtime-xyz/universal.icon";
import { Image, ResizeMode } from "@showtime-xyz/universal.image";
import { View } from "@showtime-xyz/universal.view";

import { withMemoAndColorScheme } from "app/components/memo-with-theme";
import { useContentWidth } from "app/hooks/use-content-width";
import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import type { NFT } from "app/types";
import { getMediaUrl } from "app/utilities";

import { ContentTypeIcon } from "../content-type-tooltip";

type Props = {
  item?: NFT & { loading?: boolean };
  numColumns?: number;
  tw?: string;
  sizeStyle?: {
    width?: number;
    height?: number;
  };
  resizeMode?: ResizeMode;
  onPinchStart?: () => void;
  onPinchEnd?: () => void;
  isMuted?: boolean;
  edition?: CreatorEditionResponse;
  videoRef?: RefObject<ExpoVideo>;
  theme?: "light" | "dark";
  optimizedWidth?: number;
};

function GridMediaImpl({
  item,
  numColumns = 1,
  sizeStyle = {},
  resizeMode: propResizeMode,
  edition,
  optimizedWidth = 300,
}: Props) {
  const resizeMode = propResizeMode ?? "cover";

  const mediaUri = useMemo(
    () => getMediaUrl({ nft: item, stillPreview: false }),
    [item]
  );
  const mediaStillPreviewUri = useMemo(
    () =>
      getMediaUrl({
        nft: item,
        stillPreview: true,
        optimized: true,
      }),
    [item]
  );
  const contentWidth = useContentWidth();

  const size = useMemo(() => {
    if (sizeStyle?.width) return +sizeStyle?.width;
    return contentWidth / (numColumns ?? 1);
  }, [contentWidth, numColumns, sizeStyle?.width]);

  const width = sizeStyle?.width ? +sizeStyle?.width : size;
  const height = sizeStyle?.height ? +sizeStyle?.height : size;

  return (
    <View
      style={{
        opacity: item?.loading ? 0.5 : 1,
      }}
    >
      {Boolean(edition) && (
        <View tw="absolute bottom-2.5 left-2 z-10">
          <ContentTypeIcon edition={edition} />
        </View>
      )}
      {item?.mime_type?.startsWith("image") &&
      item?.mime_type !== "image/gif" ? (
        <Image
          source={{
            uri: `${mediaUri}?optimizer=image&width=${optimizedWidth}&quality=80`,
          }}
          recyclingKey={mediaUri}
          blurhash={item?.blurhash}
          data-test-id={Platform.select({ web: "nft-card-media" })}
          width={width}
          height={height}
          style={sizeStyle}
          resizeMode={resizeMode}
          alt={item?.token_name}
          transition={200}
        />
      ) : null}

      {item?.mime_type?.startsWith("video") ||
      item?.mime_type === "image/gif" ? (
        <>
          {numColumns > 1 && (
            <View tw="absolute bottom-2 right-1 z-10 bg-transparent">
              <Play height={24} width={24} color="white" />
            </View>
          )}
          <Image
            source={{
              uri: `${mediaStillPreviewUri}?&optimizer=image&width=${optimizedWidth}&quality=80`,
            }}
            recyclingKey={mediaUri}
            data-test-id={Platform.select({ web: "nft-card-media" })}
            width={width}
            height={height}
            style={sizeStyle}
            resizeMode={resizeMode}
            alt={item?.token_name}
            transition={200}
          />
        </>
      ) : null}

      {item?.mime_type?.startsWith("model") ? (
        // This is a legacy 3D model, we don't support it anymore and fallback to image

        <Image
          source={{
            uri: item?.still_preview_url,
          }}
          recyclingKey={mediaUri}
          blurhash={item?.blurhash}
          data-test-id={Platform.select({ web: "nft-card-media-model" })}
          width={width}
          height={height}
          style={sizeStyle}
          resizeMode={resizeMode}
          alt={item?.token_name}
          transition={200}
        />
      ) : null}
    </View>
  );
}

export const GridMedia = withMemoAndColorScheme<typeof GridMediaImpl, Props>(
  GridMediaImpl
);
