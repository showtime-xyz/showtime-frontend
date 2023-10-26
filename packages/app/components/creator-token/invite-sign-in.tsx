import React, { useState, useMemo } from "react";
import { Platform } from "react-native";

import { AnimatePresence } from "moti";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { BottomSheetModalProvider } from "@showtime-xyz/universal.bottom-sheet";
import { Button } from "@showtime-xyz/universal.button";
import { InviteTicket } from "@showtime-xyz/universal.icon";
import { useModalScreenContext } from "@showtime-xyz/universal.modal-screen";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useUserProfile } from "app/hooks/api-hooks";
import { useUser } from "app/hooks/use-user";
import { createParam } from "app/navigation/use-param";

type Query = {
  username: string;
};

const { useParam } = createParam<Query>();
export const CreatorTokenInviteSignIn = () => {
  const [username] = useParam("username");
  const modalScreenContext = useModalScreenContext();

  const { data: profileData } = useUserProfile({ address: username });
  const router = useRouter();
  return (
    <View tw="items-center px-6">
      <View tw="mb-8">
        <InviteTicket width={134} height={64} />
        <Avatar
          url={profileData?.data?.profile.img_url}
          size={38}
          tw="absolute left-6 top-3.5"
        />
        <View tw="absolute right-2 top-3.5 items-center">
          <Text tw="font-semibold text-white" style={{ fontSize: 22 }}>
            1
          </Text>
          <Text tw="font-semibold text-white" style={{ fontSize: 10 }}>
            INVITE
          </Text>
        </View>
      </View>
      <Text
        tw="font-semibold text-gray-900 dark:text-white"
        style={{ fontSize: 26 }}
      >
        @{profileData?.data?.profile.username}
      </Text>
      <View tw="h-2.5" />
      <Text tw="text-xl text-gray-900 dark:text-white">
        Invited you to Showtime.{" "}
        <Text tw="font-semibold">Create your token </Text>to give them one.
      </Text>
      <View tw="my-8 h-48 w-full items-center justify-center rounded-3xl border border-indigo-300 px-4">
        <Text>TODO: Privy sign module area</Text>
      </View>
      <Button
        size="regular"
        tw="w-full"
        onPress={() => {
          router.push("");
          if (Platform.OS !== "web") {
            modalScreenContext?.pop?.({
              callback: () => {
                router.push("/profile/review-creator-token");
              },
            });
          } else {
            router.replace("/profile/review-creator-token");
          }
        }}
      >
        Sign In
      </Button>
    </View>
  );
};
