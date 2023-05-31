import { memo, useMemo, useCallback } from "react";

import {
  HeartFilled,
  MarketFilled,
  MessageFilled,
  PlusFilled,
  GiftSolid,
  Spotify,
  CreatorChannelType,
} from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { AvatarHoverCard } from "app/components/card/avatar-hover-card";
import { Actors } from "app/components/notifications/actors";
import { Actor, NotificationType } from "app/hooks/use-notifications";
import { formatDateRelativeWithIntl } from "app/utilities";

import {
  NFTSDisplayName,
  NFTSDisplayNameText,
  getNFTLink,
} from "./nfts-display-name";

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
  ["CLAIMED_CREATOR_AIRDROP_FROM_FOLLOWING", "collected "],
  ["CREATED_EDITION_SOLD_OUT", "Your drop sold out: "],
  ["CREATED_EDITION_EXPIRED", "Your drop expired: "],
  ["CHANNEL_NEW_MESSAGE", "Yoyoyo: "],
  [
    "MISSING_MUSIC_RELEASE_METADATA",
    "Spotify song link to notify your fans the song is out. ",
  ],
  ["RELEASE_SAVED_TO_SPOTIFY", "is out! Check it out now."],
]);

export const NotificationItem = memo(
  ({ notification, setUsers }: NotificationItemProp) => {
    const router = useRouter();
    const icon = useMemo(
      () => getNotificationIcon(notification.type_name),
      [notification.type_name]
    );

    const notificationPressHandler = useCallback(() => {
      let path = "";
      switch (notification.type_name) {
        case "FOLLOW":
          path = `/@${
            notification.actors[0]?.username ||
            notification.actors[0]?.wallet_address
          }`;
          break;

        case "LIKE_ON_CREATED_NFT":
        case "LIKE_ON_OWNED_NFT":
        case "COMMENT_ON_CREATED_NFT":
        case "COMMENT_ON_OWNED_NFT":
        case "COMMENT_MENTION":
        case "LIKE_ON_COMMENT":
        case "NFT_SALE":
        case "NEW_CREATOR_AIRDROP_FROM_FOLLOWING":
        case "CLAIMED_CREATOR_AIRDROP_FROM_FOLLOWING":
        case "CREATED_EDITION_SOLD_OUT":
        case "CREATED_EDITION_EXPIRED":
          if (notification.nfts && notification.nfts.length > 0) {
            path = getNFTLink(notification.nfts[0]);
          }
          break;
        case "MISSING_MUSIC_RELEASE_METADATA":
          if (notification.nfts && notification.nfts.length > 0) {
            path = `/drop/update/${notification.nfts[0].contract_address}`;
          }
          break;
        case "CHANNEL_NEW_MESSAGE":
        case "CHANNEL_FIRST_MESSAGE":
          // to determine, currently disabled
          break;
        case "RELEASE_SAVED_TO_SPOTIFY":
          // to determine, currently disabled
          break;
      }

      if (!path) return;

      router.push(path);
    }, [
      notification.actors,
      notification.nfts,
      notification.type_name,
      router,
    ]);

    if (
      NOTIFICATION_TYPE_COPY.get(notification.type_name) === undefined ||
      icon === undefined
    ) {
      return null;
    }

    return (
      <View tw="flex-row items-center p-4">
        <Pressable
          onPress={notificationPressHandler}
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {icon}
          <View tw="mx-2">
            <AvatarHoverCard
              url={notification.img_url}
              size={24}
              username={
                notification.actors[0]?.username ||
                notification.actors[0]?.wallet_address
              }
              alt="Notification Avatar"
            />
          </View>
          <NotificationDescription
            notification={notification}
            setUsers={setUsers}
          />
        </Pressable>
      </View>
    );
  }
);

NotificationItem.displayName = "NotificationItem";

type NotificationDescriptionProps = {
  notification: NotificationType;
  setUsers: NotificationItemProp["setUsers"];
};

const NotificationDescription = memo(
  ({ notification, setUsers }: NotificationDescriptionProps) => {
    const formatDistance = formatDateRelativeWithIntl(
      notification.to_timestamp
    );

    if (notification.type_name === "MISSING_MUSIC_RELEASE_METADATA") {
      return (
        <View tw="flex-1 flex-row justify-between">
          <Text
            tw="text-13 web:max-w-[80%] mr-4 max-w-[70vw] self-center text-gray-600 dark:text-gray-400"
            ellipsizeMode="tail"
          >
            Tap here to enter <NFTSDisplayNameText nfts={notification.nfts} />{" "}
            {NOTIFICATION_TYPE_COPY.get(notification.type_name)}
          </Text>
          {Boolean(formatDistance) && (
            <Text tw="text-13 text-gray-500">{`${formatDistance}`}</Text>
          )}
        </View>
      );
    }

    if (notification.type_name === "RELEASE_SAVED_TO_SPOTIFY") {
      return (
        <View tw="flex-1 flex-row justify-between">
          <Text
            tw="text-13 web:max-w-[80%] mr-4 max-w-[70vw] self-center text-gray-600 dark:text-gray-400"
            ellipsizeMode="tail"
          >
            <NFTSDisplayName nfts={notification.nfts} />{" "}
            {NOTIFICATION_TYPE_COPY.get("RELEASE_SAVED_TO_SPOTIFY")}
          </Text>
          {Boolean(formatDistance) && (
            <Text tw="text-13 text-gray-500">{`${formatDistance}`}</Text>
          )}
        </View>
      );
    }

    return (
      <View tw="flex-1 flex-row justify-between">
        <Text
          tw="text-13 web:max-w-[80%] mr-4 max-w-[70vw] self-center text-gray-600 dark:text-gray-400"
          ellipsizeMode="tail"
        >
          <Actors actors={notification.actors} setUsers={setUsers} />
          {NOTIFICATION_TYPE_COPY.get(notification.type_name)}
          <NFTSDisplayName nfts={notification.nfts} />
        </Text>
        {Boolean(formatDistance) && (
          <Text tw="text-13 text-gray-500">{`${formatDistance}`}</Text>
        )}
      </View>
    );
  }
);

NotificationDescription.displayName = "NotificationDescription";

export const getNotificationIcon = (type_name: string) => {
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
      return <PlusFilled width={20} height={20} color={colors.indigo[500]} />;
    case "CLAIMED_CREATOR_AIRDROP_FROM_FOLLOWING":
      return <GiftSolid width={20} height={20} color={colors.indigo[500]} />;
    case "CREATED_EDITION_SOLD_OUT":
      return <GiftSolid width={20} height={20} color={colors.rose[500]} />;
    case "CREATED_EDITION_EXPIRED":
      return <GiftSolid width={20} height={20} color={colors.gray[500]} />;
    case "MISSING_MUSIC_RELEASE_METADATA":
    case "RELEASE_SAVED_TO_SPOTIFY":
      return <Spotify width={20} height={20} color={"#1DB954"} />;
    case "CHANNEL_NEW_MESSAGE":
    case "CHANNEL_FIRST_MESSAGE":
      return (
        <CreatorChannelType width={20} height={20} color={colors.indigo[500]} />
      );

    default:
      return undefined;
  }
};
