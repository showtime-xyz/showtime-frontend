import { Meta } from "@storybook/react";

import { Text } from "./index";

export default {
  component: Text,
  title: "Components/Text",
} as Meta;

export const TextXS: React.VFC<{}> = () => (
  <Text variant="text-xs" tw="text-black dark:text-white">
    Hello World
  </Text>
);

export const TextXSBoldAndPurple: React.VFC<{}> = () => (
  <Text variant="text-xs" tw="font-bold text-black dark:text-white">
    Hello{" "}
    <Text variant="text-xs" tw="text-stpurple">
      World
    </Text>
  </Text>
);

export const TextSM: React.VFC<{}> = () => (
  <Text variant="text-sm" tw="text-black dark:text-white">
    Hello World
  </Text>
);

export const TextBase: React.VFC<{}> = () => (
  <Text variant="text-base" tw="text-black dark:text-white">
    Hello World
  </Text>
);

export const TextLG: React.VFC<{}> = () => (
  <Text variant="text-lg" tw="text-black dark:text-white">
    Hello World
  </Text>
);

export const TextXL: React.VFC<{}> = () => (
  <Text variant="text-xl" tw="text-black dark:text-white">
    Hello World
  </Text>
);

export const Text2XL: React.VFC<{}> = () => (
  <Text variant="text-2xl" tw="text-black dark:text-white">
    Hello World
  </Text>
);

export const Text3XL: React.VFC<{}> = () => (
  <Text variant="text-3xl" tw="text-black dark:text-white">
    Hello World
  </Text>
);

export const Text4XL: React.VFC<{}> = () => (
  <Text variant="text-4xl" tw="text-black dark:text-white">
    Hello World
  </Text>
);
