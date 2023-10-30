import { useCallback } from "react";
import { Platform } from "react-native";

import * as Clipboard from "expo-clipboard";
import * as Sharing from "expo-sharing";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { ChevronRight } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { ScrollView } from "@showtime-xyz/universal.scroll-view";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { toast } from "design-system/toast";

import InviteCreatorTokenHeader from "./assets/invite";
import { useAvailableCreatorTokensInvites } from "./hooks/use-invite-creator-token";

const data = [
  {
    id: 1,
    code: "AFD43A",
  },
  {
    id: 2,
    code: "DAA43A",
  },
];

const claimedData = [
  {
    id: 1,
    date: "2021-09-01",
    username: "am",
  },
  {
    id: 2,
    date: "2021-09-01",
    username: "hirbod",
  },
  {
    id: 3,
    date: "2021-09-01",
    username: "maxiricha",
  },
];

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
        <View tw="flex items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-800">
          <Text tw="letter tracking-ultra-wide py-2.5 pl-6 pr-5 text-center text-2xl text-black dark:text-white">
            {code}
          </Text>
        </View>
        <View tw="flex-1 items-center justify-center">
          <Pressable onPress={copyCode}>
            <Text tw="text-base font-semibold text-indigo-600 dark:text-indigo-500">
              Copy code
            </Text>
          </Pressable>
        </View>
      </View>
      <Button tw="mt-4" onPress={shareInvite}>
        Share invite
      </Button>
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
  const { data } = useAvailableCreatorTokensInvites();

  if (!data) return null;

  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: Platform.select({ web: 0, default: top + 40 }),
        paddingBottom: bottom,
      }}
    >
      <View tw="p-4">
        <View tw="items-center">
          <InviteCreatorTokenHeader />
        </View>
        <View tw="mt-6">
          <Text tw="text-xl font-bold text-black dark:text-white">
            Invite a friend, get their token
          </Text>
          <View tw="h-4" />
          <Text tw="text-black dark:text-white">
            You have{" "}
            <Text tw="font-bold">
              {data.length} {data.length > 1 ? "invites" : "invite"}
            </Text>{" "}
            left. Share or email invites below to earn your friends' creator
            tokens.
          </Text>
          <View tw="mt-2">
            {data.map((item) => (
              <InviteCreatorTokenItem key={item.id} code={item.code} />
            ))}
          </View>
          <View tw="mt-8">
            <Text tw="font-bold text-black dark:text-white">Claimed</Text>
            {claimedData.map((item) => (
              <InviteCreatorTokenClaimedItem
                key={item.id}
                date={item.date}
                username={item.username}
              />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
