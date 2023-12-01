import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import UploadComposer from "app/components/upload/composer";

export const UploadComposerScreen = withModalScreen(UploadComposer, {
  title: "",
  matchingPathname: "/upload/composer",
  matchingQueryParam: "uploadComposerModal",
  disableBackdropPress: true,
  snapPoints: ["100%"],
  headerShown: false,
  tw: "min-h-[80vh] md:min-h-[auto] max-h-[400px] md:max-h-[500px]",
});
