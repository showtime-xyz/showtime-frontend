import { useEffect } from "react";
import { KeyboardAvoidingView, Platform, ViewProps } from "react-native";

import { AvoidSoftInput } from "react-native-avoid-softinput";

import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";

/**
 * extracted these number from react-navigation
 */
// @ts-ignore
const modalPresentationHeight = Platform.isPad
  ? 6
  : Platform.OS === "ios"
  ? 12
  : 0;

export function CommentsContainer({ children, style }: ViewProps) {
  const { top, bottom } = useSafeAreaInsets();
  // we're handling keyboard here with a keyboardavoidingview.
  // TODO: Refactor, replace keyboard avoid view
  useEffect(() => {
    AvoidSoftInput.setEnabled(false);

    return () => {
      AvoidSoftInput.setEnabled(true);
    };
  }, []);
  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={
        top + modalPresentationHeight - Math.max(0, bottom - 16)
      }
      style={style}
    >
      {children}
    </KeyboardAvoidingView>
  );
}
