import React from "react";
import { useWindowDimensions, Platform } from "react-native";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { BottomSheetModalProvider } from "@showtime-xyz/universal.bottom-sheet";
import { Button } from "@showtime-xyz/universal.button";
import { Haptics } from "@showtime-xyz/universal.haptics";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { CreatorChannelType } from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { BottomSheetScrollView } from "app/components/bottom-sheet-scroll-view";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useUser } from "app/hooks/use-user";

import { breakpoints } from "design-system/theme";

export const CreatorChannelsIntro = () => {
  const isDark = useIsDarkMode();
  const { user: userProfile } = useUser();
  const bottomBarHeight = usePlatformBottomHeight();
  const { width } = useWindowDimensions();
  const isSmWidth = width >= breakpoints["sm"];
  const imageSize = isSmWidth ? 420 : width;
  const router = useRouter();

  return (
    <BottomSheetModalProvider>
      <BottomSheetScrollView
        contentContainerStyle={{
          paddingBottom: Math.max(bottomBarHeight, 16),
        }}
      >
        <View>
          <View tw="self-center rounded-full border border-gray-300 dark:border-gray-700">
            <Avatar
              url={userProfile?.data.profile.img_url}
              enableSkeleton
              size={140}
            />
          </View>
          <View tw="-top-4 self-center rounded-full bg-white p-3 shadow-lg shadow-black/10 dark:bg-black dark:shadow-white/20">
            <CreatorChannelType
              color={isDark ? colors.white : colors.gray[900]}
              width={32}
              height={32}
            />
          </View>
          <Image
            source={require("./channel-graphic.png")}
            width={imageSize}
            height={imageSize}
            tw="absolute -top-20"
          />
          <View
            style={{ marginTop: 130 }}
            tw="items-center justify-center px-6"
          >
            <Text
              tw="text-center font-bold text-gray-900 dark:text-white"
              style={{ fontSize: 32 }}
            >
              An exclusive channel for your collectors
            </Text>
            <View tw="h-5" />
            <Text tw="text-center text-base font-medium text-gray-500 dark:text-gray-400">
              Blast exclusive updates to all your fans at once like Music NFT
              presale access, raffles, unreleased content & more.
            </Text>
          </View>
        </View>
      </BottomSheetScrollView>
      <View
        tw="absolutew-full px-4"
        style={{
          paddingBottom: Math.max(bottomBarHeight + 8, 24),
        }}
      >
        <Button
          size="regular"
          onPress={() => {
            Haptics.impactAsync();
            const pathname = `/channels/${userProfile?.data.profile.profile_id}`;
            if (Platform.OS === "web") {
              router.push(pathname);
            } else {
              router.pop();
              router.push(pathname);
            }
          }}
        >
          Enter channel
        </Button>
        <View tw="h-4" />
        <Text tw="text-center text-xs text-indigo-700 dark:text-violet-400">{`2,300 members awaiting`}</Text>
      </View>
    </BottomSheetModalProvider>
  );
};
