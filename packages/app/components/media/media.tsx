import { useMemo, RefObject } from "react";
import { Platform } from "react-native";

import { Video as ExpoVideo } from "expo-av";

import { Play } from "@showtime-xyz/universal.icon";
import { Image, ResizeMode } from "@showtime-xyz/universal.image";
import { PinchToZoom } from "@showtime-xyz/universal.pinch-to-zoom";
import { View } from "@showtime-xyz/universal.view";

import { withMemoAndColorScheme } from "app/components/memo-with-theme";
import { useContentWidth } from "app/hooks/use-content-width";
import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import type { NFT } from "app/types";
import { getMediaUrl } from "app/utilities";

import { Video } from "design-system/video";

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
  loading?: "eager" | "lazy";
  withVideoBackdrop?: boolean;
  quality?: number;
};

function MediaImplementation({
  item,
  numColumns = 1,
  sizeStyle = {},
  resizeMode: propResizeMode,
  onPinchStart,
  onPinchEnd,
  isMuted,
  edition,
  videoRef,
  optimizedWidth = 800,
  quality = 70,
  loading = "lazy",
  withVideoBackdrop = false,
}: Props) {
  const resizeMode = propResizeMode ?? "cover";

  const mediaUri = item?.loading
    ? item?.source_url
    : getMediaUrl({ nft: item, stillPreview: false });
  const mediaStillPreviewUri = getMediaUrl({ nft: item, stillPreview: true });
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
        height: Platform.OS === "web" ? "inherit" : height,
        width: Platform.OS === "web" ? "inherit" : width,
      }}
    >
      {Boolean(edition) && (
        <View tw="absolute bottom-0.5 left-0.5 z-10">
          <ContentTypeIcon edition={edition} />
        </View>
      )}
      {item?.mime_type?.startsWith("image") &&
      item?.mime_type !== "image/gif" ? (
        <PinchToZoom
          onPinchStart={onPinchStart}
          onPinchEnd={onPinchEnd}
          disabled={numColumns > 1}
        >
          <Image
            source={{
              uri: `${mediaUri}?optimizer=image&width=${optimizedWidth}&quality=${quality}&sharpen=true`,
            }}
            recyclingKey={mediaUri}
            blurhash={item?.blurhash}
            data-test-id={Platform.select({ web: "nft-card-media" })}
            width={width}
            height={height}
            style={sizeStyle}
            resizeMode={resizeMode}
            alt={item?.token_name}
            loading={loading}
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
            <View tw="absolute bottom-2.5 right-2.5 z-10 bg-transparent">
              <Play height={24} width={24} color="white" />
            </View>
          )}
          <Video
            ref={videoRef}
            source={{
              uri: mediaUri,
            }}
            posterSource={{
              uri: `${mediaStillPreviewUri}?&optimizer=image&width=${optimizedWidth}&quality=${quality}&sharpen=true`,
            }}
            width={width}
            height={height}
            style={sizeStyle}
            blurhash={item?.blurhash}
            isMuted={isMuted ?? numColumns > 1 ? true : isMuted}
            resizeMode={resizeMode as any}
            loading={loading}
            //@ts-ignore
            dataset={Platform.select({ web: { testId: "nft-card-media" } })}
            withVideoBackdrop={withVideoBackdrop}
          />
        </PinchToZoom>
      ) : null}

      {item?.mime_type?.startsWith("model") ? (
        // This is a legacy 3D model, we don't support it anymore and fallback to image
        <PinchToZoom
          onPinchStart={onPinchStart}
          onPinchEnd={onPinchEnd}
          disabled={numColumns > 1}
        >
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
            loading={loading}
          />
        </PinchToZoom>
      ) : null}
    </View>
  );
}

export const Media = withMemoAndColorScheme<typeof MediaImplementation, Props>(
  MediaImplementation
);
