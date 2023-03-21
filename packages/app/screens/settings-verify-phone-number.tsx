import { VerifyPhoneNumberModal } from "app/components/settings/verify-phone-number";

import { withModalScreen } from "design-system/modal-screen";

export const VerifyPhoneNumberScreen = withModalScreen(VerifyPhoneNumberModal, {
  title: "Verify Phone Number",
  matchingPathname: "/settings/verify-phone-number",
  matchingQueryParam: "verifyPhoneNumberModal",
  snapPoints: ["90%"],
});
