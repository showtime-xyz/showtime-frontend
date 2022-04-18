import { Meta } from "@storybook/react";

import { useBottomTabBarHeight } from "app/lib/react-navigation/bottom-tabs/index.web";

import { Button } from "../button";
import { useIsDarkMode } from "../hooks";
import { ArrowRight } from "../icon";
import { colors } from "../tailwind/colors";
import { Text } from "../text";
import { useToast } from "../toast";
import { View } from "../view";
import { SnackbarProvider, useSnackbar } from "./index";

export default {
  component: SnackbarProvider,
  title: "Components/Snackbar",
} as Meta;
const Snackbar = () => {
  const snackbar = useSnackbar();
  const toast = useToast();
  const isDark = useIsDarkMode();
  const toggleSnackbar = (cb: () => void) => {
    if (snackbar?.isVisible) {
      snackbar.hide();
    } else {
      cb();
    }
  };
  return (
    <View tw="flex-1 justify-center items-center bg-gray-600">
      <Button
        tw="mb-4"
        onPress={() =>
          toggleSnackbar(() =>
            snackbar?.show({
              text: "Minting “A day in the woods...”",
            })
          )
        }
      >
        Show default
      </Button>
      <Button
        tw="mb-4"
        onPress={() =>
          toggleSnackbar(() =>
            snackbar?.show({
              text: "Minting “A day in the woods...”",
              iconStatus: "waiting",
            })
          )
        }
      >
        Show to waiting
      </Button>

      <Button
        tw="mb-4"
        onPress={() =>
          snackbar?.update({
            text: "Minting “A day in the woods...”",
            iconStatus: "done",
            action: {
              text: "View",
              onPress: () => {
                toast?.show({
                  message: "View",
                  hideAfter: 1000,
                });
              },
              element: (
                <View tw="flex-row items-center justify-center">
                  <Text
                    tw="text-white dark:text-gray-900 font-bold"
                    variant="text-xs"
                    numberOfLines={1}
                  >
                    View
                  </Text>
                  <ArrowRight
                    width={14}
                    height={14}
                    color={isDark ? colors.gray[900] : colors.white}
                  />
                </View>
              ),
            },
          })
        }
      >
        Update to success
      </Button>
      <Button
        tw="mb-4"
        onPress={() =>
          toggleSnackbar(() => {
            snackbar?.show({
              text: "Minting “A day in the woods...”",
              iconStatus: "waiting",
              preset: "explore",
            });
          })
        }
      >
        Show explore style
      </Button>

      <View tw="flex-row items-center justify-center">
        <Text variant="text-base" tw="dark:text-white text-gray-300">
          Transition:
        </Text>
        <Button
          tw="ml-4"
          onPress={() =>
            toggleSnackbar(() =>
              snackbar?.show({
                text: "Minting “A day in the woods...”",
                transition: "slide",
              })
            )
          }
        >
          Slide
        </Button>
        <Button
          tw="ml-4"
          onPress={() =>
            toggleSnackbar(() =>
              snackbar?.show({
                text: "Minting “A day in the woods...”",
                transition: "scale",
              })
            )
          }
        >
          Grow
        </Button>
        <Button
          tw="ml-4"
          onPress={() =>
            toggleSnackbar(() =>
              snackbar?.show({
                text: "Minting “A day in the woods...”",
                transition: "fade",
              })
            )
          }
        >
          Fade
        </Button>
      </View>

      <Button tw="mt-4" onPress={() => snackbar?.hide()}>
        Hide
      </Button>
    </View>
  );
};
export const Basic: React.VFC<{}> = () => (
  <SnackbarProvider>
    <Snackbar />
  </SnackbarProvider>
);
