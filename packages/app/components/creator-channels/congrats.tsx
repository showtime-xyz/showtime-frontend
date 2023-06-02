import React, { useCallback } from "react";
import { Linking } from "react-native";

import * as Clipboard from "expo-clipboard";
import { createParam } from "solito";

import { BottomSheetModalProvider } from "@showtime-xyz/universal.bottom-sheet";
import { Button } from "@showtime-xyz/universal.button";
import { Haptics } from "@showtime-xyz/universal.haptics";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Congrats, Twitter, Link } from "@showtime-xyz/universal.icon";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useShare } from "app/hooks/use-share";
import { Analytics, EVENTS } from "app/lib/analytics";
import { getTwitterIntent } from "app/utilities";

import { toast } from "design-system/toast";

type Query = {
  channelId: string;
};
const { useParam } = createParam<Query>();
export const CreatorChannelsCongrats = () => {
  const isDark = useIsDarkMode();
  const [channelId] = useParam("channelId");

  const share = useShare();
  const bottomBarHeight = usePlatformBottomHeight();
  const url = `https://showtime.xyz/channels/${channelId}`;
  const shareWithTwitterIntent = useCallback(() => {
    Linking.openURL(
      getTwitterIntent({
        url: url,
        message: `Just messaged my exclusive collector channel on @Showtime_xyz: `,
      })
    );
  }, [url]);
  const onCopyLink = useCallback(async () => {
    await Clipboard.setStringAsync(url.toString());
    toast.success("Copied!");
  }, [url]);

  const shareLink = async () => {
    const result = await share({
      url,
    });
    if (result.action === "sharedAction") {
      Analytics.track(
        EVENTS.USER_SHARED_PROFILE,
        result.activityType ? { type: result.activityType } : undefined
      );
    }
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
        tw="mt-8 w-full px-4"
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
