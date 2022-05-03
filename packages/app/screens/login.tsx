import { useCallback } from "react";

import { Login } from "app/components/login";
import { useTrackPageViewed } from "app/lib/analytics";
import { createParam } from "app/navigation/use-param";
import { useRouter } from "app/navigation/use-router";

import { withModalScreen } from "design-system/modal-screen/with-modal-screen";

type Query = {
  redirect_url: string;
};

const { useParam } = createParam<Query>();

function LoginModal() {
  //#region hooks
  useTrackPageViewed({ name: "Login" });
  const [redirect_url] = useParam("redirect_url");
  const router = useRouter();
  //#endregion

  //#region callbacks
  const handleOnLogin = useCallback(() => {
    if (redirect_url && redirect_url.length > 0) {
      /**
       * TODO: we need to get rid off this.
       */
      router.pop();
      router.push(decodeURIComponent(redirect_url));
    } else {
      router.pop();
    }
  }, [redirect_url, router]);
  //#endregion

  return <Login onLogin={handleOnLogin} />;
}

export const LoginScreen = withModalScreen(
  LoginModal,
  "Sign In",
  "/login",
  "loginModal"
);
