import { Suspense, useMemo } from "react";
import { Platform } from "react-native";

import { ResizeMode } from "expo-av";
import dynamic from "next/dynamic";
import { ImageStyle } from "react-native-fast-image";

import { Play } from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { PinchToZoom } from "@showtime-xyz/universal.pinch-to-zoom";
import { View } from "@showtime-xyz/universal.view";

import { ErrorBoundary } from "app/components/error-boundary";
import { withMemoAndColorScheme } from "app/components/memo-with-theme";
import { useContentWidth } from "app/hooks/use-content-width";
import type { NFT } from "app/types";
import { getMediaUrl } from "app/utilities";

import { Props as ModelProps } from "design-system/model";
import { Video } from "design-system/video";

const Dynamic3dModel = dynamic<ModelProps>(
  () => import("design-system/model").then((mod) => mod.Model),
  {
    ssr: false,
  }
);

type Props = {
  item: NFT & { loading?: boolean };
  numColumns: number;
  tw?: string;
  sizeStyle?: ImageStyle;
  resizeMode?: ResizeMode;
  onPinchStart?: () => void;
  onPinchEnd?: () => void;
  isMuted?: boolean;
};

function Media({
  item,
  numColumns,
  sizeStyle = {},
  resizeMode: propResizeMode,
  onPinchStart,
  onPinchEnd,
  isMuted,
}: Props) {
  const resizeMode = propResizeMode ?? ResizeMode.COVER;

  const mediaUri = item?.loading
    ? item?.source_url
    : getMediaUrl({ nft: item, stillPreview: false });
  const mediaStillPreviewUri = getMediaUrl({ nft: item, stillPreview: true });
  const contentWidth = useContentWidth();

  const size = useMemo(() => {
    if (sizeStyle?.width) return +sizeStyle?.width;
    return contentWidth / (numColumns ?? 1);
  }, [contentWidth, numColumns, sizeStyle?.width]);

  return (
    <View
      style={{
        margin: numColumns >= 3 ? 1 : numColumns === 2 ? 2 : 0,
        opacity: item?.loading ? 0.5 : 1,
      }}
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
            style={sizeStyle}
            data-test-id={Platform.select({ web: "nft-card-media" })}
            blurhash={item?.blurhash}
            width={sizeStyle?.width ?? size}
            height={sizeStyle?.height ?? size}
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
            <View tw="z-1 absolute bottom-1 right-1 bg-transparent">
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
            width={sizeStyle?.width ?? size}
            height={sizeStyle?.height ?? size}
            style={sizeStyle}
            blurhash={item?.blurhash}
            isMuted={numColumns > 1 ? true : isMuted}
            resizeMode={resizeMode}
            //@ts-ignore
            dataSet={Platform.select({ web: { testId: "nft-card-media" } })}
          />
        </PinchToZoom>
      ) : null}

      {item?.mime_type?.startsWith("model") ? (
        <ErrorBoundary>
          <Suspense fallback={null}>
            <Dynamic3dModel
              url={item?.source_url}
              // TODO: update this to get a preview from CDN v2
              fallbackUrl={item?.still_preview_url}
              numColumns={numColumns}
              style={sizeStyle}
              blurhash={item?.blurhash}
              resizeMode={resizeMode}
            />
          </Suspense>
        </ErrorBoundary>
      ) : null}
    </View>
  );
}

const MemoizedMedia = withMemoAndColorScheme(Media);

export { MemoizedMedia as Media };
