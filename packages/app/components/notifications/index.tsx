import { useCallback, useEffect, useRef, useState, memo } from "react";
import { Platform, RefreshControl, useWindowDimensions } from "react-native";

import { ListRenderItemInfo } from "@shopify/flash-list";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { ModalSheet } from "@showtime-xyz/universal.modal-sheet";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { NotificationsSettingIcon } from "app/components/header/notifications-setting-icon";
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

import { breakpoints } from "design-system/theme";

import { EmptyPlaceholder } from "../empty-placeholder";

const Header = () => {
  const headerHeight = useHeaderHeight();

  return Platform.OS === "web" ? (
    <View tw="hidden w-full flex-row pb-4 pl-4 pt-8 md:flex">
      <Text tw="text-lg font-bold text-gray-900 dark:text-white">
        Notifications
      </Text>
      <View tw="absolute right-2 top-6">
        <NotificationsSettingIcon size={24} />
      </View>
    </View>
  ) : (
    <View style={{ height: headerHeight }} />
  );
};
type NotificationsProps = {
  hideHeader?: boolean;
  /**
   * **WEB ONLY**: Defines the list height.
   * @default undefined
   */
  web_height?: string | number;
};

const keyExtractor = (item: NotificationType) => {
  return item.id.toString();
};

/*
const getItemType = (item: NotificationType) => {
  return item.type_name;
};
*/

export const Notifications = memo(
  ({ hideHeader = false, web_height = undefined }: NotificationsProps) => {
    const { data, fetchMore, refresh, isRefreshing, isLoadingMore, isLoading } =
      useNotifications();
    const { refetchMyInfo } = useMyInfo();
    const isDark = useIsDarkMode();
    const bottomBarHeight = usePlatformBottomHeight();
    const headerHeight = useHeaderHeight();
    const { height: windowHeight } = useWindowDimensions();
    const [users, setUsers] = useState<
      Pick<Actor, "profile_id" | "username">[]
    >([]);
    const listRef = useRef<any>();
    useScrollToTop(listRef);

    const renderItem = useCallback(
      ({ item }: ListRenderItemInfo<NotificationType>) => {
        return <NotificationItem notification={item} setUsers={setUsers} />;
      },
      []
    );

    const ListFooterComponent = useCallback(() => {
      if (isLoadingMore && data.length > 0 && !isLoading)
        return (
          <View tw="web:pt-2 items-center pb-2">
            <Spinner size="small" />
          </View>
        );
      return null;
    }, [isLoadingMore, isLoading, data.length]);

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

    if (!isLoading && data.length === 0) {
      return (
        <EmptyPlaceholder
          title="You have no notifications yet."
          tw="flex-1 items-center justify-center"
        />
      );
    }

    if (isLoading && data.length === 0 && isLoadingMore) {
      return (
        <View tw="flex-1 items-center justify-center">
          <Spinner size="small" />
        </View>
      );
    }

    return (
      <>
        <InfiniteScrollList
          useWindowScroll={false}
          data={data}
          ListHeaderComponent={Platform.select({
            web: hideHeader ? undefined : Header,
            default: undefined,
          })}
          // for blur header effect on iOS
          style={{
            height: Platform.select({
              default: windowHeight - bottomBarHeight,
              web: web_height ? web_height : windowHeight - bottomBarHeight,
              ios: windowHeight,
            }),
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
          containerTw="pretty-scrollbar"
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onEndReached={fetchMore}
          refreshing={isRefreshing}
          onRefresh={refresh}
          ListFooterComponent={ListFooterComponent}
          ref={listRef}
          estimatedItemSize={53}
        />

        <ModalSheet
          snapPoints={["90%"]}
          title="People"
          visible={users.length > 0}
          close={() => setUsers([])}
          onClose={() => setUsers([])}
        >
          <UserList
            users={users}
            loading={false}
            style={{ height: Platform.OS === "web" ? 200 : undefined }}
          />
        </ModalSheet>
      </>
    );
  }
);

Notifications.displayName = "Notifications";
