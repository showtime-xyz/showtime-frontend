import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import UploadComposer from "app/components/upload/composer";

export const UploadComposerScreen = withModalScreen(UploadComposer, {
  title: "asdasd",
  matchingPathname: "/upload/composer",
  matchingQueryParam: "uploadComposerModal",
  disableBackdropPress: true,
  snapPoints: ["100%"],
});
