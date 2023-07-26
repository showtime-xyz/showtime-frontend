import {
  useRef,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  Linking,
  Platform,
  ScrollView as ReactNativeScrollView,
  StyleSheet,
} from "react-native";

import type { AxiosError } from "axios";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import type { LocationObject } from "expo-location";
import useSWR from "swr";

import { Alert } from "@showtime-xyz/universal.alert";
import { Button, ButtonProps } from "@showtime-xyz/universal.button";
import { Fieldset } from "@showtime-xyz/universal.fieldset";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { CheckFilled } from "@showtime-xyz/universal.icon";
import { Spotify } from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { AddWalletOrSetPrimary } from "app/components/add-wallet-or-set-primary";
import { BottomSheetScrollView } from "app/components/bottom-sheet-scroll-view";
import { Media } from "app/components/media";
import { PolygonScanButton } from "app/components/polygon-scan-button";
import { QRCodeModal } from "app/components/qr-code";
import { ClaimContext } from "app/context/claim-context";
import { useMyInfo } from "app/hooks/api-hooks";
import { useComments } from "app/hooks/api/use-comments";
import { useConfirmPayment } from "app/hooks/api/use-confirm-payment";
import { usePaymentsManage } from "app/hooks/api/use-payments-manage";
import { useAppleMusicGatedClaim } from "app/hooks/use-apple-music-gated-claim";
import { useClaimNFT } from "app/hooks/use-claim-nft";
import {
  CreatorEditionResponse,
  useCreatorCollectionDetail,
} from "app/hooks/use-creator-collection-detail";
import { fetcher } from "app/hooks/use-infinite-list-query";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { useRedirectToClaimDrop } from "app/hooks/use-redirect-to-claim-drop";
import { useSpotifyGatedClaim } from "app/hooks/use-spotify-gated-claim";
import { useSwitchNetwork } from "app/hooks/use-switch-network";
import { useUser } from "app/hooks/use-user";
import { Analytics, EVENTS } from "app/lib/analytics";
import { axios } from "app/lib/axios";
import { linkifyDescription } from "app/lib/linkify";
import { Logger } from "app/lib/logger";
import { createParam } from "app/navigation/use-param";
import { ContractVersion } from "app/types";
import {
  cleanUserTextInput,
  formatAddressShort,
  getCreatorUsernameFromNFT,
  limitLineBreaks,
  removeTags,
} from "app/utilities";

import { toast } from "design-system/toast";

import { GoldLinearGradient } from "./gold-linear-gradient";

type PiadNFTParams = {
  editionId: number;
  showtimeFee?: number;
  setPaymentMethodAsdefault?: boolean;
  useDefaultPaymentMethod?: boolean;
};

async function fetchClaimPaymentIntent({
  useDefaultPaymentMethod = true,
  editionId,
  showtimeFee,
  setPaymentMethodAsdefault = true,
}: PiadNFTParams) {
  if (editionId) {
    try {
      const res = await axios({
        method: "POST",
        url: "/v1/payments/nft/claim/start",
        data: {
          edition_id: editionId,
          showtime_fee: showtimeFee,
          use_default_payment_method: useDefaultPaymentMethod,
          set_payment_method_as_default: setPaymentMethodAsdefault,
        },
      });

      return res;
    } catch (e) {
      const axiosError = e as AxiosError;
      if (axiosError?.response?.data?.error?.code === 400) {
        const res = await axios({
          method: "POST",
          url: "/v1/payments/nft/claim/resume",
        });
        return res;
      } else {
        Logger.error("Payment intent fetch failed ", e);
        throw e;
      }
    }
  }
}

export const fetchStripeAccountId = async (
  profileId: string | number | null | undefined
) => {
  const res = await fetcher(`/v1/payments/nft/stripe-account/${profileId}`);

  return res;
};

export const ClaimPaidNFTButton = ({
  price,
  onPress,
  editionId,
  contractAddress,
  profileId,
  ...rest
}: ButtonProps & {
  price?: number;
  editionId: number;
  contractAddress: string;
  profileId?: string | number | null | undefined;
}) => {
  const router = useRouter();

  const onHandlePayment = async () => {
    if (Platform.OS !== "web") {
      toast("This drop is only available on web");
      return;
    }
    const res = await fetchClaimPaymentIntent({
      editionId,
      useDefaultPaymentMethod: false,
    });
    const stripeAccount = await fetchStripeAccountId(profileId);

    if (Platform.OS === "web") {
      const as = `/checkout-paid-nft`;
      router.push(
        Platform.select({
          native: as,
          web: {
            pathname: router.pathname,
            query: {
              ...router.query,
              clientSecret: res?.client_secret,
              checkoutPaidNFTModal: true,
              contractAddress,
              stripeAccount: stripeAccount?.stripe_account_id,
            },
          } as any,
        }),
        Platform.select({
          native: as,
          web: router.asPath,
        }),
        { shallow: true }
      );
    }
  };
  const priceText = price ? ` - $${price}` : "";

  return (
    <Button
      size="regular"
      variant="primary"
      style={{
        backgroundColor: "transparent",
      }}
      onPress={onHandlePayment}
      {...rest}
    >
      <GoldLinearGradient />
      <View tw="w-full flex-row items-center justify-center">
        <View>
          <Image
            source={{
              uri: "https://showtime-media.b-cdn.net/assets/gold-button-iconv2.png",
            }}
            width={24}
            height={24}
            style={{ width: 24, height: 24 }}
          />
        </View>

        <Text tw="ml-2 text-base font-semibold text-black">
          Collect Star Drop{priceText}
        </Text>
      </View>
    </Button>
  );
};
