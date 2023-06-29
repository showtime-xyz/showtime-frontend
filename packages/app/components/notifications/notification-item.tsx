import { memo, useMemo, useCallback } from "react";
import { Platform } from "react-native";

import { RectButton } from "react-native-gesture-handler";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
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
import { colors, styled } from "@showtime-xyz/universal.tailwind";
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

const StyledRectButton = styled(RectButton);
const PlatformButton =
  Platform.OS === "ios" ? memo(StyledRectButton) : Pressable;

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
  ["CHANNEL_NEW_MESSAGE", "channel: "],
  ["CHANNEL_FIRST_MESSAGE", "just created a collector channel: "],

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
    const isDark = useIsDarkMode();

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
          if (notification.channel) {
            path = `/channels/${notification.channel.id}`;
          }
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
      notification.channel,
      router,
    ]);

    if (
      NOTIFICATION_TYPE_COPY.get(notification.type_name) === undefined ||
      icon === undefined
    ) {
      return null;
    }

    return (
      <View tw="web:md:hover:bg-gray-100 web:md:dark:hover:bg-gray-800 web:rounded-md select-none flex-row items-center overflow-hidden md:mx-2">
        <PlatformButton
          onPress={notificationPressHandler}
          tw={"web:px-2 flex w-full flex-row justify-between px-4 py-3.5"}
          underlayColor={isDark ? colors.gray[100] : colors.gray[800]}
          rippleColor={isDark ? colors.gray[100] : colors.gray[800]}
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
        </PlatformButton>
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
            tw="text-13 web:max-w-[80%] mr-4 max-w-[60vw] self-center text-gray-600 dark:text-gray-400"
            ellipsizeMode="tail"
            numberOfLines={2}
          >
            Tap here to enter <NFTSDisplayNameText nfts={notification.nfts} />{" "}
            {NOTIFICATION_TYPE_COPY.get(notification.type_name)}
          </Text>
          {Boolean(formatDistance) && (
            <View tw="items-end">
              <Text tw="text-13 text-gray-500">{`${formatDistance}`}</Text>
            </View>
          )}
        </View>
      );
    }

    if (notification.type_name === "RELEASE_SAVED_TO_SPOTIFY") {
      return (
        <View tw="flex-1 flex-row justify-between">
          <Text
            tw="text-13 web:max-w-[80%] mr-4 max-w-[60vw] self-center text-gray-600 dark:text-gray-400"
            ellipsizeMode="tail"
            numberOfLines={2}
          >
            <NFTSDisplayName nfts={notification.nfts} />{" "}
            {NOTIFICATION_TYPE_COPY.get("RELEASE_SAVED_TO_SPOTIFY")}
          </Text>
          {Boolean(formatDistance) && (
            <View tw="items-end">
              <Text tw="text-13 text-gray-500">{`${formatDistance}`}</Text>
            </View>
          )}
        </View>
      );
    }

    if (
      notification.type_name === "CHANNEL_NEW_MESSAGE" ||
      notification.type_name === "CHANNEL_FIRST_MESSAGE"
    ) {
      return (
        <View tw="flex-1 flex-row justify-between">
          <Text
            tw="text-13 web:max-w-[80%] mr-4 max-w-[60vw] self-center text-gray-600 dark:text-gray-400"
            ellipsizeMode="tail"
            numberOfLines={2}
          >
            <Actors actors={notification.actors} setUsers={setUsers} />
            {NOTIFICATION_TYPE_COPY.get(notification.type_name)}
            {notification.description?.trim()}
          </Text>
          {Boolean(formatDistance) && (
            <View tw="items-end">
              <Text tw="text-13 text-gray-500">{`${formatDistance}`}</Text>
            </View>
          )}
        </View>
      );
    }

    return (
      <View tw="flex-1 flex-row justify-between">
        <Text
          tw="text-13 web:max-w-[80%] mr-4 max-w-[60vw] self-center text-gray-600 dark:text-gray-400"
          ellipsizeMode="tail"
          numberOfLines={2}
        >
          <Actors actors={notification.actors} setUsers={setUsers} />
          {NOTIFICATION_TYPE_COPY.get(notification.type_name)}
          <NFTSDisplayName nfts={notification.nfts} />
        </Text>
        {Boolean(formatDistance) && (
          <View tw="items-end">
            <Text tw="text-13 text-gray-500">{`${formatDistance}`}</Text>
          </View>
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
