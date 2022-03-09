import { useCallback, useMemo, useRef } from "react";
import { FlatList } from "react-native";

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useScrollToTop } from "@react-navigation/native";

import {
  NotificationType,
  useNotifications,
} from "app/hooks/use-notifications";
import { useUser } from "app/hooks/use-user";
import { CHAIN_IDENTIFIERS } from "app/lib/constants";
import { TextLink } from "app/navigation/link";
import { useRouter } from "app/navigation/use-router";
import { formatAddressShort } from "app/utilities";

import { Button, Skeleton, Text, View } from "design-system";
import { Avatar } from "design-system/avatar";
import {
  HeartFilled,
  MessageFilled,
  PlusFilled,
  SocialToken,
} from "design-system/icon";
import { colors } from "design-system/tailwind/colors";

type NotificationCardProp = { notification: NotificationType };

export const Notifications = () => {
  const { data, fetchMore, refresh, isRefreshing, isLoadingMore } =
    useNotifications();
  const { isAuthenticated } = useUser();
  const router = useRouter();

  const renderItem = useCallback(({ item }: { item: NotificationType }) => {
    return <NotificationCard notification={item} />;
  }, []);

  const keyExtractor = useCallback((item: NotificationType) => {
    return item.id.toString();
  }, []);

  const ListFooter = useCallback(() => {
    const bottomBarHeight = useBottomTabBarHeight();
    return isLoadingMore ? (
      <Skeleton height={bottomBarHeight} width="100%" />
    ) : (
      <View tw={`h-${bottomBarHeight}px`} />
    );
  }, [isLoadingMore]);

  const Separator = useCallback(
    () => <View tw={`bg-gray-200 dark:bg-gray-800 h-[1px]`} />,
    []
  );

  const ListEmptyComponent = useCallback(
    () =>
      isAuthenticated ? (
        <View tw="h-full items-center justify-center">
          <Text tw="dark:text-gray-100 text-gray-900">No Results found</Text>
        </View>
      ) : (
        <View tw="h-full items-center justify-center">
          <Button
            tw="dark:text-gray-100 text-gray-900"
            onPress={() => {
              router.push("/login");
            }}
          >
            Login to continue
          </Button>
        </View>
      ),
    [isAuthenticated]
  );

  const listRef = useRef<any>();

  useScrollToTop(listRef);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={Separator}
      onEndReached={fetchMore}
      refreshing={isRefreshing}
      onRefresh={refresh}
      ListFooterComponent={ListFooter}
      ListEmptyComponent={ListEmptyComponent}
      ref={listRef}
    />
  );
};

const NotificationCard = ({ notification }: NotificationCardProp) => {
  const notificationInfo = useNotificationInfo(notification);

  return (
    <View tw="flex-row p-4 items-center">
      {notificationInfo.icon}
      <View tw="mx-2">
        {/* <Link href={notificationInfo.href}> */}
        <Avatar url={notification.img_url} size={24} />
        {/* </Link> */}
      </View>
      <NotificationDescription notification={notification} />
    </View>
  );
};

const NotificationDescription = ({ notification }: NotificationCardProp) => {
  const actors = notification.actors;
  // TODO: nft detail view - reuse item from swipelist
  //   const chain = useMemo(
  //     () =>
  //       Object.keys(CHAIN_IDENTIFIERS).find(
  //         //@ts-ignore
  //         (key) => CHAIN_IDENTIFIERS[key] == notification.chain_identifier
  //       ),
  //     []
  //   );

  if (actors.length > 0) {
    return (
      <Text
        //@ts-ignore
        variant="text-sm"
        tw="text-gray-600 dark:text-gray-400 max-w-[69vw]"
        ellipsizeMode="tail"
        sx={{ lineHeight: 22 }}
      >
        {actors.length == 1 ? (
          <>
            <ActorLink actor={actors[0]} />{" "}
          </>
        ) : null}
        {actors.length == 2 ? (
          <>
            <ActorLink actor={actors[0]} /> and <ActorLink actor={actors[1]} />{" "}
          </>
        ) : null}
        {actors.length == 3 ? (
          <>
            <ActorLink actor={actors[0]} />,
            <ActorLink actor={actors[1]} /> , and{" "}
            <ActorLink actor={actors[2]} />
          </>
        ) : null}
        {actors.length > 3 ? (
          <>
            <ActorLink actor={actors[0]} />, <ActorLink actor={actors[1]} />,
            and {actors.length - 2} other{" "}
            {actors.length - 2 == 1 ? "person " : "people "}
          </>
        ) : null}

        {NOTIFICATION_TYPES.LIKED.includes(notification.type_id)
          ? "liked "
          : null}
        {NOTIFICATION_TYPES.FOLLOWED.includes(notification.type_id)
          ? "followed you"
          : null}
        {NOTIFICATION_TYPES.COMMENT.includes(notification.type_id)
          ? "commented on "
          : null}
        {NOTIFICATION_TYPES.COMMENT_MENTION.includes(notification.type_id)
          ? "mentioned you in "
          : null}
        {NOTIFICATION_TYPES.COMMENT_LIKE.includes(notification.type_id)
          ? "liked your comment on "
          : null}
        {NOTIFICATION_TYPES.BOUGHT.includes(notification.type_id)
          ? "bought "
          : null}

        {notification.nft__nftdisplay__name ? (
          <Text
            //@ts-ignore
            variant="text-sm"
            tw="text-black dark:text-white font-bold"
            // href={`/nft/${chain}/${notification.nft__contract__address}/${notification.nft__token_identifier}`}
          >
            {notification.nft__nftdisplay__name}
          </Text>
        ) : null}
      </Text>
    );
  }

  return null;
};

const ActorLink = ({ actor }: { actor: NotificationType["actors"][0] }) => {
  return (
    <TextLink
      href={`/profile/${actor.wallet_address}`}
      variant="text-sm"
      tw="text-black dark:text-white font-bold"
    >
      {actor.username ? (
        <>@{actor.username}</>
      ) : (
        <>{formatAddressShort(actor.wallet_address)}</>
      )}
    </TextLink>
  );
};

const NOTIFICATION_TYPES = {
  FOLLOWED: [1],
  LIKED: [2, 3],
  COMMENT: [4, 5],
  COMMENT_MENTION: [6],
  COMMENT_LIKE: [7],
  BOUGHT: [8],
};

export const useNotificationInfo = (notification: NotificationType) => {
  const myProfile = useUser();
  const profileLink =
    "/profile/" +
    (notification.link_to_profile__address
      ? `${
          notification.link_to_profile__username ||
          notification.link_to_profile__address
        }`
      : `${
          myProfile?.user?.data.profile.username ||
          myProfile?.user?.data.profile.wallet_addresses[0]
        }`);

  const nftLink = useMemo(
    () =>
      "/nft/" +
      `${Object.keys(CHAIN_IDENTIFIERS).find(
        (key) =>
          //@ts-ignore
          CHAIN_IDENTIFIERS[key] == notification.chain_identifier
      )}/${notification.nft__contract__address}/${
        notification.nft__token_identifier
      }`,
    [notification]
  );

  switch (notification.type_id) {
    case 1:
      return {
        type: "followed_me",
        icon: <PlusFilled width={20} height={20} color={colors.teal[500]} />,
        href: profileLink,
      };
    case 2:
      return {
        type: "liked_my_creation",
        icon: <HeartFilled width={20} height={20} color={colors.rose[500]} />,
        href: nftLink,
      };
    case 3:
      return {
        type: "liked_my_owned",
        icon: <HeartFilled width={20} height={20} color={colors.rose[500]} />,
        href: nftLink,
      };
    case 4:
      return {
        type: "commented_my_creation",
        icon: (
          <MessageFilled width={20} height={20} color={colors.indigo[500]} />
        ),
        href: nftLink,
      };
    case 5:
      return {
        type: "commented_my_owned",
        icon: (
          <MessageFilled width={20} height={20} color={colors.indigo[500]} />
        ),
        href: nftLink,
      };
    case 6:
      return {
        type: "tagged_me_in_comment",
        // TODO: incorrect icon
        icon: (
          <MessageFilled width={20} height={20} color={colors.indigo[500]} />
        ),
        href: nftLink,
      };
    case 7:
      return {
        type: "liked_my_comment",
        icon: <HeartFilled width={20} height={20} color={colors.rose[500]} />,
        href: nftLink,
      };
    case 8:
      return {
        type: "bought_my_piece",
        // TODO: incorrect icon
        icon: <SocialToken width={20} height={20} color={colors.indigo[500]} />,
        href: nftLink,
      };
    default:
      return {
        type: "no_type_exists",
        icon: undefined,
        href: profileLink,
      };
  }
};
