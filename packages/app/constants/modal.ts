import { Platform } from "react-native";

/**
 * extracted these number from react-navigation
 */
// @ts-ignore
export const modalPresentationHeight = Platform.isPad
  ? 6
  : Platform.OS === "ios"
  ? 12
  : 0;
