import { useState, useEffect } from "react";
import { Dimensions, Platform } from "react-native";

import { MotiView } from "moti";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Image } from "@showtime-xyz/universal.image";
import { ScrollView } from "@showtime-xyz/universal.scroll-view";
import { tw } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { CARD_DARK_SHADOW } from "design-system/theme";

const values = [
  {
    title: "Gift your community a NFT",
    description:
      "A reward they can showcase. Bonus: engage them with unlockable features!",
  },
  {
    title: "Grow your web3 presence",
    description: "Claimers will follow you on Showtime.",
  },
  {
    title: "Instantly tradable on OpenSea",
    description: "And it will show up on wallets like Rainbow.",
  },
  {
    title: "Earn royalties each trade",
    description: "Every resale, you and your fans profit!",
  },
  {
    title: "Share your drop link!",
    description: "Your following & friends can claim it for free.",
  },
];

export const DropExplanation = ({ onDone }: { onDone: () => void }) => {
  const [page, setPage] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setPage((p) => (p + 1) % values.length);
    }, 3000);
  }, []);

  const previewAspectRatio = 375 / 620;

  const previewHeight = Dimensions.get("window").height / 3.2;
  const previewWidth = previewHeight * previewAspectRatio;

  const isDark = useIsDarkMode();
  return (
    <ScrollView>
      <View tw="flex-1 p-8">
        <View tw="mb-10 items-center">
          <View
            tw="rounded-xl shadow-xl"
            style={{
              // @ts-ignore
              boxShadow: isDark ? CARD_DARK_SHADOW : undefined,
            }}
          >
            <Image
              source={Platform.select({
                web: { uri: require("./drop-preview.png") },
                default: require("./drop-preview.png"),
              })}
              tw={`h-[${previewHeight}px] w-[${previewWidth}px] rounded-xl`}
              resizeMode="contain"
            />
          </View>
        </View>
        {/* Preview component here */}
        <Text tw="text-center text-3xl text-gray-900 dark:text-white">
          Drop Free NFTs to your followers
        </Text>
        <View tw="mt-10 flex-row justify-center">
          {new Array(values.length).fill(0).map((v, i) => {
            return (
              <View
                key={i}
                tw={`rounded-full bg-gray-${
                  i === page ? 400 : 200
                } dark:bg-gray-${i === page ? 100 : 500} h-2 w-2 ${
                  i > 0 ? "ml-2" : ""
                }`}
              />
            );
          })}
        </View>
        <MotiView
          key={page}
          from={{ opacity: 0 }}
          transition={{ duration: 600, type: "timing" }}
          animate={{ opacity: 1 }}
          style={tw.style("mt-10 h-30")}
        >
          <Text tw="text-center text-2xl text-gray-900 dark:text-white">
            {values[page].title}
          </Text>
          <View tw="h-4" />
          <Text tw="text-center text-lg text-gray-600 dark:text-gray-400">
            {values[page].description}
          </Text>
        </MotiView>
        <View tw="mt-auto pb-10">
          <Button onPress={onDone}>Let's go</Button>
        </View>
      </View>
    </ScrollView>
  );
};
