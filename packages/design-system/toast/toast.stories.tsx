import { Meta } from "@storybook/react";

import { Button } from "@showtime-xyz/universal.button";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useToast, ToastProvider } from "./index";

export default {
  component: ToastProvider,
  title: "Components/Toast",
} as Meta;

export const Primary: React.VFC<{}> = () => {
  const toast = useToast();
  return (
    <View>
      <Button
        onPress={() => toast?.show({ message: "Gm friends!", hideAfter: 4000 })}
      >
        <Text tw="text-white dark:text-black">Text toast</Text>
      </Button>
      <View tw="my-4"></View>
      <Button
        onPress={() => {
          if (toast?.isVisible) {
            toast.hide();
          } else {
            toast?.show({
              element: (
                <View tw="flex-row items-center p-5">
                  <Spinner size="small" />
                  <View tw="mx-1" />
                  <Text tw="text-black dark:text-white">
                    This toast will hide in 5 seconds.
                  </Text>
                </View>
              ),
            });
          }
        }}
      >
        <Text tw="text-white dark:text-black">Custom toast</Text>
      </Button>
    </View>
  );
};
