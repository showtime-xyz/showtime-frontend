import { memo, useCallback } from "react";
import { Pressable, useWindowDimensions } from "react-native";
import Router from "next/router";
import { SvgUri } from "react-native-svg";

import { useRouter } from "app/navigation/use-router";
import { mixpanel } from "app/lib/mixpanel";
import type { NFT } from "app/types";

import { View } from "design-system/view";
import { Image } from "design-system/image";
import { Video } from "design-system/video";
import { Model } from "design-system/model";
import { PinchToZoom } from "design-system/pinch-to-zoom";
import { withMemoAndColorScheme } from "app/components/memoWithTheme";

const getImageUrl = (imgUrl: string, tokenAspectRatio: string) => {
  if (imgUrl && imgUrl.includes("https://lh3.googleusercontent.com")) {
    if (tokenAspectRatio && Number(tokenAspectRatio) > 1) {
      imgUrl = imgUrl.split("=")[0] + "=h660";
    } else {
      imgUrl = imgUrl.split("=")[0] + "=w660";
    }
  }
  return imgUrl;
};

const getImageUrlLarge = (imgUrl: string, tokenAspectRatio: string) => {
  if (imgUrl && imgUrl.includes("https://lh3.googleusercontent.com")) {
    if (tokenAspectRatio && Number(tokenAspectRatio) > 1)
      imgUrl = imgUrl.split("=")[0] + "=h1328";
    else imgUrl = imgUrl.split("=")[0] + "=w1328";
  }

  return imgUrl;
};

type Props = {
  item: NFT;
  count: number;
};

function Media({ item, count }: Props) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isNftModal = router?.pathname.includes("/nft");

  const openNFT = useCallback(
    (id: string) => {
      const path = router.pathname.startsWith("/trending") ? "/trending" : "";
      const as = `${path}/nft/${id}`;

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

  return (
    <View
      tw={[
        count >= 2 ? "m-[2px]" : "",
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
        {item?.mime_type === "image/svg+xml" && (
          <SvgUri
            width={count > 1 ? width / 2 : width}
            height={count > 1 ? width / 2 : width}
            uri={item?.token_img_url}
          />
        )}

        {item?.mime_type?.startsWith("image") &&
          item?.mime_type !== "image/svg+xml" && (
            <PinchToZoom>
              <Image
                source={{
                  uri:
                    count === 1
                      ? getImageUrlLarge(
                          item?.still_preview_url
                            ? item?.still_preview_url
                            : item?.token_img_url,
                          item?.token_aspect_ratio
                        )
                      : getImageUrl(
                          item?.still_preview_url
                            ? item?.still_preview_url
                            : item?.token_img_url,
                          item?.token_aspect_ratio
                        ),
                }}
                tw={count > 1 ? "w-[50vw] h-[50vw]" : "w-[100vw] h-[100vw]"}
                blurhash={item?.blurhash}
                resizeMode="cover"
              />
            </PinchToZoom>
          )}

        {item?.mime_type?.startsWith("video") && (
          <Video
            source={{
              uri: item?.animation_preview_url
                ? item?.animation_preview_url
                : item?.source_url
                ? item?.source_url
                : item?.token_animation_url,
            }}
            posterSource={{
              uri: item?.still_preview_url,
            }}
            tw={count > 1 ? "w-[50vw] h-[50vw]" : "w-[100vw] h-[100vw]"}
            resizeMode="cover"
            useNativeControls={count === 1}
          />
        )}

        {item?.mime_type?.startsWith("model") && (
          <View tw={count > 1 ? "w-[50vw] h-[50vw]" : "w-[100vw] h-[100vw]"}>
            <Model
              url={item?.source_url}
              fallbackUrl={item?.still_preview_url}
              count={count}
              blurhash={item?.blurhash}
            />
          </View>
        )}
      </Pressable>
    </View>
  );
}

const MemoizedMedia = withMemoAndColorScheme(Media);

export { MemoizedMedia as Media };
