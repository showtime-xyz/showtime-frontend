import { Meta } from "@storybook/react";

import { Text } from "./index";

export default {
  component: Text,
  title: "Components/Text",
} as Meta;

export const TextXS: React.VFC<{}> = () => (
  <Text tw="text-xs text-black dark:text-white">Hello World</Text>
);

export const TextXSBoldAndPurple: React.VFC<{}> = () => (
  <Text tw="text-xs font-bold text-black dark:text-white">
    Hello <Text tw="text-stpurple text-xs">World</Text>
  </Text>
);

export const TextSM: React.VFC<{}> = () => (
  <Text tw="text-sm text-black dark:text-white">Hello World</Text>
);

export const TextBase: React.VFC<{}> = () => (
  <Text tw="text-base text-black dark:text-white">Hello World</Text>
);

export const TextLG: React.VFC<{}> = () => (
  <Text tw="font-space-bold text-lg text-black dark:text-white">
    Hello World
  </Text>
);

export const TextXL: React.VFC<{}> = () => (
  <Text tw="text-xl text-black dark:text-white">Hello World</Text>
);

export const Text2XL: React.VFC<{}> = () => (
  <Text tw="font-space-bold text-2xl text-black dark:text-white">
    Hello World
  </Text>
);

export const Text3XL: React.VFC<{}> = () => (
  <Text tw="text-3xl text-black dark:text-white">Hello World</Text>
);

export const Text4XL: React.VFC<{}> = () => (
  <Text tw="text-4xl text-black dark:text-white">Hello World</Text>
);
