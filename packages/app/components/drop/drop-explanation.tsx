import { Dimensions, Platform } from "react-native";

import { Image } from "@showtime-xyz/universal.image";
import { View } from "@showtime-xyz/universal.view";

import { Explanation } from "../explanation";

const values = [
  {
    title: "A gift for your community",
    description:
      "A reward they can showcase. Bonus: engage them with unlockable features!",
  },
  {
    title: "Grow your web3 presence",
    description: "Collectors will follow you on Showtime.",
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
    description: "Your following & friends can collect it for free.",
  },
];

export const DropExplanation = ({ onDone }: { onDone: () => void }) => {
  const previewAspectRatio = 375 / 620;

  const previewHeight = Dimensions.get("window").height / 3.2;
  const previewWidth = previewHeight * previewAspectRatio;

  return (
    <Explanation
      values={values}
      title="Create a drop"
      coverElement={
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
              alt="Preview"
            />
          </View>
        </View>
      }
      onDone={onDone}
      ctaCopy={"Let's go"}
    />
  );
};
