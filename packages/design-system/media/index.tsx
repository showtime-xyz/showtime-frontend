import { useCallback } from "react";
import { Pressable, useWindowDimensions } from "react-native";

import Router from "next/router";
// import { SvgUri } from "react-native-svg";
import { useSWRConfig } from "swr";

import { withMemoAndColorScheme } from "app/components/memo-with-theme";
import { mixpanel } from "app/lib/mixpanel";
import { useRouter } from "app/navigation/use-router";
import type { NFT } from "app/types";
import { NFT_DETAIL_API } from "app/utilities";

import { Play } from "design-system/icon";
import { Image } from "design-system/image";
import { Model } from "design-system/model";
import { PinchToZoom } from "design-system/pinch-to-zoom";
import { Video } from "design-system/video";
import { View } from "design-system/view";

const getImageUrl = (tokenAspectRatio: string, imgUrl?: string) => {
  if (imgUrl && imgUrl.includes("https://lh3.googleusercontent.com")) {
    if (tokenAspectRatio && Number(tokenAspectRatio) > 1) {
      imgUrl = imgUrl.split("=")[0] + "=h660";
    } else {
      imgUrl = imgUrl.split("=")[0] + "=w660";
    }
  }
  return imgUrl;
};

const getImageUrlLarge = (tokenAspectRatio: string, imgUrl?: string) => {
  if (imgUrl && imgUrl.includes("https://lh3.googleusercontent.com")) {
    if (tokenAspectRatio && Number(tokenAspectRatio) > 1)
      imgUrl = imgUrl.split("=")[0] + "=h1328";
    else imgUrl = imgUrl.split("=")[0] + "=w1328";
  }

  return imgUrl;
};

type Props = {
  item: NFT;
  numColumns: number;
  tw?: string;
};

function Media({ item, numColumns, tw }: Props) {
  const router = useRouter();
  const isNftModal = router?.pathname.includes("/nft");
  const { mutate } = useSWRConfig();

  const imageUri =
    numColumns === 1
      ? getImageUrlLarge(
          item?.token_aspect_ratio,
          item?.still_preview_url
            ? item?.still_preview_url
            : item?.token_img_url
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
        );

  const videoUri =
    item?.animation_preview_url && numColumns > 1
      ? item?.animation_preview_url
      : item?.source_url
      ? item?.source_url
      : item?.token_animation_url;

  const openNFT = useCallback(
    (id: string) => {
      mutate(`${NFT_DETAIL_API}/${id}`, {
        data: item,
      });
      const as = `/nft/${id}`;

      const href = Router.router
        ? {
            pathname: Router.pathname,
            query: { ...Router.query, id },
          }
        : as;

      router.push(href, as, { shallow: true });
    },
    [router, Router]
  );

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
        item?.token_background_color
          ? `bg-[#${item?.token_background_color}]`
          : "bg-black",
      ]}
    >
      <Pressable
        onPress={() => {
          openNFT(item?.nft_id?.toString());
          mixpanel.track("Activity - Click on NFT image, open modal");
        }}
        disabled={isNftModal}
      >
        {imageUri &&
        (item?.mime_type === "image/svg+xml" || imageUri.includes(".svg")) ? (
          <PinchToZoom>
            <Image
              source={{
                uri: `${
                  process.env.NEXT_PUBLIC_BACKEND_URL
                }/v1/media/format/img?url=${encodeURIComponent(imageUri)}`,
              }}
              tw={size}
              blurhash={item?.blurhash}
              resizeMode="cover"
            />
          </PinchToZoom>
        ) : null}

        {item?.mime_type?.startsWith("image") &&
        item?.mime_type !== "image/svg+xml" ? (
          <PinchToZoom>
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
              resizeMode="cover"
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
            <Video
              source={{
                uri: videoUri,
              }}
              posterSource={{
                uri: item?.still_preview_url,
              }}
              tw={size}
              resizeMode="cover"
            />
          </View>
        ) : null}

        {item?.mime_type?.startsWith("model") ? (
          <View tw={size}>
            <Model
              url={item?.source_url}
              fallbackUrl={item?.still_preview_url}
              numColumns={numColumns}
              blurhash={item?.blurhash}
            />
          </View>
        ) : null}
      </Pressable>
    </View>
  );
}

const MemoizedMedia = withMemoAndColorScheme(Media);

export { MemoizedMedia as Media };
