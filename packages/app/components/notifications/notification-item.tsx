import { Link } from "solito/link";

import { Avatar } from "@showtime-xyz/universal.avatar";
import {
  HeartFilled,
  MarketFilled,
  MessageFilled,
  PlusFilled,
} from "@showtime-xyz/universal.icon";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Actors } from "app/components/notifications/actors";
import { Actor, NotificationType } from "app/hooks/use-notifications";
import { useUser } from "app/hooks/use-user";

import { NFTSDisolayName } from "./nfts-display-name";

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
  const myProfile = useUser();
  const icon = useNotificationIcon(notification.type_name);
  const actor =
    notification.actors?.length > 0 ? notification?.actors[0] : null;
  const avatarLink =
    "/@" +
    (actor?.wallet_address
      ? `${actor?.username || actor?.wallet_address}`
      : `${
          myProfile?.user?.data.profile.username ||
          myProfile?.user?.data.profile.wallet_addresses[0]
        }`);

  if (
    NOTIFICATION_TYPE_COPY.get(notification.type_name) === undefined ||
    icon === undefined
  ) {
    return null;
  }

  return (
    <View tw="flex-row items-center p-4">
      {icon}
      <View tw="mx-2">
        <Link href={avatarLink}>
          <Avatar url={notification.img_url} size={24} />
        </Link>
      </View>
      <NotificationDescription
        notification={notification}
        setUsers={setUsers}
      />
    </View>
  );
};

type NotificationDescriptionProps = {
  notification: NotificationType;
  setUsers: NotificationItemProp["setUsers"];
};
const NotificationDescription = ({
  notification,
  setUsers,
}: NotificationDescriptionProps) => {
  return (
    <View tw="flex-1">
      <Text
        tw="text-13 max-w-[69vw] text-gray-600 dark:text-gray-400"
        ellipsizeMode="tail"
      >
        <Actors actors={notification.actors} setUsers={setUsers} />
        {NOTIFICATION_TYPE_COPY.get(notification.type_name)}
        <NFTSDisolayName nfts={notification.nfts} />
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

export const useNotificationIcon = (type_name: string) => {
  switch (type_name) {
    case "FOLLOW":
      return <PlusFilled width={20} height={20} color={colors.teal[500]} />;
    case "LIKE_ON_CREATED_NFT":
      return <HeartFilled width={20} height={20} color={colors.rose[500]} />;
    case "LIKE_ON_OWNED_NFT":
      return <HeartFilled width={20} height={20} color={colors.rose[500]} />;
    case "COMMENT_ON_CREATED_NFT":
      return (
        <MessageFilled width={20} height={20} color={colors.indigo[500]} />
      );
    case "COMMENT_ON_OWNED_NFT":
      return (
        <MessageFilled width={20} height={20} color={colors.indigo[500]} />
      );
    case "COMMENT_MENTION":
      return (
        <MessageFilled width={20} height={20} color={colors.indigo[500]} />
      );
    case "LIKE_ON_COMMENT":
      return <HeartFilled width={20} height={20} color={colors.rose[500]} />;
    case "NFT_SALE":
      return <MarketFilled width={20} height={20} color={colors.amber[500]} />;
    case "NEW_CREATOR_AIRDROP_FROM_FOLLOWING":
      return <PlusFilled width={20} height={20} color={colors.teal[500]} />;
    case "CLAIMED_CREATOR_AIRDROP_FROM_FOLLOWING":
      return <PlusFilled width={20} height={20} color={colors.teal[500]} />;
    default:
      return undefined;
  }
};
