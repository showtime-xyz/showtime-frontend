import { View } from "@showtime/universal-ui.view";
import { Text } from "@showtime/universal-ui.text";
import { Button } from "@showtime/universal-ui.button";
import { Close, MoreHorizontal } from "@showtime/universal-ui.icon";
import { tw } from "@showtime/universal-ui.tailwind";

type Props = {
  title?: string;
  close?: () => void;
};

export function Header({ title, close }: Props) {
  return (
    <View tw="p-[16px] flex-row items-center justify-between">
      <View tw="w-[48px] h-[48px] justify-center items-center">
        <Button
          onPress={close}
          variant="tertiary"
          tw="rounded-full h-[48px] w-[48px]"
          iconOnly={true}
        >
          <Close
            width={24}
            height={24}
            color={
              tw.style("bg-black dark:bg-white")?.backgroundColor as string
            }
          />
        </Button>
      </View>
      <Text variant="text-lg" tw="dark:text-white font-bold">
        {title}
      </Text>
      <View tw="w-8 h-8">
        <Button
          onPress={close}
          variant="tertiary"
          tw="hidden h-8 rounded-full p-2"
          iconOnly={true}
        >
          <MoreHorizontal
            width={24}
            height={24}
            color={
              tw.style("bg-black dark:bg-white")?.backgroundColor as string
            }
          />
        </Button>
      </View>
    </View>
  );
}
