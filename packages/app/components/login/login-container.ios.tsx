import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  ViewProps,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

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
        style={{ paddingTop: 16 }}
        bounces={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
