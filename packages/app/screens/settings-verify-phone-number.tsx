import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { VerifyPhoneNumberModal } from "app/components/settings/verify-phone-number";

export const VerifyPhoneNumberScreen = withModalScreen(VerifyPhoneNumberModal, {
  title: "Verify Phone Number",
  matchingPathname: "/settings/verify-phone-number",
  matchingQueryParam: "verifyPhoneNumberModal",
  snapPoints: ["90%"],
});
