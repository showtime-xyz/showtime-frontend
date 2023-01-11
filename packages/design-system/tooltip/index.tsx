import { useState } from "react";
import { Platform } from "react-native";

import type { ContentProps, RootProps } from "universal-tooltip";
import * as Tooltip from "universal-tooltip";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";

export const Root = ({ children, ...rest }: RootProps) => {
  const [open, setOpen] = useState(false);
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
      {...rest}
    >
      {children}
    </Tooltip.Root>
  );
};

export const Trigger = Tooltip.Trigger;

export const Content = (props: ContentProps) => {
  const isDark = useIsDarkMode();
  return (
    <Tooltip.Content
      sideOffset={3}
      containerStyle={{
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 8,
        paddingBottom: 8,
      }}
      className="web:outline-none"
      side="right"
      presetAnimation="fadeIn"
      backgroundColor={isDark ? "#fff" : "#000"}
      borderRadius={16}
      {...props}
    />
  );
};

export const Text = Tooltip.Text;
