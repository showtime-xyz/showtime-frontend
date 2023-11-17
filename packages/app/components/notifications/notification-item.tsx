import { memo, useMemo, useCallback } from "react";
import { Platform } from "react-native";

import { RectButton } from "react-native-gesture-handler";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  BellFilled,
  CreatorChannelType,
  User,
} from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors, styled } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { AvatarHoverCard } from "app/components/card/avatar-hover-card";
import { NotificationType } from "app/hooks/use-notifications";
import { formatDateRelativeWithIntl } from "app/utilities";

import { Actors } from "./actors";

const StyledRectButton = styled(RectButton);
const PlatformButton =
  Platform.OS === "ios" ? memo(StyledRectButton) : Pressable;

export type NotificationItemProp = {
  notification: NotificationType;
};

const NOTIFICATION_TYPE_COPY = new Map([
  ["CHANNEL_NEW_MESSAGE", " channel: "],
  ["CHANNEL_FIRST_MESSAGE", " created a collector channel: "],
  ["INVITE_REDEEMED", " redeemed your invite code! "],
  ["INVITE_RENEWED", "You received 3 more Creator Token invites!"], // add "Tap to share." after function is implemented
  ["INVITED_TO_CHANNEL", " gave you free access to their channel!"],
  ["CREATOR_TOKEN_PURCHASED", " bought your token! "],
]);

export const NotificationItem = memo(
  ({ notification }: NotificationItemProp) => {
    const router = useRouter();
    const icon = useMemo(
      () => getNotificationIcon(notification.type_name),
      [notification.type_name]
    );
    const isDark = useIsDarkMode();

    const notificationPressHandler = useCallback(() => {
      let path = "";
      switch (notification.type_name) {
        case "CHANNEL_NEW_MESSAGE":
        case "CHANNEL_FIRST_MESSAGE":
        case "INVITE_REDEEMED":
        case "INVITED_TO_CHANNEL":
          console.log(notification);
          if (notification.channel) {
            path = `/channels/${notification.channel.id}`;
          }
          break;
        case "CREATOR_TOKEN_PURCHASED":
        case "INVITE_RENEWED":
          console.log(notification);
          path = `/@${notification?.actors?.[0].username}`;
      }

      if (!path) return;

      router.push(path);
    }, [notification, router]);

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
          <NotificationDescription notification={notification} />
        </PlatformButton>
      </View>
    );
  }
);

NotificationItem.displayName = "NotificationItem";

type NotificationDescriptionProps = {
  notification: NotificationType;
};

const NotificationDescription = memo(
  ({ notification }: NotificationDescriptionProps) => {
    const formatDistance = formatDateRelativeWithIntl(
      notification.to_timestamp
    );

    if (
      notification.type_name === "CHANNEL_NEW_MESSAGE" ||
      notification.type_name === "CHANNEL_FIRST_MESSAGE" ||
      notification.type_name === "INVITED_TO_CHANNEL" ||
      notification.type_name === "CREATOR_TOKEN_PURCHASED"
    ) {
      return (
        <View tw="flex-1 flex-row justify-between">
          <Text
            tw="text-13 web:max-w-[80%] mr-4 max-w-[60vw] self-center text-gray-600 dark:text-gray-400"
            ellipsizeMode="tail"
            numberOfLines={2}
          >
            <Actors actors={notification.actors} />
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

    // invites refilled
    if (notification.type_name === "INVITE_REDEEMED") {
      return (
        <View tw="flex-1 flex-row justify-between">
          <Text
            tw="text-13 web:max-w-[80%] mr-4 max-w-[60vw] self-center text-gray-600 dark:text-gray-400"
            ellipsizeMode="tail"
            numberOfLines={2}
          >
            You earned 1 <Actors actors={notification.actors} /> token for
            inviting them!
          </Text>
          {Boolean(formatDistance) && (
            <View tw="items-end">
              <Text tw="text-13 text-gray-500">{`${formatDistance}`}</Text>
            </View>
          )}
        </View>
      );
    }

    // Generic notifications with no external actors and fixed copy
    return (
      <View tw="flex-1 flex-row justify-between">
        <Text
          tw="text-13 web:max-w-[80%] mr-4 max-w-[60vw] self-center text-gray-600 dark:text-gray-400"
          ellipsizeMode="tail"
          numberOfLines={2}
        >
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
);

NotificationDescription.displayName = "NotificationDescription";

export const getNotificationIcon = (type_name: string) => {
  switch (type_name) {
    case "CHANNEL_NEW_MESSAGE":
    case "CHANNEL_FIRST_MESSAGE":
    case "INVITED_TO_CHANNEL":
    case "INVITE_REDEEMED":
      return (
        <CreatorChannelType width={20} height={20} color={colors.indigo[500]} />
      );

    case "CREATOR_TOKEN_PURCHASED":
      return <User width={20} height={20} color={colors.indigo[500]} />;
    default:
      return <BellFilled width={20} height={20} color={colors.indigo[500]} />;
  }
};
