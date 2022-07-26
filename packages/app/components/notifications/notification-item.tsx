import { useMemo } from "react";

import { Link } from "solito/link";

import { Avatar } from "@showtime-xyz/universal.avatar";
import {
  HeartFilled,
  MarketFilled,
  MessageFilled,
  PlusFilled,
} from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Actor, NotificationType } from "app/hooks/use-notifications";
import { useUser } from "app/hooks/use-user";
import { findTokenChainName } from "app/lib/utilities";

import { Actors } from "./actors";

export type NotificationItemProp = {
  notification: NotificationType;
  setUsers: (actors: Actor[]) => void;
};
const NOTIFICATION_TYPE_COPY = new Map([
  ["FOLLOW", "followed you"],
  ["LIKE_ON_CREATED_NFT", "liked "],
  ["LIKE_ON_OWNED_NFT", "liked "],
  ["COMMENT_ON_CREATED_NFT", "commented on "],
  ["COMMENT_ON_OWNED_NFT", "commented on "],
  ["COMMENT_MENTION", "mentioned you in "],
  ["LIKE_ON_COMMENT", "liked your comment on "],
  ["NFT_SALE", "bought "],
  ["NEW_CREATOR_AIRDROP_FROM_FOLLOWING", "created a new drop "],
  ["CLAIMED_CREATOR_AIRDROP_FROM_FOLLOWING", "claimed "],
]);

export const NotificationItem = ({
  notification,
  setUsers,
}: NotificationItemProp) => {
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

type NotificationDescriptionProps = {
  notification: NotificationType;
  notificationInfo: any;
  setUsers: NotificationItemProp["setUsers"];
};
const NotificationDescription = ({
  notification,
  notificationInfo,
  setUsers,
}: NotificationDescriptionProps) => {
  const router = useRouter();
  return (
    <View tw="flex-1">
      <Text
        tw="text-13 max-w-[69vw] text-gray-600 dark:text-gray-400"
        ellipsizeMode="tail"
      >
        <Actors actors={notification.actors} setUsers={setUsers} />
        {NOTIFICATION_TYPE_COPY.get(notification.type_name) ?? ""}
        {notification.nfts.map((item) => (
          <>
            <Text
              onPress={() => {
                router.push(notificationInfo.href);
              }}
              tw="text-13 font-bold text-black dark:text-white"
            >
              {item.display_name}
            </Text>
            {notification.type_name ===
              "CLAIMED_CREATOR_AIRDROP_FROM_FOLLOWING" &&
              ` by ${(<Actors actors={item.creator} setUsers={setUsers} />)}`}
          </>
        ))}
      </Text>
      <View tw="h-1" />
      {/* <Text tw="text-xs text-gray-500">
        {formatDistanceToNowStrict(new Date(notification.to_timestamp), {
          addSuffix: true,
        })}
      </Text> */}
    </View>
  );
};

export const useNotificationInfo = (notification: NotificationType) => {
  const myProfile = useUser();
  const actor = notification.actors[0];
  const nft = notification.nfts[0];

  const profileLink =
    "/@" +
    (actor?.wallet_address
      ? `${actor?.username || actor?.wallet_address}`
      : `${
          myProfile?.user?.data.profile.username ||
          myProfile?.user?.data.profile.wallet_addresses[0]
        }`);
  const nftLink = useMemo(
    () =>
      "/nft/" +
      `${findTokenChainName(nft?.chain_identifier)}/${nft?.contract_address}/${
        nft?.token_identifier
      }`,
    [nft?.chain_identifier, nft?.contract_address, nft?.token_identifier]
  );

  switch (notification.type_name) {
    case "FOLLOW":
      return {
        icon: <PlusFilled width={20} height={20} color={colors.teal[500]} />,
        href: profileLink,
      };
    case "LIKE_ON_CREATED_NFT":
      return {
        icon: <HeartFilled width={20} height={20} color={colors.rose[500]} />,
        href: nftLink,
      };
    case "LIKE_ON_OWNED_NFT":
      return {
        icon: <HeartFilled width={20} height={20} color={colors.rose[500]} />,
        href: nftLink,
      };
    case "COMMENT_ON_CREATED_NFT":
      return {
        icon: (
          <MessageFilled width={20} height={20} color={colors.indigo[500]} />
        ),
        href: nftLink,
      };
    case "COMMENT_ON_OWNED_NFT":
      return {
        icon: (
          <MessageFilled width={20} height={20} color={colors.indigo[500]} />
        ),
        href: nftLink,
      };
    case "COMMENT_MENTION":
      return {
        // TODO: incorrect icon
        icon: (
          <MessageFilled width={20} height={20} color={colors.indigo[500]} />
        ),
        href: nftLink,
      };
    case "LIKE_ON_COMMENT":
      return {
        icon: <HeartFilled width={20} height={20} color={colors.rose[500]} />,
        href: nftLink,
      };
    case "NFT_SALE":
      return {
        icon: <MarketFilled width={20} height={20} color={colors.amber[500]} />,
        href: nftLink,
      };
    case "NEW_CREATOR_AIRDROP_FROM_FOLLOWING":
      return {
        icon: <PlusFilled width={20} height={20} color={colors.teal[500]} />,
        href: nftLink,
      };
    case "CLAIMED_CREATOR_AIRDROP_FROM_FOLLOWING":
      return {
        icon: <PlusFilled width={20} height={20} color={colors.teal[500]} />,
        href: nftLink,
      };
    default:
      return {
        icon: undefined,
        href: profileLink,
      };
  }
};
