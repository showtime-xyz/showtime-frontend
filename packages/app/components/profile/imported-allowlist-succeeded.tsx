import React, { useContext, useState } from "react";
import { useWindowDimensions, Platform } from "react-native";
import { Linking } from "react-native";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { BottomSheetModalProvider } from "@showtime-xyz/universal.bottom-sheet";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { CreatorChannelType } from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { TextInput } from "@showtime-xyz/universal.text-input";
import { View } from "@showtime-xyz/universal.view";

import { BottomSheetScrollView } from "app/components/bottom-sheet-scroll-view";
import { UserContext } from "app/context/user-context";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { getTwitterIntent } from "app/utilities";

import { breakpoints } from "design-system/theme";

import { CloseButton } from "../close-button";
import { TwitterButton } from "../social-buttons";

export const ImportedAllowlistSuccess = () => {
  const isDark = useIsDarkMode();
  const userContext = useContext(UserContext);
  const bottomBarHeight = usePlatformBottomHeight();
  const { width } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const [intentCopy, setIntentCopy] = useState(
    `Just gave free channel access to my allowlist 💬 \n\nFind me at @${userContext?.user?.data.profile.username} on @Showtime_xyz and make sure to use the same wallet!`
  );

  const isSmWidth = width >= breakpoints["sm"];
  const imageSize = isSmWidth ? 420 : width;
  const router = useRouter();

  return (
    <BottomSheetModalProvider>
      <BottomSheetScrollView
        contentContainerStyle={{
          paddingBottom: Math.max(bottomBarHeight, 16),
          paddingTop: top + 44,
        }}
      >
        <View tw="self-center rounded-full border border-gray-200 dark:border-gray-700">
          <Avatar
            url={userContext?.user?.data.profile.img_url}
            enableSkeleton={Platform.OS !== "web"}
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
        <View
          style={{ width: imageSize, height: imageSize }}
          tw="web:-top-14 absolute top-1 self-center"
        >
          <Image
            source={{
              uri: "https://media.showtime.xyz/assets/channel-graphic.png",
            }}
            width={imageSize}
            height={imageSize}
          />
        </View>
        <View style={{ marginTop: 130 }} tw="items-center justify-center px-6">
          <Text
            tw="text-center font-bold text-gray-900 dark:text-white"
            style={{ fontSize: 32 }}
          >
            Wallets added. Now go tell them to join!
          </Text>
          <View tw="mt-5 w-full rounded-3xl border border-gray-200 p-4 dark:border-gray-700">
            <TextInput
              tw="w-full text-base text-black dark:text-white"
              value={intentCopy}
              style={{ minHeight: 80 }}
              multiline
              onChangeText={setIntentCopy}
            />
          </View>

          <TwitterButton
            tw="mt-8 w-full"
            onPress={() => {
              Linking.openURL(
                getTwitterIntent({
                  url: "",
                  message: intentCopy,
                })
              );
            }}
          />
        </View>
        {Platform.OS != "web" ? (
          <View tw="absolute left-4 top-4 z-50 flex" style={{ top: top + 8 }}>
            <CloseButton
              color={isDark ? colors.gray[200] : colors.gray[900]}
              onPress={() => router.pop()}
            />
          </View>
        ) : null}
      </BottomSheetScrollView>
    </BottomSheetModalProvider>
  );
};
