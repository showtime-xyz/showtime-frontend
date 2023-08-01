import { useCallback } from "react";
import { Platform } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { ArrowLeft, Settings, Share } from "@showtime-xyz/universal.icon";
import { MoreHorizontal } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { AvatarHoverCard } from "app/components/card/avatar-hover-card";
import { MessageBox } from "app/components/messages";

import { HeaderProps } from "../types";

export const MessagesHeader = (props: HeaderProps) => {
  const router = useRouter();
  const isDark = useIsDarkMode();

  const viewMembersList = useCallback(() => {
    const as = `/channels/${props.channelId}/members`;

    router.push(
      Platform.select({
        native: as,
        web: {
          pathname: router.pathname,
          query: {
            ...router.query,
            channelsMembersModal: true,
          },
        } as any,
      }),
      Platform.select({
        native: as,
        web: router.asPath,
      }),
      { shallow: true }
    );
  }, [props.channelId, router]);

  return (
    <View
      tw="web:pt-2 web:md:py-5 android:pt-4 flex-row items-center border-gray-200 px-4 pb-2 dark:border-gray-800 md:border-b"
      style={{ columnGap: 8 }}
    >
      <View tw="flex-row items-center" style={{ columnGap: 8 }}>
        <Pressable
          onPress={() => {
            router.back();
          }}
          tw="lg:hidden"
        >
          <ArrowLeft
            height={24}
            width={24}
            color={isDark ? "white" : "black"}
          />
        </Pressable>
        <View>
          <AvatarHoverCard
            username={props.username}
            url={props.picture}
            size={34}
            alt="Channels Avatar"
          />
        </View>
      </View>
      {props.channelId ? (
        <>
          <View tw="flex-1" style={{ rowGap: 8 }}>
            <Text
              onPress={() => router.push(`/@${props.username}`)}
              tw="text-sm font-bold text-gray-900 dark:text-gray-100"
            >
              {props.title ?? "Loading..."}
            </Text>
            <Text
              onPress={viewMembersList}
              tw="text-xs text-indigo-600 dark:text-blue-400"
            >
              {props.members ?? 0} members
            </Text>
          </View>
          <View tw="flex-row">
            <Pressable onPress={props.onPressShare} tw="p-2 md:hidden">
              <Share
                height={20}
                width={20}
                color={isDark ? colors.gray["100"] : colors.gray[800]}
              />
            </Pressable>
            {!props.isCurrentUserOwner ? (
              <Pressable onPress={props.onPressSettings} tw="p-2 md:hidden">
                <Settings
                  height={20}
                  width={20}
                  color={isDark ? colors.gray["100"] : colors.gray[800]}
                />
              </Pressable>
            ) : null}

            <Pressable onPress={props.onPressShare} tw="hidden md:flex">
              <Share
                height={24}
                width={24}
                color={isDark ? colors.gray["100"] : colors.gray[800]}
              />
            </Pressable>
            {!props.isCurrentUserOwner ? (
              <Pressable
                onPress={props.onPressSettings}
                tw="ml-4 hidden md:flex"
              >
                <MoreHorizontal
                  height={24}
                  width={24}
                  color={isDark ? colors.gray["100"] : colors.gray[800]}
                />
              </Pressable>
            ) : null}
          </View>
        </>
      ) : null}
    </View>
  );
};
