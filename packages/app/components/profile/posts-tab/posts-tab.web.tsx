import React, { useCallback } from "react";
import { useWindowDimensions } from "react-native";

import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import Spinner from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { Link } from "app/navigation/link";
import { VideoPost } from "app/types";

import { useProfilePosts } from "../hooks/use-profile-posts";

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
    ({ item }: { item: VideoPost }) => {
      return (
        <Link
          href={`/posts?username=${item.profile.username}&type=profilePosts&postId=${item.id}`}
          as={`/posts/${item.id}`}
        >
          <img
            style={{
              margin: gap,
              objectFit: "cover",
              width: itemWidth,
              maxWidth: `calc(100% - ${gap}px)`,
              aspectRatio: 0.76,
            }}
            src={item.media.urls.optimized_thumbnail}
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
        <View tw="mt-12">
          <Text tw="text-center text-xl font-semibold text-gray-700 dark:text-gray-100">
            No Posts
          </Text>
        </View>
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
      <InfiniteScrollList
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
