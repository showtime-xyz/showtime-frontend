import { Meta } from "@storybook/react";

import { View } from "@showtime-xyz/universal.view";

import { Text } from "./index";

export default {
  component: Text,
  title: "Components/Text",
} as Meta;

export const TextXS: React.VFC<{}> = () => (
  <Text tw="text-xs text-black dark:text-white">Hello World!</Text>
);

export const TextXSCapsize: React.VFC<{}> = () => (
  <View tw="bg-black">
    <Text tw="text-xs text-black dark:text-white">Hello World!</Text>
    <Text tw="text-xs text-black dark:text-white">Hello World!</Text>
  </View>
);

export const TextXSBoldAndPurple: React.VFC<{}> = () => (
  <Text tw="text-xs font-bold text-black dark:text-white">
    Hello <Text tw="text-xs text-purple-800">World</Text>
  </Text>
);

export const TextXSBoldAndPurpleCapsize: React.VFC<{}> = () => (
  <View tw="bg-black">
    <Text tw="text-xs font-bold text-black dark:text-white">
      Hello <Text tw="text-xs text-purple-800">World</Text>
    </Text>
    <Text tw="text-xs font-bold text-black dark:text-white">
      Hello <Text tw="text-xs text-purple-800">World</Text>
    </Text>
  </View>
);

export const TextSM: React.VFC<{}> = () => (
  <Text tw="text-sm text-black dark:text-white">Hello World!</Text>
);

export const TextSMCapsize: React.VFC<{}> = () => (
  <View tw="bg-black">
    <Text tw="text-sm text-black dark:text-white">Hello World!</Text>
  </View>
);

export const TextBase: React.VFC<{}> = () => (
  <Text tw="text-base text-black dark:text-white">Hello World!</Text>
);

export const TextBaseCapsize: React.VFC<{}> = () => (
  <View tw="bg-black">
    <Text tw="text-base text-black dark:text-white">Hello World!</Text>
  </View>
);

export const TextLG: React.VFC<{}> = () => (
  <Text tw="font-space-bold text-lg text-black dark:text-white">
    Hello World!
  </Text>
);

export const TextLGCapsize: React.VFC<{}> = () => (
  <View tw="bg-black">
    <Text tw="font-space-bold text-lg text-black dark:text-white">
      Hello World!
    </Text>
    <Text tw="font-space-bold text-lg text-black dark:text-white">
      Hello World!
    </Text>
  </View>
);

export const TextXL: React.VFC<{}> = () => (
  <Text tw="text-xl text-black dark:text-white">Hello World!</Text>
);

export const TextXLCapsize: React.VFC<{}> = () => (
  <View tw="bg-black">
    <Text tw="text-xl text-black dark:text-white">Hello World!</Text>
  </View>
);

export const Text2XL: React.VFC<{}> = () => (
  <Text tw="font-space-bold text-2xl text-black dark:text-white">
    Hello World!
  </Text>
);

export const Text2XLCapsize: React.VFC<{}> = () => (
  <View tw="bg-black">
    <Text tw="font-space-bold text-2xl text-black dark:text-white">
      Hello World!
    </Text>
  </View>
);

export const Text3XL: React.VFC<{}> = () => (
  <Text tw="text-3xl text-black dark:text-white">Hello World!</Text>
);

export const Text3XLCapsize: React.VFC<{}> = () => (
  <View tw="bg-black">
    <Text tw="text-3xl text-black dark:text-white">Hello World!</Text>
  </View>
);

export const Text4XL: React.VFC<{}> = () => (
  <Text tw="text-4xl text-black dark:text-white">Hello World!</Text>
);

export const Text4XLCapsize: React.VFC<{}> = () => (
  <View tw="bg-black">
    <Text tw="text-4xl text-black dark:text-white">Hello World!</Text>
  </View>
);
