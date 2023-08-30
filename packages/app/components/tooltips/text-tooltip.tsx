import { useState } from "react";
import { Platform, View, Pressable } from "react-native";

import * as Tooltip from "universal-tooltip";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";

import { isMobileWeb } from "app/utilities";

const TriggerView = isMobileWeb() ? View : Pressable;

type ShowtimeTooltipProps = {
  triggerElement: JSX.Element;
  text?: string;
  side?: "top" | "bottom" | "left" | "right";
  theme?: "dark" | "light";
};
export const TextTooltip = ({
  triggerElement,
  text,
  side = "right",
  theme,
}: ShowtimeTooltipProps) => {
  const [open, setOpen] = useState(false);

  const isDarkMode = useIsDarkMode();
  const isDark = theme ? theme === "dark" : isDarkMode;

  return (
    <Tooltip.Root
      onDismiss={() => {
        setOpen(false);
      }}
      // on web: I want to be triggered automatically with the mouse.
      {...Platform.select({
        web: {},
        default: {
          open,
          onDismiss: () => {
            setOpen(false);
          },
        },
      })}
      delayDuration={100}
    >
      <Tooltip.Trigger>
        <TriggerView
          {...Platform.select({
            web: {},
            default: {
              open,
              onPress: () => {
                setOpen(true);
              },
            },
          })}
        >
          {triggerElement}
        </TriggerView>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          sideOffset={3}
          containerStyle={{
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 8,
            paddingBottom: 8,
          }}
          className="web:outline-none"
          side={side}
          presetAnimation="fadeIn"
          backgroundColor={isDark ? "#fff" : "#000"}
          borderRadius={12}
        >
          <Tooltip.Text
            text={text}
            style={{
              color: isDark ? "#000" : "#fff",
              fontSize: 16,
              fontWeight: "bold",
            }}
          />
          <Tooltip.Arrow width={12} height={6} />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
};
