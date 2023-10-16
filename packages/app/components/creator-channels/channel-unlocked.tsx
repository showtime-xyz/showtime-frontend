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
  contractAddress: string;
  isPaid?: string;
}>();

export const UnlockedChannelModal = () => {
  const [contractAddress] = useParam("contractAddress");
  const { data: edition } = useCreatorCollectionDetail(contractAddress);
  const { data: nft, isLoading } = useNFTDetailByTokenId({
    chainName: edition?.chain_name,
    tokenId: "0",
    contractAddress: edition?.creator_airdrop_edition.contract_address,
  });
  if (!nft || isLoading)
    return (
      <View tw="min-h-[200px] flex-1 items-center justify-center">
        <Spinner color={colors.yellow[400]} secondaryColor={colors.white} />
      </View>
    );
  return <UnlockedChannel nft={nft?.data.item} />;
};

const UnlockedChannel = memo(function UnlockedChannel({ nft }: { nft: NFT }) {
  const linearOpaticy = useSharedValue(0);
  const { data: userInfo } = useUserProfile({
    address: nft.creator_address,
  });
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const { data: user } = useMyInfo();
  const viewRef = useRef<any>(null);
  const url = useMemo(
    () => (nft ? `${getWebBaseURL()}${getNFTSlug(nft)}` : ""),
    [nft]
  );
  const { shareImageToIG } = useShareImage(viewRef);
  const shareWithTwitterIntent = useCallback(() => {
    Linking.openURL(
      getTwitterIntent({
        url: url,
        message: `Just unlocked "${
          nft.token_name
        }" from ${getShowtimeUsernameOnTwitter(
          userInfo?.data?.profile
        )} on @Showtime_xyz ✦ \nCollect to unlock:`,
      })
    );
  }, [nft.token_name, url, userInfo?.data?.profile]);

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
    const pathname = `/channels/${nft.creator_channel_id}?unlocked=now`;
    if (Platform.OS === "web") {
      router.replace(pathname);
    } else {
      router.pop();
      router.push(pathname);
    }
  }, [nft.creator_channel_id, router]);

  return (
    <View tw="web:pb-8 flex-1 overflow-hidden" pointerEvents="box-none">
      <BgGoldLinearGradient />
      <SafeAreaView>
        <View
          tw="items-center overflow-hidden rounded-2xl pb-10"
          collapsable={false}
          ref={viewRef as any}
        >
          <Animated.View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, animatedStyle]}
          >
            <BgGoldLinearGradient />
          </Animated.View>

          <Pressable
            onPress={() => router.push(`/@${nft?.creator_username}`)}
            tw="mt-14 self-center"
          >
            <Avatar alt="Avatar" url={nft?.creator_img_url} size={176} />
            <View tw="absolute bottom-0 right-0 h-12 w-12">
              <Image
                source={{
                  uri: "https://media.showtime.xyz/assets/gold-button-iconv2.png",
                }}
                style={{ width: "100%", height: "100%" }}
              />
            </View>
          </Pressable>
          <View tw="mt-6">
            <Text tw="text-center text-3xl font-bold text-gray-900">
              Star drop collector
            </Text>
            <View tw="h-4" />
            <Text tw="px-12 text-center text-sm text-gray-900">
              You just unlocked exclusive content from
              <Text
                tw="font-medium"
                onPress={() => router.push(`/@${nft?.creator_username}`)}
              >
                {" "}
                @{nft?.creator_username}{" "}
                {Platform.OS === "web" && nft?.creator_verified ? (
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
              </Text>{" "}
              and a star badge!{"\n\n"}
              Your NFT will be sent to your wallet in 7 days.
            </Text>
          </View>
          <View tw="mt-6 flex-row items-center justify-center rounded-2xl bg-white px-6 py-2.5 shadow-md">
            <Avatar url={user?.data?.profile?.img_url} tw="mr-2" size={38} />
            <Text
              onPress={() =>
                router.push(
                  `/@${
                    user?.data?.profile.username ??
                    user?.data?.profile.primary_wallet?.address
                  }`
                )
              }
              tw="text-base text-gray-900"
            >
              {user?.data?.profile.username
                ? `@${user?.data?.profile.username}`
                : getProfileName(user?.data?.profile)}
            </Text>
            {user?.data?.profile.verified ? (
              <VerificationBadge
                fillColor="#fff"
                bgColor="#000"
                style={{ marginLeft: 4 }}
                size={14}
              />
            ) : null}
            <View tw="ml-1">
              <StarDropBadge
                size={16}
                data={user?.data?.profile.latest_star_drop_collected}
              />
            </View>
          </View>
        </View>
        <View tw="w-full px-6" style={{ rowGap: 16 }}>
          <TwitterButton theme="dark" onPress={shareWithTwitterIntent} />
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
