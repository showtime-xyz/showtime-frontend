import * as ExpoHaptics from "expo-haptics";

export const Haptics = {
  impactAsync: (
    style: ExpoHaptics.ImpactFeedbackStyle = ExpoHaptics.ImpactFeedbackStyle
      .Light
  ) => ExpoHaptics.impactAsync(style),
  ImpactFeedbackStyle: {
    ...ExpoHaptics.ImpactFeedbackStyle,
  },
  NotificationFeedbackType: {
    ...ExpoHaptics.NotificationFeedbackType,
  },
  notificationAsync: (style: ExpoHaptics.NotificationFeedbackType) =>
    ExpoHaptics.notificationAsync(style),
  selectionAsync: () => ExpoHaptics.selectionAsync(),
};
