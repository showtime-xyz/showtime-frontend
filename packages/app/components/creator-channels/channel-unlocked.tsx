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
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
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

import { BgGoldLinearGradient } from "app/components/gold-gradient";
import { useShareToInstagram } from "app/components/share/use-share-to-instagram";
import {
  TwitterButton,
  InstagramButton,
  CopyLinkButton,
} from "app/components/social-buttons";
import { ClaimContext } from "app/context/claim-context";
import { useMyInfo, useUserProfile } from "app/hooks/api-hooks";
import { usePaymentsManage } from "app/hooks/api/use-payments-manage";
import { useClaimNFT } from "app/hooks/use-claim-nft";
import {
  CreatorEditionResponse,
  useCreatorCollectionDetail,
} from "app/hooks/use-creator-collection-detail";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { getNFTSlug } from "app/hooks/use-share-nft";
import { createParam } from "app/navigation/use-param";
import { getProfileName, getTwitterIntent, getWebBaseURL } from "app/utilities";

import { toast } from "design-system/toast";

import { stripePromise } from "../checkout/stripe";
import { fetchStripeAccountId } from "../claim/claim-paid-nft-button";
import { CloseButton } from "../close-button";
import { useChannelById } from "./hooks/use-channel-detail";
import { useJoinChannel } from "./hooks/use-join-channel";

const { useParam } = createParam<{
  contractAddress: string;
  isPaid?: string;
}>();

const REDIRECT_SECONDS = 5;
export const UnlockedChannelModal = () => {
  const [contractAddress] = useParam("contractAddress");
  const { data: edition } = useCreatorCollectionDetail(contractAddress);
  if (!edition) return null;
  return <UnlockedChannel edition={edition} />;
};

const UnlockedChannel = ({ edition }: { edition: CreatorEditionResponse }) => {
  const [isPaid] = useParam("isPaid");
  // const [isPaid] = useParam("isPaid");

  const joinChannel = useJoinChannel();

  const { top } = useSafeAreaInsets();
  const { state } = useContext(ClaimContext);
  const linearOpaticy = useSharedValue(0);
  const { data: nft } = useNFTDetailByTokenId({
    chainName: process.env.NEXT_PUBLIC_CHAIN_ID,
    tokenId: "0",
    contractAddress: edition?.creator_airdrop_edition.contract_address,
  });

  const channelId = nft?.data.item.creator_channel_id;
  const { data } = useChannelById(channelId?.toString());
  const [showCongratsScreen, setShowCongratsScreen] = useState(!isPaid);
  const router = useRouter();
  const { data: user } = useMyInfo();
  const viewRef = useRef<any>(null);
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
  const { shareImageToIG } = useShareToInstagram(viewRef);
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
  const { setPaymentByDefault } = usePaymentsManage();

  const handlePaymentSuccess = useCallback(async () => {
    const setAsDefaultPaymentMethod = new URLSearchParams(
      window.location.search
    ).get("setAsDefaultPaymentMethod");
    if (!setAsDefaultPaymentMethod) return;

    const profileId = edition?.creator_airdrop_edition.owner_profile_id;
    const { stripe_account_id: stripeAccount } = await fetchStripeAccountId(
      profileId
    );

    const stripe = await stripePromise({ stripeAccount });
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (stripe && clientSecret) {
      const res = await stripe.retrievePaymentIntent(clientSecret);
      if (typeof res.paymentIntent?.payment_method === "string") {
        setPaymentByDefault(res.paymentIntent.payment_method);
      }
    }
  }, [edition?.creator_airdrop_edition.owner_profile_id, setPaymentByDefault]);

  const initPaidNFT = useCallback(async () => {
    if (isPaid && channelId) {
      handlePaymentSuccess();
      await claimNFT({ closeModal });
    }
  }, [channelId, claimNFT, closeModal, handlePaymentSuccess, isPaid]);

  useEffect(() => {
    initPaidNFT();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId]);

  const shareWithTwitterIntent = useCallback(() => {
    Linking.openURL(
      getTwitterIntent({
        url: url,
        message: `Just unlocked "${nft?.data.item.token_name}" from @${nft?.data?.item.creator_name} on @Showtime_xyz ✦ \nCollect to unlock:`,
      })
    );
  }, [nft?.data.item.creator_name, nft?.data.item.token_name, url]);

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
              You just unlocked exclusive content from
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
            <InstagramButton onPress={shareSingleImage} />
          ) : null}
          <CopyLinkButton onPress={onCopyLink} />
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
