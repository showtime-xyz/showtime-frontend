import { Login } from "app/components/login";
import { useTrackPageViewed } from "app/lib/analytics";

import { withModalScreen } from "design-system/modal-screen";

function LoginModal() {
  useTrackPageViewed({ name: "Login" });

  return <Login />;
}

export const LoginScreen = withModalScreen(LoginModal, {
  title: "Sign In",
  matchingPathname: "/login",
  matchingQueryParam: "loginModal",
  snapPoints: ["90%"],
  web_height: `max-h-[100vh] md:max-h-[95vh]`,
  disableBackdropPress: true,
});
