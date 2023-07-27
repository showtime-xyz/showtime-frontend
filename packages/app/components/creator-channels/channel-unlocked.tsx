import {
  useCallback,
  useRef,
  useMemo,
  useState,
  useContext,
  useEffect,
} from "react";
import { Linking, Platform, StyleSheet } from "react-native";

import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import * as MediaLibrary from "expo-media-library";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

import { Alert } from "@showtime-xyz/universal.alert";
import { Avatar } from "@showtime-xyz/universal.avatar";
import { Button } from "@showtime-xyz/universal.button";
import { useEffectOnce, useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { InstagramColorful, Link, Twitter } from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { useModalScreenContext } from "@showtime-xyz/universal.modal-screen";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import {
  useSafeAreaInsets,
  SafeAreaView,
} from "@showtime-xyz/universal.safe-area";
import Spinner from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { TwitterButton } from "app/components/social-buttons/twitter-button";
import { ClaimContext } from "app/context/claim-context";
import { useMyInfo, useUserProfile } from "app/hooks/api-hooks";
import { useClaimNFT } from "app/hooks/use-claim-nft";
import {
  CreatorEditionResponse,
  useCreatorCollectionDetail,
} from "app/hooks/use-creator-collection-detail";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { getNFTSlug } from "app/hooks/use-share-nft";
import Share, { Social } from "app/lib/react-native-share";
import { captureRef, CaptureOptions } from "app/lib/view-shot";
import { createParam } from "app/navigation/use-param";
import { getProfileName, getTwitterIntent, getWebBaseURL } from "app/utilities";

import { toast } from "design-system/toast";

import { CloseButton } from "../close-button";
import { useChannelById } from "./hooks/use-channel-detail";
import { useJoinChannel } from "./hooks/use-join-channel";

const { useParam } = createParam<{
  contractAddress: string;
  isPaid?: string;
}>();

const linearProps = {
  start: { x: 6, y: 1.9 },
  end: { x: 0, y: 1 },
  colors: [
    "#F5E794",
    "#F5E794",
    "#FED749",
    "#F6C33D",
    "#F6C33D",
    "#FED749",
    "#FDC93F",
    "#FED749",
    "#FDC93F",
    "#F6C33D",
    "#FBC73F",
    "#FBC73F",
    "#F4CE5E",
    "#F6C33D",
    "#F6C33D",
    "#FFD480",
    "#FBC73F",
    "#F5E794",
  ],
};

export const UnlockedChannelModal = () => {
  const [contractAddress] = useParam("contractAddress");
  const { data: edition } = useCreatorCollectionDetail(contractAddress);
  if (!edition) return null;
  return <UnlockedChannel edition={edition} />;
};

const UnlockedChannel = ({ edition }: { edition: CreatorEditionResponse }) => {
  const [isPaid] = useParam("isPaid");
  const joinChannel = useJoinChannel();

  const modalScreenContext = useModalScreenContext();
  const { top } = useSafeAreaInsets();
  const { state } = useContext(ClaimContext);
  const linearOpaticy = useSharedValue(0);
  const { data: nft } = useNFTDetailByTokenId({
    chainName: process.env.NEXT_PUBLIC_CHAIN_ID,
    tokenId: "0",
    contractAddress: edition?.creator_airdrop_edition.contract_address,
  });
  const { data: userInfo } = useUserProfile({
    address:
      nft?.data.item.creator_username || nft?.data.item.creator_address_nonens,
  });
  const channelId = userInfo?.data?.profile.channels[0]?.id;
  const { data } = useChannelById(channelId?.toString());
  const [showCongratsScreen, setShowCongratsScreen] = useState(!isPaid);
  const isDark = useIsDarkMode();
  const router = useRouter();
  const { data: user } = useMyInfo();
  const viewRef = useRef<any>(null);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const { claimNFT } = useClaimNFT(edition?.creator_airdrop_edition);
  const url = useMemo(
    () => (nft ? `${getWebBaseURL()}${getNFTSlug(nft?.data.item)}` : ""),
    [nft]
  );

  const removeQueryParam = useCallback(() => {
    router.replace({ pathname: router.pathname }, undefined, {
      shallow: true,
    });
  }, [router]);
  const closeModal = useCallback(async () => {
    // router.replace(
    //   {
    //     pathname: router.pathname,
    //     query: {
    //       contractAddress: edition?.creator_airdrop_edition.contract_address,
    //       unlockedChannelModal: true,
    //     },
    //   },
    //   router.asPath,
    //   {
    //     shallow: true,
    //   }
    // );
    if (channelId) {
      await joinChannel.trigger({ channelId: channelId });
    }

    setShowCongratsScreen(true);
  }, [channelId, joinChannel]);

  const initPaidNFT = useCallback(async () => {
    if (isPaid && channelId) {
      await claimNFT({ closeModal });
    }
  }, [channelId, claimNFT, closeModal, isPaid]);

  useEffect(() => {
    initPaidNFT();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId]);

  const shareWithTwitterIntent = useCallback(() => {
    Linking.openURL(
      getTwitterIntent({
        url: url,
        message: `Just unlocked TITLE from @${nft?.data?.item.creator_name} on @Showtime_xyz ✦ \nCollect to unlock:`,
      })
    );
  }, [nft?.data?.item.creator_name, url]);

  const getViewShot = async (result?: CaptureOptions["result"]) => {
    const date = new Date();
    try {
      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 0.8,
        fileName: `QR Code - ${date.valueOf()}`,
        ...(result ? { result } : {}),
      });
      return uri;
    } catch (error) {}
  };
  const checkPhotosPermission = useCallback(async () => {
    let hasPermission = false;
    if (status?.granted) {
      hasPermission = status?.granted;
    } else {
      const res = await requestPermission();
      hasPermission = res?.granted;
    }
    if (!hasPermission) {
      Alert.alert(
        "No permission",
        "To share the photo, you'll need to enable photo permissions first",
        [
          {
            text: "Open Settings",
            onPress: () => {
              Linking.openSettings();
            },
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
    }
    return hasPermission;
  }, [requestPermission, status?.granted]);
  const prepareShareToIG = useCallback(
    async (url: string) => {
      const hasPermission = await checkPhotosPermission();
      if (hasPermission) {
        await MediaLibrary.saveToLibraryAsync(url);
      }
      return hasPermission;
    },
    [checkPhotosPermission]
  );
  const shareSingleImageToPlatform = useCallback(
    async (social: Social.Twitter | Social.Instagram) => {
      const url = await getViewShot();

      if (!url) {
        Alert.alert("Oops, An error occurred.");
        return;
      }
      if (social === Share.Social.INSTAGRAM) {
        /**
         * IG is not support private path address, and if you pass a uri, IG will always read the last pic from you Photos!
         * so we need to hack it, flow here.
         * check permission -> save to Photo -> share to IG(IG will read the last pic from you Photo)
         */
        const isCanShareToIG = await prepareShareToIG(url);
        if (!isCanShareToIG) {
          return;
        }
      }
      await Share.shareSingle({
        title: ``,
        message: ``,
        url,
        filename: `Unlocked-Channel-Share-${new Date().valueOf()}`,
        social,
      }).catch((err) => {});
    },
    [prepareShareToIG]
  );
  const shareSingleImage = useCallback(
    async (social: Social.Twitter | Social.Instagram) => {
      linearOpaticy.value = withTiming(1, {}, () => {
        runOnJS(shareSingleImageToPlatform)(social);
        linearOpaticy.value = withTiming(0);
      });
    },
    [linearOpaticy, shareSingleImageToPlatform]
  );

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
    if (Platform.OS === "web") {
      router.replace(`/channels/${channelId}`);
    } else {
      router.pop();
      router.push(`/channels/${channelId}`);
    }
  }, [router, channelId]);

  if (state.status === "error") {
    return (
      <View tw="min-h-[200px] flex-1 items-center justify-center px-8">
        <Text
          tw={`text-center text-lg font-extrabold leading-6 text-gray-900 dark:text-gray-100`}
        >
          {state.error}
        </Text>
        <Button tw="mt-4" onPress={removeQueryParam}>
          Got it.
        </Button>
      </View>
    );
  }
  if (!showCongratsScreen) {
    return (
      <View tw="min-h-[200px] flex-1 items-center justify-center">
        <Spinner />
      </View>
    );
  }
  return (
    <View tw="web:pb-8 flex-1" pointerEvents="box-none">
      <LinearGradient
        style={[StyleSheet.absoluteFill]}
        pointerEvents="none"
        {...linearProps}
      />

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
            <LinearGradient
              style={[StyleSheet.absoluteFill]}
              pointerEvents="none"
              {...linearProps}
            />
          </Animated.View>

          <Pressable
            onPress={() => router.push(`/@${data?.owner.username}`)}
            tw="mt-14 self-center"
          >
            <Avatar alt="Avatar" url={data?.owner?.img_url} size={176} />
            <View tw="absolute bottom-0 right-0 h-12 w-12">
              <Image
                source={{
                  uri: "https://showtime-media.b-cdn.net/assets/gold-button-iconv2.png",
                }}
                style={{ width: "100%", height: "100%" }}
              />
            </View>
          </Pressable>
          <View tw="mt-6">
            <Text tw="text-center text-3xl font-bold text-gray-900">
              Star drop collector
            </Text>
            <View tw="h-2" />
            <Text tw="px-12 text-center text-sm text-gray-900">
              You’ve unlocked exclusive channel content for
              <Text
                tw="font-medium"
                onPress={() => router.push(`/@${data?.owner.username}`)}
              >
                {" "}
                @{data?.owner.username}{" "}
              </Text>
              and a star badge!
            </Text>
          </View>
          <View tw="mt-6 flex-row items-center justify-center rounded-2xl bg-white px-6 py-2.5 shadow-md">
            <Avatar url={user?.data?.profile?.img_url} tw="mr-2" size={38} />
            <Text
              onPress={() =>
                router.push(`/@${getProfileName(user?.data?.profile)}`)
              }
              tw="text-base text-gray-900"
            >
              @{getProfileName(user?.data?.profile)}
            </Text>
            <VerificationBadge
              fillColor="#fff"
              bgColor="#000"
              style={{ marginLeft: 4 }}
              size={14}
            />
            <View tw="ml-1 h-4 w-4">
              <Image
                source={{
                  uri: "https://showtime-media.b-cdn.net/assets/gold-button-iconv2.png",
                }}
                style={{ width: "100%", height: "100%" }}
              />
            </View>
          </View>
        </View>
        <View tw="w-full px-6" style={{ rowGap: 16 }}>
          <TwitterButton onPress={shareWithTwitterIntent} />
          {Platform.OS !== "web" ? (
            <Button
              variant="primary"
              theme="light"
              size="regular"
              onPress={() => shareSingleImage(Social.Instagram)}
            >
              <View tw="mr-1">
                <InstagramColorful width={20} height={20} />
              </View>
              Share Instagram
            </Button>
          ) : null}
          <Button theme="dark" size="regular" onPress={onCopyLink}>
            <View tw="mr-1">
              <Link color="#000" width={20} height={20} />
            </View>
            Copy Link
          </Button>
          <Button theme="dark" size="regular" onPress={viewChannel}>
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
        <CloseButton color={colors.gray[900]} onPress={viewChannel} />
      </View>
    </View>
  );
};
