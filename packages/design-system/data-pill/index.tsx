import { useMemo } from "react";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import type { TW } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

type Type = "primary" | "secondary" | "text";
type DataPillProps = {
  type?: "primary" | "secondary" | "text";
  label?: string;
  tw?: string;
  textTw?: string;
};
// TODO: tw `dark:text-xxx-xxx` prop not working on native, not sure why. so use an array to hack make it works first and dig it later.
const textTwColorMap = new Map<Type, TW>([
  ["primary", ["text-gray-500", ""]],
  ["secondary", ["text-white", "text-gray-900"]],
  ["text", ["text-gray-900", "text-gray-100"]],
]);

const bgColorMap = new Map<Type, TW>([
  ["primary", "bg-gray-100 dark:bg-gray-900"],
  ["secondary", "bg-gray-900 dark:bg-gray-100"],
  ["text", "bg-gray-100 dark:bg-gray-900"],
]);

const DEFAULT_TYPE = "primary";

export const DataPill = (props: DataPillProps) => {
  const { type = DEFAULT_TYPE, label, tw = "", textTw = "" } = props;
  const isDark = useIsDarkMode();

  const textColorTw = useMemo(() => {
    const tws = textTwColorMap.get(type);
    return tws?.length ? tws[isDark ? 1 : 0] : "";
  }, [isDark, type]);

  const bgColorTw = useMemo(() => {
    return bgColorMap.get(type) || "";
  }, [type]);

  return (
    <View
      tw={["items-center justify-center rounded-full py-2 px-3", bgColorTw, tw]}
    >
      <Text tw={["text-xs font-medium", textColorTw, textTw]}>{label}</Text>
    </View>
  );
};
