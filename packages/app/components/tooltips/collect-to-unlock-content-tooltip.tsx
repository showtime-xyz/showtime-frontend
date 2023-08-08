import { StyleSheet, Platform } from "react-native";

import { LockBadge, InformationCircle } from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { getCurrencyPrice, getCreatorEarnedMoney } from "app/utilities";

import { ButtonGoldLinearGradient } from "../gold-gradient";
import { ContentTooltip } from "./content-tooltip";

type ContentTypeTooltipProps = {
  creatorUsername?: string;
  price?: number;
  theme?: "dark" | "light";
  currency?: string;
};

export const CollectToUnlockContentTooltip = ({
  creatorUsername,
  price,
  currency,
}: ContentTypeTooltipProps) => {
  return (
    <ContentTooltip
      side="top"
      triggerElement={
        <>
          <View
            tw="rounded bg-black/60"
            style={StyleSheet.absoluteFillObject}
          />
          <View tw="flex-row items-center py-0.5 pl-0.5">
            <View tw="flex-row items-center py-0.5 pl-0.5">
              <InformationCircle color="#FFD554" width={18} height={18} />
              <Text tw="mx-1 text-sm font-medium text-[#FFD554]">
                Collect to unlock content
              </Text>
            </View>
          </View>
        </>
      }
      sideOffset={Platform.OS === "ios" ? 180 : 3}
    >
      <View tw="web:shadow-light h-[200px] w-[350px] rounded-2xl bg-white p-4">
        <View tw="flex-row items-center">
          <View tw="mr-2 h-6 w-6 items-center justify-center overflow-hidden rounded-full">
            <ButtonGoldLinearGradient />
            <LockBadge color="#000" width={12} height={12} />
          </View>
          <Text tw="text-xl font-bold text-gray-900">
            Unlock creator content
          </Text>
        </View>
        <View tw="pl-4">
          <View tw="my-3 flex-row">
            <View tw="mr-2 h-1.5 w-1.5 rounded-full bg-black" />
            <Text tw="break-words text-base text-black">
              Exclusive music, interviews, online concerts, merch discounts,
              AMAs...
            </Text>
          </View>
          <View tw="mb-3 flex-row">
            <View tw="mr-2 h-1.5 w-1.5 rounded-full bg-black" />
            <Text tw="text-base text-black">
              <Text tw="font-bold">
                {creatorUsername ? `@${creatorUsername}` : "Creator"}
              </Text>
              {` will make about ${
                price ? `${getCreatorEarnedMoney(currency, price)}` : "money"
              }`}
            </Text>
          </View>
          <View tw="mb-3 flex-row">
            <View tw="mr-2 h-1.5 w-1.5 rounded-full bg-black" />
            <Text tw="text-base text-black">
              Collect a NFT on Base, Coinbase L2, instantly tradable on OpenSea.
            </Text>
          </View>
          <View tw="flex-row items-center">
            <View tw="mr-2 h-1.5 w-1.5 rounded-full bg-black" />
            <Text tw="text-base text-black">Earn a special Star badge</Text>
            <Image
              source={
                Platform.OS === "web"
                  ? "https://media.showtime.xyz/assets/st-logo.png"
                  : require("app/components/assets/st-logo.png")
              }
              width={18}
              height={18}
              tw="ml-1"
            />
          </View>
        </View>
      </View>
    </ContentTooltip>
  );
};
