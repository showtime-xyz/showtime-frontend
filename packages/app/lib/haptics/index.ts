import { Platform } from "react-native";

import * as ExpoHaptics from "expo-haptics";

export const Haptics = {
  impactAsync: Platform.select({
    ios: () => ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Light),
    android: () =>
      ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Light),
    default: () => {},
  }),
};
