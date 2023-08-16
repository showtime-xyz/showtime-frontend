import { Platform } from "react-native";

import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { CreateDropSteps } from "app/components/drop/create-drop-steps/create-drop-steps";

export const DropScreen = withModalScreen(CreateDropSteps, {
  title: "Create",
  matchingPathname: "/drop",
  matchingQueryParam: "dropModal",
  tw: "w-full",
  snapPoints: [
    Platform.select({
      ios: 528,
      default: 500,
    }),
    "100%",
  ],
  useNativeModal: false,
  headerShown: false,
});
