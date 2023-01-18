import { useState } from "react";
import { Platform, TouchableHighlight } from "react-native";

import { Meta } from "@storybook/react";

import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import * as Tooltip from "./index";

export default {
  component: View,
  title: "Components/Tooltip",
} as Meta;

const TriggerView = Platform.OS === "web" ? View : (TouchableHighlight as any);

export const Basic: React.FC<{}> = () => {
  const [open, setOpen] = useState(false);
  return (
    <View tw="flex-1 items-center justify-center">
      <Tooltip.Root
        {...Platform.select({
          web: {},
          default: {
            open,
            onDismiss: () => {
              setOpen(false);
            },
          },
        })}
      >
        <Tooltip.Trigger>
          <TriggerView
            {...Platform.select({
              web: {},
              default: {
                onPress: () => {
                  setOpen(true);
                },
              },
            })}
            classNmae
            tw="cursor-pointer items-center justify-center rounded-lg bg-black py-2 px-4"
          >
            <Text tw="text-sm text-white">
              {Platform.OS === "web" ? "Hover to open it" : "Open it"}
            </Text>
          </TriggerView>
        </Tooltip.Trigger>
        <Tooltip.Content backgroundColor="#000">
          <Tooltip.Text
            text="Tooltip"
            fontWeight="bold"
            textSize={16}
            textColor="#fff"
          />
        </Tooltip.Content>
      </Tooltip.Root>
    </View>
  );
};
