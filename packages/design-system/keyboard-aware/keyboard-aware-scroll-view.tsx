import React, { forwardRef, useRef } from "react";
import { TextInput, ScrollView, Keyboard, Platform } from "react-native";

import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Animated, {
  useAnimatedKeyboard,
  useAnimatedReaction,
  runOnJS,
  KeyboardState,
  useAnimatedProps,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaFrame } from "react-native-safe-area-context";

function withReanimatedKeyboardAwareScrollView(Component: any) {
  const AnimatedScrollView = Animated.createAnimatedComponent(Component);

  return forwardRef(function KeyboardAwareReanimatedScrollView(
    props: React.ComponentProps<typeof Animated.ScrollView>,
    ref: any
  ) {
    const scrollY = useSharedValue(0);
    const keyboard = useAnimatedKeyboard();
    const scrollViewRef = useRef<Animated.ScrollView>();

    // https://github.com/facebook/react-native/issues/23364#issuecomment-642518054
    // PR - https://github.com/facebook/react-native/pull/31943
    const keyboardDismissProp = Platform.select({
      ios: { keyboardDismissMode: "on-drag" } as const,
      android: { onScrollEndDrag: Keyboard.dismiss } as const,
    });

    const screenDimensions = useSafeAreaFrame();
    const performScroll = () => {
      TextInput.State.currentlyFocusedInput()?.measure(
        (x, y, width, textInputHeight, pageX, textInputPageY) => {
          const textinputBottomY = textInputPageY + textInputHeight;
          const keyboardTopY = screenDimensions.height - keyboard.height.value;
          // check whether the text input is covered by the keyboard
          if (textinputBottomY < keyboardTopY) {
            return;
          }

          const DISTANCE_BETWEEN_TEXT_INPUT_AND_KEYBOARD = 80;

          scrollViewRef?.current?.scrollTo({
            y:
              Math.max(scrollY.value, 0) +
              DISTANCE_BETWEEN_TEXT_INPUT_AND_KEYBOARD +
              textinputBottomY -
              keyboardTopY,
          });
        }
      );
    };

    useAnimatedReaction(
      () => {
        return keyboard.state.value;
      },
      (keyboardState, prevState) => {
        if (
          prevState !== KeyboardState.OPEN &&
          keyboardState === KeyboardState.OPEN
        ) {
          runOnJS(performScroll)();
        }
      }
    );

    const containerPaddingStyle = useAnimatedProps(() => {
      return {
        paddingBottom: keyboard.height.value,
      };
    });

    const handler = useAnimatedScrollHandler(
      {
        onScroll: (e) => {
          scrollY.value = e.contentOffset.y;
        },
      },
      [props.onScroll]
    );

    return (
      <>
        <AnimatedScrollView
          {...keyboardDismissProp}
          keyboardShouldPersistTaps="handled"
          {...props}
          //@ts-ignore
          ref={mergeRefs([ref, scrollViewRef])}
          scrollEventThrottle={16}
          onScroll={handler}
        >
          {props.children}
          <Animated.View style={containerPaddingStyle} />
        </AnimatedScrollView>
      </>
    );
  });
}

function mergeRefs<T = any>(
  refs: Array<React.MutableRefObject<T> | React.LegacyRef<T>>
): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

export const KeyboardAwareScrollView =
  withReanimatedKeyboardAwareScrollView(ScrollView);

export const KeyboardAwareBottomSheetScrollView =
  withReanimatedKeyboardAwareScrollView(BottomSheetScrollView);
