import { Button } from "design-system/button";
import { Close, MoreHorizontal } from "design-system/icon";
import { Pressable } from "design-system/pressable-scale";
import { tw } from "design-system/tailwind";
import { Text } from "design-system/text";
import { View } from "design-system/view";

type Props = {
  title?: string;
  close?: () => void;
};

export function Header({ title, close }: Props) {
  return (
    <>
      <View tw="h-4 items-center justify-center">
        <View tw="h-1 w-12 rounded-lg bg-gray-300 dark:bg-gray-700" />
      </View>
      <View tw="p-[16px] h-16 flex-row items-center justify-between">
        <Pressable onPress={close}>
          <Close
            width={24}
            height={24}
            color={
              tw.style("bg-black dark:bg-white")?.backgroundColor as string
            }
          />
        </Pressable>
        <Text variant="text-lg" tw="dark:text-white font-bold">
          {title}
        </Text>
        <View tw="w-6" />
        {/* <Pressable onPress={close}>
        <MoreHorizontal
          width={24}
          height={24}
          color={tw.style("bg-black dark:bg-white")?.backgroundColor as string}
        />
      </Pressable> */}
      </View>
    </>
  );
}
