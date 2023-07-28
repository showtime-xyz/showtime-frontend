import { memo, useState } from "react";
import { Linking, Platform } from "react-native";

import type { AxiosError } from "axios";
import * as Tooltip from "universal-tooltip";

import { Button, ButtonProps } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Showtime } from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { PressableHover } from "@showtime-xyz/universal.pressable-hover";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { ButtonGoldLinearGradient } from "app/components/gold-gradient";
import { TextTooltip } from "app/components/text-tooltip";
import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import { fetcher } from "app/hooks/use-infinite-list-query";
import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";

import { toast } from "design-system/toast";

import { FeedSocialButton } from "../feed-social-button";

type PiadNFTParams = {
  editionId?: number;
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

const fetchStripeAccountId = async (
  profileId: string | number | null | undefined
) => {
  const res = await fetcher(`/v1/payments/nft/stripe-account/${profileId}`);

  return res;
};

type GoldButtonProps = Omit<ButtonProps, ""> & {
  theme?: "dark" | "light";
  type?: "feed" | "trending" | "detail";
  edition?: CreatorEditionResponse;
  side?: "top" | "bottom" | "left" | "right";
};
const GoldButton = memo(function GoldButton({
  type,
  edition,
  ...rest
}: GoldButtonProps) {
  const router = useRouter();
  const price = edition?.price ?? 0;
  const editionId = edition?.creator_airdrop_edition.id;
  const contractAddress = edition?.creator_airdrop_edition.contract_address;
  const profileId = edition?.creator_airdrop_edition.owner_profile_id;
  const onHandlePayment = async () => {
    if (Platform.OS !== "web") {
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
  if (type === "trending") {
    return (
      <PressableHover
        tw={["h-6 w-24 items-center justify-center rounded-full"]}
        onPress={() => onHandlePayment()}
        {...rest}
      >
        <ButtonGoldLinearGradient />
        <Text tw="text-xs font-bold" style={{ color: colors.gray[900] }}>
          ${price}
        </Text>
      </PressableHover>
    );
  }
  if (type === "feed") {
    return (
      <PressableHover onPress={onHandlePayment} {...rest}>
        <View tw={"h-14 w-14 items-center justify-center rounded-full"}>
          <View tw="-z-1 absolute h-full w-full overflow-hidden rounded-full">
            <Image
              source={require("./gold-button-bg.svg")}
              style={{ height: "100%", width: "100%" }}
            />
          </View>

          {price > 0 ? (
            <View
              tw={[
                "absolute -right-1 -top-1.5 h-[22px] min-w-[24px] items-center justify-center overflow-hidden rounded-full",
                price?.toString()?.length > 2 ? "-right-2.5" : "-right-1",
              ]}
            >
              <View tw="-z-1 absolute h-10 w-20">
                <Image
                  source={require("./gold-button-bg.svg")}
                  style={{ height: "100%", width: "100%" }}
                />
              </View>
              <Text tw="text-xs font-semibold text-black">${price}</Text>
            </View>
          ) : (
            <View tw="absolute -right-1 -top-1 h-[22px] min-w-[22px] items-center justify-center rounded-full bg-white dark:bg-black">
              <Text tw="text-xs font-semibold text-black dark:text-white">
                ${price}
              </Text>
            </View>
          )}
          <Showtime height={25} width={25} color={"#000"} />
        </View>
      </PressableHover>
    );
  }
  return (
    <Button
      size="regular"
      variant="primary"
      onPress={onHandlePayment}
      {...rest}
      style={{
        backgroundColor: "transparent",
      }}
    >
      <ButtonGoldLinearGradient />
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
});

export const ClaimPaidNFTButton = memo(function ClaimPaidNFTButton({
  theme,
  side = "top",
  ...rest
}: GoldButtonProps) {
  const [open, setOpen] = useState(false);
  const isDarkMode = useIsDarkMode();
  const isDark = theme ? theme === "dark" : isDarkMode;
  const router = useRouter();
  if (Platform.OS !== "web") {
    return (
      <Tooltip.Root
        onDismiss={() => {
          setOpen(false);
        }}
        delayDuration={100}
        open={open}
      >
        <Tooltip.Trigger>
          <GoldButton
            onPress={() => {
              setOpen(true);
            }}
            {...rest}
          />
        </Tooltip.Trigger>
        <Tooltip.Content
          sideOffset={3}
          containerStyle={{
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 8,
            paddingBottom: 8,
          }}
          className="web:outline-none"
          side={side}
          presetAnimation="fadeIn"
          backgroundColor={isDark ? "#fff" : colors.gray[900]}
          borderRadius={16}
        >
          <Tooltip.Text
            textSize={16}
            fontWeight="bold"
            textColor={isDark ? colors.gray[900] : "#fff"}
            text={Platform.select({
              ios: "Unable to purchase on iOS",
              android: "Unable to purchase on Android",
              default: "Unable to purchase",
            })}
          />
        </Tooltip.Content>
      </Tooltip.Root>
    );
  }
  return <GoldButton {...rest} />;
});
