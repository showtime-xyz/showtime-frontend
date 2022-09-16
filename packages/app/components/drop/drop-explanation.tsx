import { useState, useEffect } from "react";
import { Dimensions, Platform } from "react-native";

import { MotiView } from "moti";

import { Button } from "@showtime-xyz/universal.button";
import { Image } from "@showtime-xyz/universal.image";
import { ScrollView } from "@showtime-xyz/universal.scroll-view";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useModalScreenViewStyle } from "app/hooks/use-modal-screen-view-style";

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
  const modalScreenViewStyle = useModalScreenViewStyle();

  return (
    <>
      <ScrollView>
        <View tw="px-8" style={modalScreenViewStyle}>
          <View tw="mb-10 items-center">
            <View tw="dark:shadow-dark shadow-light rounded-xl shadow-xl">
              <Image
                source={Platform.select({
                  web: { uri: require("./drop-preview.png") },
                  default: require("./drop-preview.png"),
                })}
                width={previewWidth}
                height={previewHeight}
                tw="rounded-xl"
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
            // TODO: need to dig/feedback to moti, if opacity = 0, MotiView will always 0 and only haapped on local web.
            from={{ opacity: __DEV__ ? 1 : 0 }}
            transition={{ duration: 600, type: "timing" }}
            animate={{ opacity: 1 }}
            style={{
              marginTop: 40,
              marginBottom: 16,
              height: 128,
            }}
          >
            <Text tw="text-center text-2xl text-gray-900 dark:text-white">
              {values[page].title}
            </Text>
            <View tw="h-4" />
            <Text tw="text-center text-lg text-gray-600 dark:text-gray-400">
              {values[page].description}
            </Text>
          </MotiView>
        </View>
      </ScrollView>
      <View tw="absolute bottom-0 mt-auto w-full px-8">
        <Button size="regular" onPress={onDone}>
          Let's go
        </Button>
      </View>
    </>
  );
};
