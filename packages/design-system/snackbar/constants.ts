import { ViewStyle } from "react-native";

import { MotiProps } from "moti";

export type SnackbarTransitionType = "slide" | "scale" | "fade";

export const PRESET_TRANSITION_MAP = new Map<
  SnackbarTransitionType,
  Pick<MotiProps<ViewStyle>, "animate" | "from" | "exit">
>([
  [
    "fade",
    {
      from: { transform: [{ translateY: 0 }], opacity: 0 },
      exit: { transform: [{ translateY: 0 }], opacity: 0 },
      animate: { transform: [{ translateY: 0 }], opacity: 1 },
    },
  ],
  [
    "scale",
    {
      from: { transform: [{ scale: 0.8 }], opacity: 0 },
      animate: { transform: [{ scale: 1 }], opacity: 1 },
      exit: { transform: [{ scale: 0.8 }], opacity: 0 },
    },
  ],
  [
    "slide",
    {
      from: { transform: [{ translateY: 80 }], opacity: 0 },
      animate: { transform: [{ translateY: 0 }], opacity: 1 },
      exit: { transform: [{ translateY: 80 }], opacity: 0 },
    },
  ],
]);
