import { useState } from "react";
import { Platform, View, Pressable } from "react-native";

import * as Tooltip from "universal-tooltip";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";

import { isMobileWeb } from "app/utilities";

const TriggerView = isMobileWeb() ? View : Pressable;

type ShowtimeTooltipProps = {
  triggerElement: JSX.Element;
  side?: "top" | "bottom" | "left" | "right";
  theme?: "dark" | "light";
  children?: React.ReactNode;
  sideOffset?: number;
};
export const ContentTooltip = ({
  triggerElement,
  side = "right",
  theme,
  children,
  sideOffset = 10,
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
      usePopover={isMobileWeb()}
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
          sideOffset={sideOffset}
          containerStyle={{
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 8,
            paddingBottom: 8,
          }}
          className="web:outline-none"
          side={side}
          maxWidth={200}
          presetAnimation="fadeIn"
          backgroundColor={"#fff"}
          borderRadius={16}
        >
          {children}
          <Tooltip.Arrow width={10} height={5} />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
};
