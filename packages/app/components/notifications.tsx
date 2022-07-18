import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Platform, useWindowDimensions } from "react-native";

import { Link } from "solito/link";

import { Avatar } from "@showtime-xyz/universal.avatar";
import {
  HeartFilled,
  MarketFilled,
  MessageFilled,
  PlusFilled,
} from "@showtime-xyz/universal.icon";
import { ModalSheet } from "@showtime-xyz/universal.modal-sheet";
import { useRouter } from "@showtime-xyz/universal.router";
import { Spinner } from "@showtime-xyz/universal.spinner/index";
import { colors, tw } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { UserList } from "app/components/user-list";
import { useMyInfo } from "app/hooks/api-hooks";
import {
  Actor,
  NotificationType,
  useNotifications,
} from "app/hooks/use-notifications";
import { useUser } from "app/hooks/use-user";
import { axios } from "app/lib/axios";
import { CHAIN_IDENTIFIERS } from "app/lib/constants";
import { useBottomTabBarHeight } from "app/lib/react-navigation/bottom-tabs";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { useScrollToTop } from "app/lib/react-navigation/native";
import { TextLink } from "app/navigation/link";
import { formatAddressShort } from "app/utilities";

type NotificationCardProp = { notification: NotificationType; setUsers: any };

export const Notifications = () => {
  const { data, fetchMore, refresh, isRefreshing, isLoadingMore } =
    useNotifications();
  const { refetchMyInfo } = useMyInfo();
  const bottomBarHeight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const { height: windowHeight } = useWindowDimensions();
  const flatListHeight = windowHeight - bottomBarHeight - headerHeight;

  const [users, setUsers] = useState([]);

  const renderItem = useCallback(({ item }: { item: NotificationType }) => {
    return <NotificationCard notification={item} setUsers={setUsers} />;
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

const NotificationCard = ({ notification, setUsers }: NotificationCardProp) => {
  const notificationInfo = useNotificationInfo(notification);
  return (
    <View tw="flex-row items-center p-4">
      {notificationInfo.icon}
      <View tw="mx-2">
        <Link href={notificationInfo.href}>
          <Avatar url={notification.img_url} size={24} />
        </Link>
      </View>
      <NotificationDescription
        notificationInfo={notificationInfo}
        notification={notification}
        setUsers={setUsers}
      />
    </View>
  );
};

const NotificationDescription = ({
  notification,
  notificationInfo,
  setUsers,
}: {
  notification: NotificationType;
  notificationInfo: any;
  setUsers: any;
}) => {
  const actors = notification.actors;
  const router = useRouter();
  if (actors && actors.length > 0) {
    return (
      <View tw="flex-1">
        <Text
          tw="text-13 max-w-[69vw] text-gray-600 dark:text-gray-400"
          ellipsizeMode="tail"
        >
          {actors.length == 1 ? (
            <>
              <ActorLink actor={actors[0]} />{" "}
            </>
          ) : null}
          {actors.length == 2 ? (
            <>
              <ActorLink actor={actors[0]} /> and{" "}
              <ActorLink actor={actors[1]} />{" "}
            </>
          ) : null}
          {actors.length == 3 ? (
            <>
              <ActorLink actor={actors[0]} />,
              <ActorLink actor={actors[1]} />, and{" "}
              <ActorLink actor={actors[2]} />
            </>
          ) : null}
          {actors.length > 3 ? (
            <>
              <ActorLink actor={actors[0]} />, <ActorLink actor={actors[1]} />,
              and{" "}
              <Text
                tw="text-13 font-bold text-black dark:text-white"
                onPress={() => setUsers(actors.slice(2, actors.length))}
              >
                {actors.length - 2} other{" "}
                {actors.length - 2 == 1 ? "person " : "people "}
              </Text>
            </>
          ) : null}

          {notification.type_name === "FOLLOW" ? "followed you" : null}
          {notification.type_name === "LIKE_ON_CREATED_NFT" ||
          notification.type_name === "LIKE_ON_OWNED_NFT"
            ? "liked "
            : null}
          {notification.type_name === "COMMENT_ON_CREATED_NFT" ||
          notification.type_name === "COMMENT_ON_OWNED_NFT"
            ? "commented on "
            : null}
          {notification.type_name === "COMMENT_MENTION"
            ? "mentioned you in "
            : null}
          {notification.type_name === "LIKE_ON_COMMENT"
            ? "liked your comment on "
            : null}
          {notification.type_name === "NFT_SALE" ? "bought " : null}
          {notification.type_name === "NEW_CREATOR_AIRDROP_FROM_FOLLOWING"
            ? "created a new drop "
            : null}
          {notification.type_name === "CLAIMED_CREATOR_AIRDROP_FROM_FOLLOWING"
            ? "claimed the drop "
            : null}

          {notification.nft_display_name ? (
            <Text
              onPress={() => {
                router.push(notificationInfo.href);
              }}
              tw="text-13 font-bold text-black dark:text-white"
            >
              {notification.nft_display_name}
            </Text>
          ) : null}
        </Text>
        <View tw="h-1" />
        {/* <Text tw="text-xs text-gray-500">
          {formatDistanceToNowStrict(new Date(notification.to_timestamp), {
            addSuffix: true,
          })}
        </Text> */}
      </View>
    );
  }

  return null;
};

const ActorLink = ({ actor }: { actor: Actor }) => {
  return (
    <TextLink
      href={`/@${actor.username ?? actor.wallet_address}`}
      tw="text-13 font-bold text-black dark:text-white"
    >
      {actor.username ? (
        <>@{actor.username}</>
      ) : (
        <>{formatAddressShort(actor.wallet_address)}</>
      )}
    </TextLink>
  );
};

export const useNotificationInfo = (notification: NotificationType) => {
  const myProfile = useUser();
  const profileLink =
    "/@" +
    (notification.link_to_profile_address
      ? `${
          notification.link_to_profile_username ||
          notification.link_to_profile_address
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
      )}/${notification.contract_address}/${notification.nft_token_identifier}`,
    [notification]
  );

  switch (notification.type_name) {
    case "FOLLOW":
      return {
        type: "followed_me",
        icon: <PlusFilled width={20} height={20} color={colors.teal[500]} />,
        href: profileLink,
      };
    case "LIKE_ON_CREATED_NFT":
      return {
        type: "liked_my_creation",
        icon: <HeartFilled width={20} height={20} color={colors.rose[500]} />,
        href: nftLink,
      };
    case "LIKE_ON_OWNED_NFT":
      return {
        type: "liked_my_owned",
        icon: <HeartFilled width={20} height={20} color={colors.rose[500]} />,
        href: nftLink,
      };
    case "COMMENT_ON_CREATED_NFT":
      return {
        type: "commented_my_creation",
        icon: (
          <MessageFilled width={20} height={20} color={colors.indigo[500]} />
        ),
        href: nftLink,
      };
    case "COMMENT_ON_OWNED_NFT":
      return {
        type: "commented_my_owned",
        icon: (
          <MessageFilled width={20} height={20} color={colors.indigo[500]} />
        ),
        href: nftLink,
      };
    case "COMMENT_MENTION":
      return {
        type: "tagged_me_in_comment",
        // TODO: incorrect icon
        icon: (
          <MessageFilled width={20} height={20} color={colors.indigo[500]} />
        ),
        href: nftLink,
      };
    case "LIKE_ON_COMMENT":
      return {
        type: "liked_my_comment",
        icon: <HeartFilled width={20} height={20} color={colors.rose[500]} />,
        href: nftLink,
      };
    case "NFT_SALE":
      return {
        type: "bought_my_piece",
        icon: <MarketFilled width={20} height={20} color={colors.amber[500]} />,
        href: nftLink,
      };
    case "NEW_CREATOR_AIRDROP_FROM_FOLLOWING":
      return {
        type: "NEW_CREATOR_AIRDROP_FROM_FOLLOWING",
        icon: <PlusFilled width={20} height={20} color={colors.teal[500]} />,
        href: nftLink,
      };
    case "CLAIMED_CREATOR_AIRDROP_FROM_FOLLOWING":
      return {
        type: "CLAIMED_CREATOR_AIRDROP_FROM_FOLLOWING",
        icon: <PlusFilled width={20} height={20} color={colors.teal[500]} />,
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
