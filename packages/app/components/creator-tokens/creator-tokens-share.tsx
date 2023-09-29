import { useCallback, useRef, useMemo, memo } from "react";
import { Linking, Platform, StyleSheet } from "react-native";

import * as Clipboard from "expo-clipboard";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { Button } from "@showtime-xyz/universal.button";
import { LockBadge, Showtime } from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "@showtime-xyz/universal.safe-area";
import Spinner from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { StarDropBadge } from "app/components/badge/star-drop-badge";
import { BgGoldLinearGradient } from "app/components/gold-gradient";
import { useShareImage } from "app/components/share/use-share-image";
import {
  TwitterButton,
  InstagramButton,
  CopyLinkButton,
} from "app/components/social-buttons";
import { useMyInfo, useUserProfile } from "app/hooks/api-hooks";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { getNFTSlug } from "app/hooks/use-share-nft";
import { createParam } from "app/navigation/use-param";
import { NFT } from "app/types";
import {
  getProfileName,
  getShowtimeUsernameOnTwitter,
  getTwitterIntent,
  getWebBaseURL,
} from "app/utilities";

import { toast } from "design-system/toast";

import { CloseButton } from "../close-button";

const { useParam } = createParam<{
  username: string;
}>();

export const CreatorTokensShareModal = memo(function CreatorTokens() {
  const linearOpaticy = useSharedValue(0);
  const [username] = useParam("username");
  const { data: userInfo } = useUserProfile({ address: username });
  const profileData = userInfo?.data?.profile;
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const { data: user } = useMyInfo();
  const viewRef = useRef<any>(null);
  const url = useMemo(() => "", []);
  const { shareImageToIG } = useShareImage(viewRef);
  const shareWithTwitterIntent = useCallback(() => {
    Linking.openURL(
      getTwitterIntent({
        url: url,
        message: `Just collected tokens from ${getShowtimeUsernameOnTwitter(
          profileData
        )} on @Showtime_xyz ✦ \nCollect to unlock:`,
      })
    );
  }, [profileData, url]);

  const shareSingleImage = useCallback(async () => {
    linearOpaticy.value = withTiming(1, {}, () => {
      runOnJS(shareImageToIG)();
      linearOpaticy.value = withTiming(0);
    });
  }, [linearOpaticy, shareImageToIG]);

  const onCopyLink = useCallback(async () => {
    await Clipboard.setStringAsync(url.toString());
    toast.success("Copied!");
  }, [url]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: linearOpaticy.value,
    };
  }, []);

  const viewChannel = useCallback(() => {
    const pathname = `/channels/${profileData?.channels[0]}?unlocked=now`;
    if (Platform.OS === "web") {
      router.replace(pathname);
    } else {
      router.pop();
      router.push(pathname);
    }
  }, [profileData?.channels, router]);

  return (
    <View tw="web:pb-8 flex-1 overflow-hidden" pointerEvents="box-none">
      <BgGoldLinearGradient />
      <SafeAreaView>
        <View
          tw="items-center justify-center overflow-hidden rounded-2xl pb-10"
          collapsable={false}
          ref={viewRef as any}
        >
          <Animated.View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, animatedStyle]}
          >
            <BgGoldLinearGradient />
          </Animated.View>
          <View tw="mt-28">
            <View tw="absolute left-0 top-0">
              <Showtime color="black" width={24} height={24} />
            </View>
            <Avatar url={user?.data?.profile?.img_url} tw="mr-2" size={176} />
          </View>
          <View tw="mt-6">
            <Text tw="text-center text-2xl font-bold text-gray-900">
              You just collected 2 tokens!
            </Text>
            <View tw="mt-4 flex-row items-center justify-center px-8">
              <LockBadge width={14} height={14} color="#000" />
              <Text tw="ml-1 text-gray-900">Unlocked</Text>
              <Text
                tw="mx-1 font-medium"
                onPress={() => router.push(`/@${profileData?.username}`)}
              >
                @{profileData?.username}
              </Text>
              {profileData?.verified ? (
                <>
                  <VerificationBadge
                    fillColor="#fff"
                    bgColor="#000"
                    style={{ marginTop: -2 }}
                    size={14}
                    className="inline-block"
                  />
                </>
              ) : null}
              <Text
                tw="ml-1 font-medium"
                onPress={() => router.push(`/@${profileData?.username}`)}
              >
                channel!
              </Text>
            </View>
          </View>
        </View>
        <View tw="mt-10 w-full px-6" style={{ rowGap: 16 }}>
          <TwitterButton onPress={shareWithTwitterIntent} />
          {Platform.OS !== "web" ? (
            <InstagramButton onPress={shareSingleImage} />
          ) : null}
          <CopyLinkButton theme="dark" onPress={onCopyLink} />
          <Button theme="light" size="regular" onPress={viewChannel}>
            View Channel
          </Button>
        </View>
      </SafeAreaView>
      <View
        tw="absolute left-4 z-50"
        style={{
          top: top + 12,
        }}
      >
        <CloseButton color={colors.gray[900]} onPress={() => router.pop()} />
      </View>
    </View>
  );
});
