import { Suspense, useMemo, RefObject } from "react";
import { Platform } from "react-native";

import { Video as ExpoVideo } from "expo-av";
import dynamic from "next/dynamic";

import { Play } from "@showtime-xyz/universal.icon";
import { Image, ResizeMode } from "@showtime-xyz/universal.image";
import { PinchToZoom } from "@showtime-xyz/universal.pinch-to-zoom";
import { View } from "@showtime-xyz/universal.view";

import { ErrorBoundary } from "app/components/error-boundary";
import { withMemoAndColorScheme } from "app/components/memo-with-theme";
import { useContentWidth } from "app/hooks/use-content-width";
import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import type { NFT } from "app/types";
import { getMediaUrl } from "app/utilities";

import { Props as ModelProps } from "design-system/model";
import { Video } from "design-system/video";

import { ContentTypeIcon } from "../content-type-tooltip";

type Props = {
  item?: NFT & { loading?: boolean };
  tw?: string;
  resizeMode?: ResizeMode;
  isMuted?: boolean;
  edition?: CreatorEditionResponse;
  videoRef?: RefObject<ExpoVideo>;
};

function ListMediaImpl({
  item,
  resizeMode: propResizeMode,
  isMuted,
  edition,
  videoRef,
}: Props) {
  const resizeMode = propResizeMode ?? "cover";

  const mediaUri = useMemo(
    () =>
      item?.loading
        ? item?.source_url
        : getMediaUrl({ nft: item, stillPreview: false }),
    [item]
  );

  const mediaStillPreviewUri = useMemo(
    () => getMediaUrl({ nft: item, stillPreview: true }),
    [item]
  );

  return (
    <>
      {Boolean(edition) && (
        <View tw="absolute bottom-0.5 left-0.5 z-10">
          <ContentTypeIcon edition={edition} />
        </View>
      )}
      {item?.mime_type?.startsWith("image") &&
      item?.mime_type !== "image/gif" ? (
        <Image
          source={{
            uri: mediaUri,
          }}
          recyclingKey={mediaUri}
          blurhash={item?.blurhash}
          data-test-id={Platform.select({ web: "nft-card-media" })}
          resizeMode={resizeMode}
          alt={item?.token_name}
        />
      ) : null}

      {item?.mime_type?.startsWith("video") ||
      item?.mime_type === "image/gif" ? (
        <Video
          videoStyle={{ width: "100%", height: "100%" }}
          ref={videoRef}
          source={{
            uri: mediaUri,
          }}
          posterSource={{
            uri: mediaStillPreviewUri,
          }}
          blurhash={item?.blurhash}
          isMuted={isMuted ?? true}
          resizeMode={resizeMode as any}
          //@ts-ignore
          dataset={Platform.select({ web: { testId: "nft-card-media" } })}
        />
      ) : null}
    </>
  );
}

export const ListMedia = withMemoAndColorScheme<typeof ListMediaImpl, Props>(
  ListMediaImpl
);
