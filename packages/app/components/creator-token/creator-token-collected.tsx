import { useCallback } from "react";
import { useWindowDimensions, Platform } from "react-native";

import type { ListRenderItemInfo } from "@shopify/flash-list";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Showtime } from "@showtime-xyz/universal.icon";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { PressableHover } from "@showtime-xyz/universal.pressable-hover";
import { useRouter } from "@showtime-xyz/universal.router";
import Spinner from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View, ViewProps } from "@showtime-xyz/universal.view";

import { EmptyPlaceholder } from "app/components/empty-placeholder";
import { ErrorBoundary } from "app/components/error-boundary";
import {
  CreatorTokenUser,
  useCreatorTokenCoLlected,
  useCreatorTokenCollectors,
} from "app/hooks/creator-token/use-creator-tokens";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { createParam } from "app/navigation/use-param";

import { breakpoints } from "design-system/theme";

import {
  CreatorTokensTitle,
  TopCreatorTokensItem,
} from "./creator-token-users";

const keyExtractor = (item: CreatorTokenUser) => `${item.profile_id}`;
type Query = {
  profileId: string;
};

const { useParam } = createParam<Query>();

export const CreatorTokenCollectedList = () => {
  const { height: screenHeight, width } = useWindowDimensions();
  const [profileId] = useParam("profileId");
  const isMdWidth = width >= breakpoints["md"];
  const { data: list, isLoading } = useCreatorTokenCoLlected(profileId);
  const numColumns = 3;
  const itemWidth = isMdWidth ? 130 : (width - 40 - 2 * 16) / 3;

  const renderItem = useCallback(
    ({
      item,
      index,
    }: ListRenderItemInfo<CreatorTokenUser & { loading?: boolean }>) => {
      return (
        <View tw="w-full items-center">
          <TopCreatorTokensItem
            item={item}
            index={index}
            style={{ width: itemWidth }}
          />
        </View>
      );
    },
    [itemWidth]
  );

  const getItemType = useCallback(
    (_: CreatorTokenUser, index: number) => {
      const marginLeft = isMdWidth ? 0 : index % numColumns === 0 ? 0 : 8;
      if (marginLeft) {
        return "right";
      }
      return "left";
    },
    [isMdWidth, numColumns]
  );

  const ListEmptyComponent = useCallback(() => {
    if (isLoading) {
      return (
        <View tw="mx-auto w-full max-w-screen-xl justify-center md:px-0">
          <Spinner />
        </View>
      );
    }
    return (
      <EmptyPlaceholder
        title={"No creator tokens, yet."}
        tw="h-[50vh]"
        hideLoginBtn
      />
    );
  }, [isLoading]);

  const ListHeaderComponent = useCallback(() => {
    return <CreatorTokensTitle title="Creator Token Collected " />;
  }, []);

  return (
    <View tw="bg-white px-2 dark:bg-black md:px-4">
      <ErrorBoundary>
        <InfiniteScrollList
          useWindowScroll
          data={list || []}
          preserveScrollPosition
          keyExtractor={keyExtractor}
          numColumns={numColumns}
          renderItem={renderItem}
          drawDistance={500}
          getItemType={getItemType}
          style={{
            height: Platform.select({
              web: undefined,
              default: screenHeight,
            }),
          }}
          contentContainerStyle={{
            paddingHorizontal: 8,
          }}
          overscan={12}
          ListEmptyComponent={ListEmptyComponent}
          ListHeaderComponent={ListHeaderComponent}
          estimatedItemSize={101}
        />
      </ErrorBoundary>
    </View>
  );
};
