import React, { useCallback } from "react";
import { useWindowDimensions } from "react-native";

import { Image } from "@showtime-xyz/universal.image";
import Spinner from "@showtime-xyz/universal.spinner";
import { TabInfiniteScrollList } from "@showtime-xyz/universal.tab-view";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";

import { ProfilePost, useProfilePosts } from "../hooks/use-profile-posts";

export const PostsTab = (props: {
  index: number;
  profileUsername?: string;
}) => {
  const { index, profileUsername } = props;
  const profilePostsState = useProfilePosts(profileUsername);
  const itemWidth = useWindowDimensions().width / 3 - 2;
  const bottomBarHeight = usePlatformBottomHeight();
  const gap = 1;

  const renderItem = useCallback(
    ({ item }: { item: ProfilePost }) => {
      return (
        <Image
          style={{ width: itemWidth, height: itemWidth / 0.76, margin: gap }}
          source={{
            uri: item.media.urls.optimized_thumbnail,
          }}
        />
      );
    },
    [itemWidth]
  );

  const ListEmptyComponent = useCallback(() => {
    if (profilePostsState.isLoading) {
      return (
        <View tw="mt-4 items-center">
          <Spinner />
        </View>
      );
    }

    if (profilePostsState.error) {
      return (
        <Text tw="pt-10 text-center text-xl font-semibold text-gray-700 dark:text-gray-100">
          Something went wrong!
        </Text>
      );
    }
    if (profilePostsState.data?.length === 0) {
      return (
        <Text tw="pt-10 text-center text-xl font-semibold text-gray-700 dark:text-gray-100">
          No Posts
        </Text>
      );
    }
    return null;
  }, [
    profilePostsState.data?.length,
    profilePostsState.error,
    profilePostsState.isLoading,
  ]);

  return (
    <View style={{ margin: -gap }}>
      <TabInfiniteScrollList
        index={index}
        data={profilePostsState.data}
        estimatedItemSize={300}
        numColumns={3}
        style={{ paddingBottom: bottomBarHeight }}
        ListEmptyComponent={ListEmptyComponent}
        renderItem={renderItem}
        refreshing={false}
        onRefresh={profilePostsState.mutate}
      />
    </View>
  );
};
