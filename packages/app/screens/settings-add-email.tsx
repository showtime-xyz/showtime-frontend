import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { AddEmailModal } from "app/components/settings/add-email";

export const AddEmailScreen = withModalScreen(AddEmailModal, {
  title: "Add Email",
  matchingPathname: "/settings/add-email",
  matchingQueryParam: "addEmailModal",
  snapPoints: ["90%"],
});
