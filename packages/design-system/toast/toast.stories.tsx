import { Meta } from "@storybook/react";

import { useToast } from "./index";
import { Button } from "@showtime/universal-ui.button";
import { Text } from "@showtime/universal-ui.text";
import { View } from "@showtime/universal-ui.view";
import { Spinner } from "@showtime/universal-ui.spinner";

export default {
  component: Spinner,
  title: "Components/Toast",
} as Meta;

export const Primary: React.VFC<{}> = () => {
  const toast = useToast();
  return (
    <View>
      <Button
        onPress={() => toast.show({ message: "Gm friends!", hideAfter: 4000 })}
      >
        <Text tw="text-white dark:text-black">Text toast</Text>
      </Button>
      <View tw="my-4"></View>
      <Button
        onPress={() => {
          if (toast.isVisible) {
            toast.hide();
          } else {
            toast.show({
              element: (
                <View tw="flex-row items-center p-5">
                  <Spinner size={20} />
                  <View tw="mx-1" />
                  <Text tw="dark:text-white text-black">
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
