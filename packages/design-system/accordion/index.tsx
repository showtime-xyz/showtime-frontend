import { useContext } from "react";

import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Text, Props as TextProps } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";
import { ViewProps } from "@showtime-xyz/universal.view";

import { Accordion as RNAccordion } from "./lib";
import { ItemProps } from "./lib/types";

type ChevronRotazeZ = "top" | "right" | "bottom" | "left";
type ChevronProps = {
  children?: any;
  /**
   * Define Chevron icon arrow points in the direction.
   * @type An array of two lengths
   * e.g. rotazeZ={["right", "bottom"]}
   */
  rotazeZ?: ChevronRotazeZ[];
};
const formatRotazeZ = (rotazeZ: ChevronRotazeZ) => {
  switch (rotazeZ) {
    case "top":
      return "0deg";
    case "bottom":
      return "180deg";
    case "right":
      return "90deg";
    case "left":
      return "270deg";
    default:
      return "0deg";
  }
};
const Chevron = ({ children, rotazeZ = ["bottom", "top"] }: ChevronProps) => {
  const { value: selectedValue } = useContext(RNAccordion.RootContext);
  const { value: itemValue } = useContext(RNAccordion.ItemContext);
  const isExpanded = itemValue === selectedValue;
  const isDark = useIsDarkMode();

  return (
    <MotiView
      animate={{
        rotateZ: isExpanded
          ? formatRotazeZ(rotazeZ[1])
          : formatRotazeZ(rotazeZ[0]),
      }}
      transition={{
        type: "timing",
        duration: 500,
        easing: Easing.bezier(0.87, 0, 0.13, 1),
      }}
    >
      {children ? (
        children
      ) : (
        <Svg width={14} height={8} fill="none">
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.707 7.707a1 1 0 0 1-1.414 0L7 2.414 1.707 7.707A1 1 0 0 1 .293 6.293l6-6a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414Z"
            fill={isDark ? "#FFF" : "#18181B"}
          />
        </Svg>
      )}
    </MotiView>
  );
};

const Item = ({ tw = "", disabled, ...props }: ViewProps & ItemProps) => {
  return (
    <RNAccordion.Item value={props.value} disabled={disabled}>
      <View tw={["rounded-2xl bg-white dark:bg-black", tw]} {...props} />
    </RNAccordion.Item>
  );
};

const Trigger = ({ tw = "", ...props }: ViewProps) => {
  return (
    <RNAccordion.Trigger>
      <View
        tw={["w-full flex-row items-center justify-between px-4 py-5", tw]}
        {...props}
      >
        {props.children}
      </View>
    </RNAccordion.Trigger>
  );
};

const Content = ({ tw = "", ...props }: ViewProps) => {
  return (
    <RNAccordion.Content>
      <View tw={["p-4", tw]} {...props} />
    </RNAccordion.Content>
  );
};

const Label = ({ tw = "", ...props }: TextProps) => {
  return (
    <Text
      tw={["text-sm font-bold text-gray-900 dark:text-white", tw]}
      {...props}
    />
  );
};

export const Accordion = {
  Root: RNAccordion.Root,
  Item,
  Trigger,
  Content,
  Label,
  Chevron,
  RNAccordion,
};
export { AnimateHeight } from "./animate-height";
