import { KEYBOARD_STATE } from "@gorhom/bottom-sheet";
import { useAnimatedStyle, SharedValue } from "react-native-reanimated";

export const useKeyboardOffset = (
  top: number,
  keyboardState: SharedValue<KEYBOARD_STATE>
) => {
  const animatedContainerStyle = useAnimatedStyle(
    () => ({
      paddingBottom: keyboardState.value === KEYBOARD_STATE.SHOWN ? top : 0,
    }),
    [top, keyboardState]
  );

  return animatedContainerStyle;
};
