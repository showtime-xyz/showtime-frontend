import { Linking, Platform } from "react-native";

import type { AxiosError } from "axios";

import { Button, ButtonProps } from "@showtime-xyz/universal.button";
import { Image } from "@showtime-xyz/universal.image";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { fetcher } from "app/hooks/use-infinite-list-query";
import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";

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
