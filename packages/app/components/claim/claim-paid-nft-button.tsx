import { memo, useState } from "react";
import { Platform } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { BorderlessButton } from "react-native-gesture-handler";
import * as Tooltip from "universal-tooltip";

import { Button, ButtonProps } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Showtime } from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { PressableHover } from "@showtime-xyz/universal.pressable-hover";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { StarDropBadge } from "app/components/creator-channels/components/star-drop-badge";
import { ButtonGoldLinearGradient } from "app/components/gold-gradient";
import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import { fetcher } from "app/hooks/use-infinite-list-query";
import { useRedirectDropImageShareScreen } from "app/hooks/use-redirect-to-drop-image-share-screen";
import { Logger } from "app/lib/logger";
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

const PlatformPressable = Platform.OS === "web" ? Pressable : BorderlessButton;

type GoldButtonProps = Omit<ButtonProps, ""> & {
  theme?: "dark" | "light";
  type?: "feed" | "trending" | "detail" | "messageItem" | "messageInput";
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
      Logger.error("Purchase only for web.");
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
        style={style}
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
      <PressableHover onPress={onHandlePayment} style={style} {...rest}>
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

  if (type === "messageInput") {
    return (
      <PressableHover
        tw="h-12 rounded-full bg-black p-4 dark:bg-white"
        onPress={onHandlePayment}
        style={style}
        {...rest}
      >
        <View tw="w-full flex-row items-center justify-center">
          <View>
            <Image
              source={
                Platform.OS === "web"
                  ? "https://media.showtime.xyz/assets/st-logo.png"
                  : require("app/components/assets/st-logo.png")
              }
              width={16}
              height={16}
              style={{ width: 16, height: 16 }}
            />
          </View>

          <Text
            tw={
              "ml-2 text-base font-semibold text-[#FFCB6C] dark:text-gray-900"
            }
          >
            Collect to unlock channel
          </Text>
        </View>
      </PressableHover>
    );
  }

  if (type === "messageItem") {
    return (
      <View tw="mx-3 my-2 h-[120px] items-center justify-center overflow-hidden rounded-2xl bg-slate-400">
        <PlatformPressable
          //@ts-ignore
          onPress={onHandlePayment}
          activeOpacity={0.7}
          foreground
          style={{
            flexGrow: 1,
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
          {...rest}
        >
          <LinearGradient
            style={{
              position: "absolute",
              width: "200%",
              height: "100%",
              borderRadius: 16,
              overflow: "hidden",
              transform: [{ scaleX: 1 }],
            }}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: -0.6 }}
            // Adding the color stops manually
            colors={[
              "#F5E794",
              "#F5E794",
              "#F5E794",
              "#E6A130",
              "#FFE956",
              "#FFEC92",
              "#FFEC92",
              "#FED749",
              "#FDC93F",
              "#F5E794",
              "#F6C33D",
              "#ED9F26",
              "#E88A3F",
              "#F4CE5E",
              "#E4973C",
              "#FFD480",
              "#F5E794",
              "#F5E794",
              "#F5E794",
            ]}
          />
          <View tw="absolute left-3 top-3">
            <StarDropBadge />
          </View>
          <View tw="flex-row items-center justify-center">
            <View tw="mr-2">
              <Image
                source={
                  Platform.OS === "web"
                    ? "https://media.showtime.xyz/assets/st-logo.png"
                    : require("app/components/assets/st-logo.png")
                }
                width={18}
                height={18}
              />
            </View>
            <Text tw="text-sm font-semibold">Collect to unlock</Text>
          </View>
        </PlatformPressable>
      </View>
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
          Collect to unlock{priceText}
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
