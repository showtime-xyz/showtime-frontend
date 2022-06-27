import { ComponentProps, useMemo } from 'react';
import { ScrollView as ReactNativeScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import type { TW } from "@showtime-xyz/universal.tailwind";

export type ScrollViewProps = {
  tw?: TW;
  asKeyboardAwareScrollView?: boolean;
} & ComponentProps<
  typeof ReactNativeScrollView | typeof KeyboardAwareScrollView
>;
