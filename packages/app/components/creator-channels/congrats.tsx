import React, { useCallback } from "react";
import { useWindowDimensions, Platform, Linking } from "react-native";

import * as Clipboard from "expo-clipboard";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { BottomSheetModalProvider } from "@showtime-xyz/universal.bottom-sheet";
import { Button } from "@showtime-xyz/universal.button";
import { Haptics } from "@showtime-xyz/universal.haptics";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  Congrats,
  CreatorChannelType,
  Twitter,
  Link,
} from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { BottomSheetScrollView } from "app/components/bottom-sheet-scroll-view";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useShare } from "app/hooks/use-share";
import { useUser } from "app/hooks/use-user";
import { getTwitterIntent } from "app/utilities";

import { breakpoints } from "design-system/theme";
import { toast } from "design-system/toast";

export const CreatorChannelsCongrats = () => {
  const isDark = useIsDarkMode();
  const { user: userProfile } = useUser();
  const share = useShare();
  const bottomBarHeight = usePlatformBottomHeight();
  const { width } = useWindowDimensions();
  const isSmWidth = width >= breakpoints["sm"];
  const imageSize = isSmWidth ? 420 : width;
  const router = useRouter();
  const url = "https://showtime.xyz/";
  const shareWithTwitterIntent = useCallback(() => {
    Linking.openURL(
      getTwitterIntent({
        url: url,
        message: ``,
      })
    );
  }, []);
  const onCopyLink = useCallback(async () => {
    await Clipboard.setStringAsync(url.toString());
    toast.success("Copied!");
  }, []);

  const shareLink = async () => {
    const result = await share({
      url,
    });
  };
  return (
    <BottomSheetModalProvider>
      <View tw="flex-1 items-center justify-center px-6 pb-4">
        <Congrats
          width={210}
          height={210}
          color={isDark ? colors.white : colors.gray[900]}
        />
        <View tw="h-20" />
        <Text
          tw="text-center font-bold text-gray-900 dark:text-white"
          style={{ fontSize: 32 }}
        >
          Congratulations!
        </Text>
        <View tw="h-4" />
        <Text tw="text-center text-base font-medium text-gray-500 dark:text-gray-400">
          Make sure your fans know where to find you! Here’s a shareable link to
          blast everywhere.
        </Text>
      </View>
      <View
        tw="absolutew-full px-4"
        style={{
          paddingBottom: Math.max(bottomBarHeight + 8, 24),
        }}
      >
        <Button
          size="regular"
          style={{ backgroundColor: colors.twitter }}
          onPress={() => {
            Haptics.impactAsync();
            shareWithTwitterIntent();
          }}
        >
          <>
            <Twitter color="white" width={24} height={24} />
            <Text tw="ml-1 text-base font-bold text-white">
              Share on Twitter
            </Text>
          </>
        </Button>
        <View tw="h-4" />
        <View tw="w-full flex-row">
          <Button
            size="regular"
            tw="flex-1"
            onPress={() => {
              Haptics.impactAsync();
              shareLink();
            }}
          >
            <>
              <Text tw="ml-1 text-base font-bold text-white dark:text-gray-900">
                Share Link
              </Text>
            </>
          </Button>
          <Button
            size="regular"
            tw="ml-4"
            iconOnly
            onPress={() => {
              Haptics.impactAsync();
              onCopyLink();
            }}
          >
            <Link />
          </Button>
        </View>
      </View>
    </BottomSheetModalProvider>
  );
};
