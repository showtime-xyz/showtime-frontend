import { useCallback } from "react";
import { Platform } from "react-native";

import * as Clipboard from "expo-clipboard";
import * as Sharing from "expo-sharing";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { ChevronRight } from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { ScrollView } from "@showtime-xyz/universal.scroll-view";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { toast } from "design-system/toast";

import {
  useAvailableCreatorTokensInvites,
  useRedeemedCreatorTokensInvites,
} from "./hooks/use-invite-creator-token";

const InviteCreatorTokenItem = ({ code }: { code: string }) => {
  const isDark = useIsDarkMode();
  const copyCode = useCallback(async () => {
    await Clipboard.setStringAsync(code);
    toast.success("Copied to clipboard");
  }, [code]);

  const shareInvite = useCallback(async () => {
    const nativeSharingIsAvailable = await Sharing.isAvailableAsync();

    if (Platform.OS === "web" && nativeSharingIsAvailable) {
      Sharing.shareAsync("aaa", {
        dialogTitle: "Share your invite",
        mimeType: "text/plain",
        UTI: "public.plain-text",
      });
    } else {
      await Clipboard.setStringAsync(code);
      toast.success("Copied to clipboard");
    }
  }, [code]);

  return (
    <View tw="mt-2 rounded-2xl border border-gray-500 p-4">
      <View tw="flex flex-row">
        <View tw="flex flex-row items-center justify-center rounded-lg bg-gray-200 px-5  py-2.5 dark:bg-gray-800">
          {code.split("").map((char, i) => {
            return (
              <View
                key={i}
                tw="letter tracking-ultra-wide w-8 items-center justify-center"
              >
                <Text tw="text-3xl font-semibold text-black dark:text-white">
                  {char}
                </Text>
              </View>
            );
          })}
        </View>
        <View tw="flex-1 items-center justify-center">
          <Pressable onPress={copyCode}>
            <Text tw="text-base font-semibold text-indigo-600 dark:text-indigo-500">
              Copy code
            </Text>
          </Pressable>
        </View>
      </View>
      {/* TODO: implement share invite
        <Button tw="mt-4" onPress={shareInvite}>
          Share invite
        </Button>
        */}
    </View>
  );
};

const InviteCreatorTokenClaimedItem = ({
  date,
  username,
}: {
  date: string;
  username: string;
}) => {
  const router = useRouter();
  return (
    <Pressable
      tw="mt-6"
      onPress={() => {
        router.push(`/@${username}`);
      }}
    >
      <View tw="flex flex-row items-center justify-between">
        <View>
          <Text tw="text-black dark:text-white">
            Referral of <Text tw="font-bold">@{username}</Text>
          </Text>
          <View tw="mt-2">
            <Text tw="text-xs text-black dark:text-gray-400">
              1 Token rewarded on {date}
            </Text>
          </View>
        </View>
        <View>
          <ChevronRight color={colors["gray"][500]} height={20} width={20} />
        </View>
      </View>
    </Pressable>
  );
};

export const InviteCreatorToken = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { data: invitesData = [], isLoading: isLoadingAvailableCodes } =
    useAvailableCreatorTokensInvites();
  const { data: redeemedData = [], isLoading: isLoadingRedeemedCodes } =
    useRedeemedCreatorTokensInvites();

  const inviteText = invitesData.length === 1 ? "invite" : "invites";

  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: Platform.select({ web: 0, default: top + 40 }),
        paddingBottom: bottom,
      }}
    >
      <View tw="p-4">
        <View tw="items-center">
          <Image
            source={
              Platform.OS === "web"
                ? {
                    uri: "https://showtime-media.b-cdn.net/assets/invite_coin_header.png",
                  }
                : require("./assets/invite_coin_header.png")
            }
            width={260}
            height={200}
            contentFit="contain"
          />
        </View>
        <View tw="mt-6">
          <Text tw="text-xl font-bold text-black dark:text-white">
            Invite a friend, get their token
          </Text>
          <View tw="h-4" />
          <Text tw="text-black dark:text-white">
            You have <Text tw="font-bold">{invitesData.length}</Text>{" "}
            {inviteText} left.{" "}
            {invitesData.length > 0
              ? "Share invites below to earn your friends' creator tokens."
              : "Check back later for more invites."}
          </Text>
          <View tw="mt-2">
            {isLoadingAvailableCodes ? (
              <>
                <View tw="mt-2 h-32">
                  <Skeleton
                    tw="absolute mt-2 w-full rounded-2xl border border-gray-500 p-4"
                    height={128}
                  />
                  <Skeleton tw="ml-2 mt-6 w-28 p-3" height={20} />
                  <Skeleton tw="ml-2 mt-2 w-28 p-3" height={20} />
                  <Skeleton tw="ml-2 mt-2 w-28 p-3" height={20} />
                </View>
                <View tw="mt-2 h-32">
                  <Skeleton
                    tw="absolute mt-2 w-full rounded-2xl border border-gray-500 p-4"
                    height={128}
                  />
                  <Skeleton tw="ml-2 mt-6 w-28 p-3" height={20} />
                  <Skeleton tw="ml-2 mt-2 w-28 p-3" height={20} />
                  <Skeleton tw="ml-2 mt-2 w-28 p-3" height={20} />
                </View>
              </>
            ) : (
              invitesData.map((item) => (
                <InviteCreatorTokenItem key={item.code} code={item.code} />
              ))
            )}
          </View>
          <View tw="mt-8">
            {isLoadingRedeemedCodes ? null : redeemedData.length ? (
              <>
                <Text tw="font-bold text-black dark:text-white">Claimed</Text>
                {redeemedData.map((item) => (
                  <InviteCreatorTokenClaimedItem
                    key={item.invitee.id}
                    date={item.redeemed_at}
                    username={item.invitee.username}
                  />
                ))}
              </>
            ) : null}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
