import { Suspense } from "react";
import { Platform } from "react-native";

import { ResizeMode } from "expo-av";
import dynamic from "next/dynamic";

import { Play } from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { PinchToZoom } from "@showtime-xyz/universal.pinch-to-zoom";
import { View } from "@showtime-xyz/universal.view";

import { ErrorBoundary } from "app/components/error-boundary";
import { withMemoAndColorScheme } from "app/components/memo-with-theme";
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
  sizeStyle?: object;
  resizeMode?: ResizeMode;
  onPinchStart?: () => void;
  onPinchEnd?: () => void;
};

function Media({
  item,
  numColumns,
  tw,
  sizeStyle,
  resizeMode: propResizeMode,
  onPinchStart,
  onPinchEnd,
}: Props) {
  const resizeMode = propResizeMode ?? ResizeMode.COVER;

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
            tw={!sizeStyle ? size : ""}
            style={sizeStyle}
            data-test-id={Platform.select({ web: "nft-card-media" })}
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
          {/* we show play icon only on native because videos are not auto played on native */}
          {numColumns > 1 && Platform.OS !== "web" && (
            <View tw="z-1 absolute bottom-1 right-1 bg-transparent">
              <Play height={24} width={24} color="white" />
            </View>
          )}
          <Video
            source={{
              uri: mediaUri,
            }}
            //@ts-ignore
            dataSet={Platform.select({ web: { testId: "nft-card-media" } })}
            posterSource={{
              uri: mediaStillPreviewUri,
            }}
            tw={!sizeStyle ? size : ""}
            style={sizeStyle}
            blurhash={item?.blurhash}
            resizeMode={resizeMode}
            //  we always show mute button on web because videos are auto played on web
            showMuteButton={numColumns === 1 || Platform.OS === "web"}
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
              tw={!sizeStyle ? size : ""}
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
