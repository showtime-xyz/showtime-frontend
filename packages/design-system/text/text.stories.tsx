import { View } from "@showtime-xyz/universal.view";

import { Text } from "./index";

export default {
  component: Text,
  title: "Components/Text",
};

export const TextXS = () => (
  <Text tw="text-xs text-black dark:text-white">Hello World!</Text>
);

export const TextXSCapsize = () => (
  <View tw="bg-black">
    <Text tw="text-xs text-black dark:text-white">Hello World!</Text>
    <Text tw="text-xs text-black dark:text-white">Hello World!</Text>
  </View>
);

export const TextXSBoldAndPurple = () => (
  <Text tw="text-xs font-bold text-black dark:text-white">
    Hello <Text tw="text-xs text-purple-800">World</Text>
  </Text>
);

export const TextXSBoldAndPurpleCapsize = () => (
  <View tw="bg-black">
    <Text tw="text-xs font-bold text-black dark:text-white">
      Hello <Text tw="text-xs text-purple-800">World</Text>
    </Text>
    <Text tw="text-xs font-bold text-black dark:text-white">
      Hello <Text tw="text-xs text-purple-800">World</Text>
    </Text>
  </View>
);

export const TextSM = () => (
  <Text tw="text-sm text-black dark:text-white">Hello World!</Text>
);

export const TextSMCapsize = () => (
  <View tw="bg-black">
    <Text tw="text-sm text-black dark:text-white">Hello World!</Text>
  </View>
);

export const TextBase = () => (
  <Text tw="text-base text-black dark:text-white">Hello World!</Text>
);

export const TextBaseCapsize = () => (
  <View tw="bg-black">
    <Text tw="text-base text-black dark:text-white">Hello World!</Text>
  </View>
);

export const TextLG = () => (
  <Text tw="text-lg text-black dark:text-white">Hello World!</Text>
);

export const TextLGCapsize = () => (
  <View tw="bg-black">
    <Text tw="text-lg text-black dark:text-white">Hello World!</Text>
    <Text tw="text-lg text-black dark:text-white">Hello World!</Text>
  </View>
);

export const TextXL = () => (
  <Text tw="text-xl text-black dark:text-white">Hello World!</Text>
);

export const TextXLCapsize = () => (
  <View tw="bg-black">
    <Text tw="text-xl text-black dark:text-white">Hello World!</Text>
  </View>
);

export const Text2XL = () => (
  <Text tw="text-2xl text-black dark:text-white">Hello World!</Text>
);

export const Text2XLCapsize = () => (
  <View tw="bg-black">
    <Text tw="text-2xl text-black dark:text-white">Hello World!</Text>
  </View>
);

export const Text3XL = () => (
  <Text tw="text-3xl text-black dark:text-white">Hello World!</Text>
);

export const Text3XLCapsize = () => (
  <View tw="bg-black">
    <Text tw="text-3xl text-black dark:text-white">Hello World!</Text>
  </View>
);

export const Text4XL = () => (
  <Text tw="text-4xl text-black dark:text-white">Hello World!</Text>
);

export const Text4XLCapsize = () => (
  <View tw="bg-black">
    <Text tw="text-4xl text-black dark:text-white">Hello World!</Text>
  </View>
);
