import { useCallback } from "react";
import { FlatList, useWindowDimensions } from "react-native";
import { Video } from "expo-av";
import Router from "next/router";

import { View, Image } from "design-system";
import { Pressable } from "react-native";
import { useRouter } from "app/navigation/use-router";

const getImageUrl = (imgUrl: string, tokenAspectRatio: number) => {
  if (imgUrl && imgUrl.includes("https://lh3.googleusercontent.com")) {
    if (tokenAspectRatio && tokenAspectRatio > 1) {
      imgUrl = imgUrl.split("=")[0] + "=h660";
    } else {
      imgUrl = imgUrl.split("=")[0] + "=w660";
    }
  }
  return imgUrl;
};

const getImageUrlLarge = (imgUrl: string, tokenAspectRatio: number) => {
  if (imgUrl && imgUrl.includes("https://lh3.googleusercontent.com")) {
    if (tokenAspectRatio && tokenAspectRatio > 1)
      imgUrl = imgUrl.split("=")[0] + "=h1328";
    else imgUrl = imgUrl.split("=")[0] + "=w1328";
  }

  return imgUrl;
};

type Props = {
  nfts: Array<any>;
};

function Media({ nfts }: Props) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const count = nfts.length;

  const openNFT = useCallback(
    (id: string) => {
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

  const keyExtractor = useCallback((item) => item?.nft_id?.toString(), []);

  const renderItem = useCallback(
    ({ item }) => {
      if (!item) return null;

      return (
        <Pressable onPress={() => openNFT(item.nft_id?.toString())}>
          {item.mime_type?.startsWith("image") && (
            <Image
              source={{
                uri:
                  count === 1
                    ? getImageUrlLarge(
                        item.still_preview_url
                          ? item.still_preview_url
                          : item.token_img_url,
                        item.token_aspect_ratio
                      )
                    : getImageUrl(
                        item.still_preview_url
                          ? item.still_preview_url
                          : item.token_img_url,
                        item.token_aspect_ratio
                      ),
              }}
              tw={count > 1 ? "w-[50vw] h-[50vw]" : "w-[100vw] h-[100vw]"}
              blurhash={item.blurhash}
              resizeMode="cover"
            />
          )}

          {item.mime_type?.startsWith("video") && (
            <Video
              // ref={video}
              // style={styles.video}
              source={{
                uri: item.animation_preview_url
                  ? item.animation_preview_url
                  : item?.source_url
                  ? item?.source_url
                  : item?.token_animation_url,
              }}
              useNativeControls
              resizeMode="contain"
              isLooping
              isMuted
              // onPlaybackStatusUpdate={status => setStatus(() => status)}
            />
          )}
        </Pressable>
      );
    },
    [count]
  );

  const getItemLayout = useCallback(
    (data, index) => {
      const itemHeight = data.length === 2 ? width / 2 : width;

      return {
        length: itemHeight,
        offset: itemHeight * index,
        index,
      };
    },
    [width]
  );

  const ItemSeparatorComponent = useCallback(() => <View />, []);

  if (count === 1) {
    return renderItem({ item: nfts[0] });
  }

  return (
    <FlatList
      data={nfts}
      keyExtractor={keyExtractor}
      numColumns={2}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      ItemSeparatorComponent={ItemSeparatorComponent}
      initialNumToRender={count}
      // @ts-ignore
      listKey={keyExtractor}
    />
  );
}

export { Media };
