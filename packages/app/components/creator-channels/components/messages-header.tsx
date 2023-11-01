import { useCallback } from "react";
import { Platform } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  AccessTicket,
  ArrowLeft,
  Settings,
} from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { AvatarHoverCard } from "app/components/card/avatar-hover-card";

import { HeaderProps } from "../types";
import { LeanText, LeanView } from "./lean-text";

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

  const inviteAllowlist = useCallback(() => {
    const as = "/creator-token/import-allowlist";
    router.push(
      Platform.select({
        native: as,
        web: {
          pathname: router.pathname,
          query: {
            ...router.query,
            creatorTokensImportAllowlistModal: true,
          },
        } as any,
      }),
      Platform.select({ native: as, web: router.asPath }),
      {
        shallow: true,
      }
    );
  }, [router]);

  return (
    <LeanView
      tw="web:pt-2 web:md:py-5 android:pt-4 flex-row items-center border-gray-200 px-2.5 pb-2 dark:border-gray-800 md:border-b"
      style={{ columnGap: 8 }}
    >
      <LeanView tw="flex-row items-center" style={{ columnGap: 10 }}>
        <Pressable
          onPress={() => {
            router.back();
          }}
          tw="lg:hidden"
          hitSlop={15}
        >
          <ArrowLeft
            height={26}
            width={26}
            color={isDark ? "white" : "black"}
          />
        </Pressable>
        <LeanView>
          <AvatarHoverCard
            username={props.username}
            url={props.picture}
            size={34}
            alt="Channels Avatar"
          />
        </LeanView>
      </LeanView>
      {props.channelId ? (
        <>
          <LeanView tw="flex-1" style={{ rowGap: 8 }}>
            <Text
              onPress={() => router.push(`/@${props.username}`)}
              tw="text-sm font-bold text-gray-900 dark:text-gray-100"
            >
              {props.title ?? "Loading..."}
            </Text>
          </LeanView>
          <LeanView tw="flex-row items-center justify-center gap-3">
            {!props.isCurrentUserOwner ? (
              <Pressable onPress={props.onPressSettings}>
                <Settings
                  height={Platform.OS === "web" ? 20 : 24}
                  width={Platform.OS === "web" ? 20 : 24}
                  color={isDark ? colors.gray["100"] : colors.gray[500]}
                />
              </Pressable>
            ) : (
              <Pressable onPress={inviteAllowlist}>
                <AccessTicket
                  height={Platform.OS === "web" ? 20 : 24}
                  width={Platform.OS === "web" ? 20 : 24}
                  color={isDark ? colors.gray["100"] : colors.gray[500]}
                />
              </Pressable>
            )}
            <Pressable onPress={props.onPressShare}>
              <View tw="items-center justify-center overflow-hidden rounded-full bg-indigo-600 px-3 py-1.5 text-center ">
                <LeanText tw="web:text-xs text-sm font-bold text-white">
                  Share
                </LeanText>
              </View>
            </Pressable>
          </LeanView>
        </>
      ) : null}
    </LeanView>
  );
};
