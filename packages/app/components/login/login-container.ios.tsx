import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ViewProps,
} from "react-native";

import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";

import { useScrollToEnd } from "./useScrollToEnd";

/**
 * extracted these number from react-navigation
 */
// @ts-ignore
const modalPresentationHeight = Platform.isPad
  ? 6
  : Platform.OS === "ios"
  ? 12
  : 0;

export function LoginContainer({ children, style }: ViewProps) {
  const { scrollViewRef } = useScrollToEnd();
  const { top, bottom } = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={
        top + 16 + modalPresentationHeight - Math.max(0, bottom - 16)
      }
      style={style}
    >
      <ScrollView
        ref={scrollViewRef}
        bounces={false}
        removeClippedSubviews={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
