import { AddEmailModal } from "app/components/settings/add-email";

import { withModalScreen } from "design-system/modal-screen";

export const AddEmailScreen = withModalScreen(AddEmailModal, {
  title: "Add Email",
  matchingPathname: "/settings/add-email",
  matchingQueryParam: "addEmailModal",
  snapPoints: ["90%"],
});
