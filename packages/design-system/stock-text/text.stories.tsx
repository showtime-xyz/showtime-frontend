import { View } from "@showtime-xyz/universal.view";

import { StockText } from "./stock-text";

export default {
  component: Text,
  title: "Components/Text",
};

export const TextXS = () => (
  <StockText tw="text-xs text-black dark:text-white">Hello World!</StockText>
);

export const TextXSCapsize = () => (
  <View tw="bg-black">
    <StockText tw="text-xs text-black dark:text-white">Hello World!</StockText>
    <StockText tw="text-xs text-black dark:text-white">Hello World!</StockText>
  </View>
);

export const TextXSBoldAndPurple = () => (
  <StockText tw="text-xs font-bold text-black dark:text-white">
    Hello <StockText tw="text-xs text-purple-800">World</StockText>
  </StockText>
);

export const TextXSBoldAndPurpleCapsize = () => (
  <View tw="bg-black">
    <StockText tw="text-xs font-bold text-black dark:text-white">
      Hello <StockText tw="text-xs text-purple-800">World</StockText>
    </StockText>
    <StockText tw="text-xs font-bold text-black dark:text-white">
      Hello <StockText tw="text-xs text-purple-800">World</StockText>
    </StockText>
  </View>
);

export const TextSM = () => (
  <StockText tw="text-sm text-black dark:text-white">Hello World!</StockText>
);

export const TextSMCapsize = () => (
  <View tw="bg-black">
    <StockText tw="text-sm text-black dark:text-white">Hello World!</StockText>
  </View>
);

export const TextBase = () => (
  <StockText tw="text-base text-black dark:text-white">Hello World!</StockText>
);

export const TextBaseCapsize = () => (
  <View tw="bg-black">
    <StockText tw="text-base text-black dark:text-white">
      Hello World!
    </StockText>
  </View>
);

export const TextLG = () => (
  <StockText tw="text-lg text-black dark:text-white">Hello World!</StockText>
);

export const TextLGCapsize = () => (
  <View tw="bg-black">
    <StockText tw="text-lg text-black dark:text-white">Hello World!</StockText>
    <StockText tw="text-lg text-black dark:text-white">Hello World!</StockText>
  </View>
);

export const TextXL = () => (
  <StockText tw="text-xl text-black dark:text-white">Hello World!</StockText>
);

export const TextXLCapsize = () => (
  <View tw="bg-black">
    <StockText tw="text-xl text-black dark:text-white">Hello World!</StockText>
  </View>
);

export const Text2XL = () => (
  <StockText tw="text-2xl text-black dark:text-white">Hello World!</StockText>
);

export const Text2XLCapsize = () => (
  <View tw="bg-black">
    <StockText tw="text-2xl text-black dark:text-white">Hello World!</StockText>
  </View>
);

export const Text3XL = () => (
  <StockText tw="text-3xl text-black dark:text-white">Hello World!</StockText>
);

export const Text3XLCapsize = () => (
  <View tw="bg-black">
    <StockText tw="text-3xl text-black dark:text-white">Hello World!</StockText>
  </View>
);

export const Text4XL = () => (
  <StockText tw="text-4xl text-black dark:text-white">Hello World!</StockText>
);

export const Text4XLCapsize = () => (
  <View tw="bg-black">
    <StockText tw="text-4xl text-black dark:text-white">Hello World!</StockText>
  </View>
);
