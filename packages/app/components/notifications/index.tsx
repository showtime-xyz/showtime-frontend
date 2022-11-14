import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, RefreshControl, useWindowDimensions } from "react-native";

import { ListRenderItemInfo } from "@shopify/flash-list";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { ModalSheet } from "@showtime-xyz/universal.modal-sheet";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { NotificationItem } from "app/components/notifications/notification-item";
import { UserList } from "app/components/user-list";
import { useMyInfo } from "app/hooks/api-hooks";
import {
  Actor,
  NotificationType,
  useNotifications,
} from "app/hooks/use-notifications";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { axios } from "app/lib/axios";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { useScrollToTop } from "app/lib/react-navigation/native";

const Header = () => {
  const headerHeight = useHeaderHeight();

  return Platform.OS === "web" ? (
    <View tw="w-full flex-row justify-center px-4 py-4">
      <Text tw="font-space-bold text-lg font-extrabold text-gray-900 dark:text-white md:text-2xl">
        Notifications
      </Text>
    </View>
  ) : (
    <View style={{ height: headerHeight }} />
  );
};

export const Notifications = ({
  useWindowScroll = true,
  hideHeader = false,
}) => {
  const { data, fetchMore, refresh, isRefreshing, isLoadingMore } =
    useNotifications();
  const { refetchMyInfo } = useMyInfo();
  const isDark = useIsDarkMode();
  const bottomBarHeight = usePlatformBottomHeight();
  const headerHeight = useHeaderHeight();
  const { height: windowHeight } = useWindowDimensions();
  const [users, setUsers] = useState<Pick<Actor, "profile_id" | "username">[]>(
    []
  );
  const listRef = useRef<any>();
  useScrollToTop(listRef);
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<NotificationType>) => {
      return <NotificationItem notification={item} setUsers={setUsers} />;
    },
    []
  );

  const keyExtractor = useCallback((item: NotificationType) => {
    return item.id.toString();
  }, []);

  const ListFooterComponent = useCallback(() => {
    if (isLoadingMore)
      return (
        <View tw="items-center pb-4">
          <Spinner size="small" />
        </View>
      );
    return null;
  }, [isLoadingMore]);

  const Separator = useCallback(
    () => <View tw={`h-[1px] bg-gray-100 dark:bg-gray-800`} />,
    []
  );

  const ListEmptyComponent = useCallback(
    () => (
      <View tw="items-center justify-center">
        <Text tw="p-20 text-gray-900 dark:text-gray-100">
          No new notifications
        </Text>
      </View>
    ),
    []
  );

  useEffect(() => {
    (async function resetNotificationLastOpenedTime() {
      await axios({
        url: "/v1/check_notifications",
        method: "POST",
        data: {},
      });
      refetchMyInfo();
    })();
  }, [refetchMyInfo]);

  return (
    <>
      <InfiniteScrollList
        useWindowScroll={useWindowScroll}
        data={data}
        ListHeaderComponent={Platform.select({
          web: hideHeader ? undefined : Header,
          default: undefined,
        })}
        // for blur header effect on iOS
        style={{
          height: Platform.select({
            default: windowHeight - bottomBarHeight,
            web: useWindowScroll ? windowHeight - bottomBarHeight : "100%",
            ios: windowHeight,
          }),
        }}
        overscan={{
          main: 100,
          reverse: 100,
        }}
        // for blur effect on Native
        contentContainerStyle={Platform.select({
          ios: {
            paddingTop: headerHeight,
            paddingBottom: bottomBarHeight,
          },
          android: {
            paddingBottom: bottomBarHeight,
          },
          default: {},
        })}
        // Todo: unity refresh control same as tab view
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            progressViewOffset={headerHeight}
            tintColor={isDark ? colors.gray[200] : colors.gray[700]}
            colors={[colors.violet[500]]}
            progressBackgroundColor={
              isDark ? colors.gray[200] : colors.gray[100]
            }
          />
        }
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={Separator}
        onEndReached={fetchMore}
        refreshing={isRefreshing}
        onRefresh={refresh}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={ListEmptyComponent}
        ref={listRef}
        estimatedItemSize={56}
      />

      <ModalSheet
        snapPoints={["85%", "100%"]}
        title="People"
        visible={users.length > 0}
        close={() => setUsers([])}
        onClose={() => setUsers([])}
      >
        <UserList onClose={() => setUsers([])} users={users} loading={false} />
      </ModalSheet>
    </>
  );
};
