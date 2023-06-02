import React, { ReactNode } from "react";

import { TW } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

export type ChipProps = {
  label: string;
  tw?: TW;
  icon?: ReactNode;
  variant?: "filled" | "text";
  size?: "medium" | "small";
  textTw?: string;
};
const VARIANT_TW = {
  filled: "bg-gray-100 dark:bg-gray-900",
  text: "",
};

const CONTAINER_SIZE_TW = {
  small: "px-2 py-1.5",
  medium: "px-3 py-2.5",
};
const TEXT_SIZE_TW = {
  small: "text-xs font-semibold",
  medium: "text-sm font-semibold",
};

export const Chip = ({
  label,
  tw = "",
  icon,
  variant = "filled",
  size = "small",
  textTw = "",
}: ChipProps) => {
  return (
    <View
      tw={[
        "flex-row items-center rounded-full",
        VARIANT_TW[variant],
        variant !== "text" ? CONTAINER_SIZE_TW[size] : "",
        tw,
      ]}
    >
      {React.isValidElement(icon) && <View tw="mr-1.5">{icon}</View>}
      <Text tw={["text-gray-500", TEXT_SIZE_TW[size], textTw]}>{label}</Text>
    </View>
  );
};
