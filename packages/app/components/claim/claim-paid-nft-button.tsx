import { memo, useState } from "react";
import { Platform } from "react-native";

import * as Tooltip from "universal-tooltip";

import { Button, ButtonProps } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Showtime } from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { PressableHover } from "@showtime-xyz/universal.pressable-hover";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { ButtonGoldLinearGradient } from "app/components/gold-gradient";
import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import { fetcher } from "app/hooks/use-infinite-list-query";
import { useRedirectDropImageShareScreen } from "app/hooks/use-redirect-to-drop-image-share-screen";
import { useLogInPromise } from "app/lib/login-promise";
import { getCurrencyPrice } from "app/utilities";

import { LABEL_SIZE_TW } from "design-system/button/constants";

import { ClaimStatus, getClaimStatus } from "./claim-status";

export const fetchStripeAccountId = async (
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
  style,
  size = "regular",
  ...rest
}: GoldButtonProps) {
  const router = useRouter();
  const price = getCurrencyPrice(edition?.currency, edition?.price);
  const editionId = edition?.creator_airdrop_edition.id;
  const contractAddress = edition?.creator_airdrop_edition.contract_address;
  const iconSize = size === "small" ? 20 : 24;
  const status = getClaimStatus(edition);
  const isClaimed = status === ClaimStatus.Claimed;
  const redirectToDropImageShareScreen = useRedirectDropImageShareScreen();
  const { loginPromise } = useLogInPromise();

  const onHandlePayment = async () => {
    if (isClaimed) {
      redirectToDropImageShareScreen(
        edition?.creator_airdrop_edition.contract_address
      );

      return;
    }
    await loginPromise();
    if (Platform.OS !== "web") {
      return;
    }

    if (Platform.OS === "web") {
      const as = `/checkout-paid-nft`;
      router.push(
        Platform.select({
          native: as,
          web: {
            pathname: router.pathname,
            query: {
              ...router.query,
              checkoutPaidNFTModal: true,
              contractAddress,
              editionId,
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
  const priceText = price ? ` - ${price}` : "";
  if (type === "trending") {
    return (
      <PressableHover
        tw={["h-6 w-24 items-center justify-center rounded-full"]}
        onPress={() => onHandlePayment()}
        {...rest}
      >
        <ButtonGoldLinearGradient />
        <Text tw="text-xs font-bold" style={{ color: colors.gray[900] }}>
          {isClaimed ? "Share" : price}
        </Text>
      </PressableHover>
    );
  }
  if (type === "feed") {
    return (
      <PressableHover onPress={onHandlePayment} {...rest}>
        <View tw={"h-14 w-14 items-center justify-center rounded-full"}>
          <ButtonGoldLinearGradient
            style={{ transform: [{ rotate: "84deg" }] }}
          />

          {isClaimed ? null : edition?.price ? (
            <View
              tw={[
                "absolute -right-1 -top-1.5 h-[22px] min-w-[30px] items-center justify-center overflow-hidden rounded-full px-1",
                price?.toString()?.length > 2 ? "-right-2.5" : "-right-1",
              ]}
            >
              <ButtonGoldLinearGradient />
              <Text tw="text-xs font-semibold text-black">{price}</Text>
            </View>
          ) : (
            <View tw="absolute -right-1 -top-1 h-[22px] min-w-[22px] items-center justify-center rounded-full bg-white dark:bg-black">
              <Text tw="text-xs font-semibold text-black dark:text-white">
                {price}
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
      size={size}
      variant="primary"
      onPress={onHandlePayment}
      style={[
        style as any,
        {
          backgroundColor: "transparent",
        },
      ]}
      {...rest}
    >
      <ButtonGoldLinearGradient />
      <View tw="w-full flex-row items-center justify-center">
        <View>
          <Image
            source={
              Platform.OS === "web"
                ? "https://media.showtime.xyz/assets/st-logo.png"
                : require("app/components/assets/st-logo.png")
            }
            width={iconSize}
            height={iconSize}
            style={{ width: iconSize, height: iconSize }}
          />
        </View>

        <Text tw={["ml-2 font-semibold text-black", LABEL_SIZE_TW[size]]}>
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
