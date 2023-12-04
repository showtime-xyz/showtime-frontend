import React, { useCallback, useRef } from "react";
import { useWindowDimensions } from "react-native";

import { Image } from "@showtime-xyz/universal.image";
import Spinner from "@showtime-xyz/universal.spinner";
import { TabInfiniteScrollList } from "@showtime-xyz/universal.tab-view";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useScrollToTop } from "app/lib/react-navigation/native";
import { Link } from "app/navigation/link";
import { VideoPost } from "app/types";

import { useProfilePosts } from "../hooks/use-profile-posts";

export const PostsTab = (props: {
  index: number;
  profileUsername?: string;
}) => {
  const { index, profileUsername } = props;
  const profilePostsState = useProfilePosts(profileUsername);
  const gap = 1;
  const itemWidth = useWindowDimensions().width / 3 - gap;
  const bottomBarHeight = usePlatformBottomHeight();
  const listRef = useRef(null);
  useScrollToTop(listRef);

  const renderItem = useCallback(
    ({ item }: { item: VideoPost }) => {
      return (
        <Link
          href={`/posts?username=${item.profile.username}&type=profilePosts&postId=${item.id}`}
        >
          <Image
            style={{ width: itemWidth, height: itemWidth / 0.76, margin: gap }}
            source={{
              uri: item.media.urls.optimized_thumbnail,
            }}
          />
        </Link>
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
        ref={listRef}
        data={profilePostsState.data}
        estimatedItemSize={300}
        onEndReached={profilePostsState.fetchMore}
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
