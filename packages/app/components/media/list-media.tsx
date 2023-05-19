import { useMemo, RefObject } from "react";
import { Platform } from "react-native";

import { Video as ExpoVideo } from "expo-av";

import { Image, ResizeMode } from "@showtime-xyz/universal.image";

import { withMemoAndColorScheme } from "app/components/memo-with-theme";
import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import type { NFT } from "app/types";
import { getMediaUrl } from "app/utilities";

//import { ListVideo } from "design-system/list-video";

type Props = {
  item?: NFT & { loading?: boolean };
  tw?: string;
  resizeMode?: ResizeMode;
  isMuted?: boolean;
  edition?: CreatorEditionResponse;
  videoRef?: RefObject<ExpoVideo>;
  optimizedWidth?: number;
  loading?: "eager" | "lazy";
};

function ListMediaImpl({
  item,
  resizeMode: propResizeMode,
  optimizedWidth = 300,
  loading = "lazy",
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
    () =>
      getMediaUrl({
        nft: item,
        stillPreview: true,
        animated: false,
        optimized: true,
      }),
    [item]
  );

  return (
    <>
      {item?.mime_type?.startsWith("image") &&
      item?.mime_type !== "image/gif" ? (
        <Image
          source={{
            uri: `${mediaUri}?optimizer=image&width=${optimizedWidth}&quality=70`,
          }}
          recyclingKey={mediaUri}
          blurhash={item?.blurhash}
          data-test-id={Platform.select({ web: "nft-card-media" })}
          resizeMode={resizeMode}
          alt={item?.token_name}
          style={{ height: "100%", width: "100%" }}
          loading={loading}
          transition={200}
        />
      ) : null}

      {item?.mime_type?.startsWith("video") ||
      item?.mime_type === "image/gif" ? (
        <Image
          source={{
            uri: `${mediaStillPreviewUri}?&optimizer=image&width=${optimizedWidth}&quality=70`,
          }}
          recyclingKey={mediaUri}
          blurhash={item?.blurhash}
          data-test-id={Platform.select({ web: "nft-card-media" })}
          resizeMode={resizeMode}
          alt={item?.token_name}
          style={{ height: "100%", width: "100%" }}
          loading={loading}
          transition={200}
        />
      ) : null}

      {/* TODO: Add back once we deliver videos from BunnyCDN
      {item?.mime_type?.startsWith("video") ||
      item?.mime_type === "image/gif" ? (
        <ListVideo
          source={{
            uri: mediaUri,
          }}
          posterSource={{
            uri: mediaStillPreviewUri,
          }}
          blurhash={item?.blurhash}
          isMuted={true}
          resizeMode={resizeMode as any}
          loading={loading}
        />
      ) : null}
     */}
    </>
  );
}

export const ListMedia = withMemoAndColorScheme<typeof ListMediaImpl, Props>(
  ListMediaImpl
);
