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
import { UnLocked, Showtime } from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "@showtime-xyz/universal.safe-area";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { BgGoldLinearGradient } from "app/components/gold-gradient";
import { useShareImage } from "app/components/share/use-share-image";
import {
  TwitterButton,
  InstagramButton,
  CopyLinkButton,
  AccessChannelButton,
} from "app/components/social-buttons";
import { useMyInfo, useUserProfile } from "app/hooks/api-hooks";
import { createParam } from "app/navigation/use-param";
import {
  getShowtimeUsernameOnTwitter,
  getTwitterIntent,
  getWebBaseURL,
} from "app/utilities";

import { toast } from "design-system/toast";

import { CloseButton } from "../close-button";

export type TokenShareType = "collected" | "launched" | "channel";
const { useParam } = createParam<{
  username: string;
  type: TokenShareType;
  collectedCount: string;
}>();

export const CreatorTokensShareModal = memo(function CreatorTokens() {
  const linearOpaticy = useSharedValue(0);
  const [username] = useParam("username");
  const [collectedCount] = useParam("collectedCount");
  const [type] = useParam("type");

  const { data: userInfo } = useUserProfile({ address: username });
  const profileData = userInfo?.data?.profile;
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const { data: user } = useMyInfo();
  const viewRef = useRef<any>(null);
  const url = useMemo(() => `${getWebBaseURL()}/@${username}`, [username]);
  const { shareImageToIG } = useShareImage(viewRef);

  const shareWithTwitterIntent = useCallback(() => {
    Linking.openURL(
      getTwitterIntent({
        url: url,
        message: `Just created my @Showzime_xyz token ✦. Find me at ${getShowtimeUsernameOnTwitter(
          profileData
        )} and DM me for invites.`,
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
              {type === "launched"
                ? "You just launched your Creator Token!"
                : type === "collected"
                ? `You just collected ${collectedCount} ${
                    collectedCount === "1" ? "token" : "tokens"
                  }!}`
                : "Share your Creator Token to grow your channel"}
            </Text>
            <View tw="mt-4 flex-row items-center justify-center px-8">
              {type === "launched" ? (
                <>
                  <Text
                    tw="text-gray-900"
                    onPress={() => router.push(`/@${profileData?.username}`)}
                  >
                    Share with your fans to kickstart your channel. Plus, you've
                    got
                    <Text
                      tw="mx-1 font-medium"
                      onPress={() => router.push(`/@${profileData?.username}`)}
                    >
                      {` 3 invites `}
                    </Text>
                    for creator friends!
                  </Text>
                </>
              ) : type === "collected" ? (
                <>
                  <UnLocked width={14} height={14} color="#000" />
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
                    tw="ml-1 font-medium text-gray-900"
                    onPress={() => router.push(`/@${profileData?.username}`)}
                  >
                    channel!
                  </Text>
                </>
              ) : (
                <></>
              )}
            </View>
          </View>
        </View>
        <View tw="mt-10 w-full px-6" style={{ rowGap: 16 }}>
          <TwitterButton theme="dark" onPress={shareWithTwitterIntent} />
          {Platform.OS !== "web" ? (
            <InstagramButton onPress={shareSingleImage} />
          ) : null}
          <CopyLinkButton theme="dark" onPress={onCopyLink} />
          {type === "collected" ? (
            <AccessChannelButton
              theme="light"
              tw="mt-4"
              onPress={viewChannel}
            />
          ) : (
            <Button
              theme="light"
              tw="mt-4"
              size="regular"
              onPress={() => {
                if (Platform.OS === "web") {
                  router.replace(`/profile/@${username}`);
                } else {
                  router.pop();
                  router.push(`/profile/@${username}`);
                }
              }}
            >
              View Profile
            </Button>
          )}
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
