import { ComponentProps } from "react";
import { ScrollView as ReactNativeScrollView } from "react-native";

import type { TW } from "design-system/tailwind";

export type ScrollViewProps = {
  tw?: TW;
} & ComponentProps<typeof ReactNativeScrollView>;
