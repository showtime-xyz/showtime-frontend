import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { Login } from "app/components/login";
import { useTrackPageViewed } from "app/lib/analytics";

function LoginModal() {
  useTrackPageViewed({ name: "Login" });

  return <Login />;
}

export const LoginScreen = withModalScreen(LoginModal, {
  title: "Sign In",
  matchingPathname: "/login",
  matchingQueryParam: "loginModal",
  snapPoints: ["90%"],
  disableBackdropPress: true,
});
