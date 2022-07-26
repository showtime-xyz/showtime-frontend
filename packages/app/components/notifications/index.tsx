import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Platform, useWindowDimensions } from "react-native";

import { ModalSheet } from "@showtime-xyz/universal.modal-sheet";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { tw } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

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

import { NotificationItem } from "./notification-item";

export const Notifications = () => {
  const { data, fetchMore, refresh, isRefreshing, isLoadingMore } =
    useNotifications();
  const { refetchMyInfo } = useMyInfo();
  const bottomBarHeight = usePlatformBottomHeight();
  const headerHeight = useHeaderHeight();
  const { height: windowHeight } = useWindowDimensions();
  const flatListHeight = windowHeight - bottomBarHeight - headerHeight;

  const [users, setUsers] = useState<Pick<Actor, "profile_id" | "username">[]>(
    []
  );

  const renderItem = useCallback(({ item }: { item: NotificationType }) => {
    return <NotificationItem notification={item} setUsers={setUsers} />;
  }, []);

  const keyExtractor = useCallback((item: NotificationType) => {
    return item.id.toString();
  }, []);

  const ListFooter = useCallback(() => {
    return isLoadingMore ? (
      <View tw="items-center">
        <Spinner size="small" />
      </View>
    ) : (
      <View tw={`h-${bottomBarHeight ?? 0}px`} />
    );
  }, [isLoadingMore, bottomBarHeight]);

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

  const listRef = useRef<any>();

  useScrollToTop(listRef);

  return (
    <>
      <FlatList
        data={data}
        style={Platform.select({
          native: { height: flatListHeight },
          default: {},
        })}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={Separator}
        onEndReached={fetchMore}
        refreshing={isRefreshing}
        onRefresh={refresh}
        contentContainerStyle={Platform.select({
          web: tw.style("md:max-w-sm"),
          default: {},
        })}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={ListEmptyComponent}
        ref={listRef}
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
