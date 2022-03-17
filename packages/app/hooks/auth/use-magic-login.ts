import { useCallback } from "react";

import { BYPASS_EMAIL_WITH_INSECURE_KEYS } from "app/lib/constants";
import { magic } from "app/lib/magic";
import { mixpanel } from "app/lib/mixpanel";
import { overrideMagicInstance } from "app/utilities";

import { useAuth } from "./use-auth";

const LOGIN_MAGIC_ENDPOINT = "login_magic";

export function useMagicLogin() {
  //#region hooks
  const { setAuthenticationStatus, login, logout } = useAuth();
  //#endregion

  //#region methods
  const loginWithPhoneNumber = useCallback(
    async function loginWithPhoneNumber(phoneNumber: string) {
      setAuthenticationStatus("AUTHENTICATING");
      try {
        const did = await magic.auth.loginWithSMS({
          phoneNumber,
        });

        await login(LOGIN_MAGIC_ENDPOINT, {
          did,
          phone_number: phoneNumber,
        });

        mixpanel.track(`Login success - phone number`);
      } catch (error) {
        logout();
        throw error;
      }
    },
    [login, logout, setAuthenticationStatus]
  );
  const loginWithEmail = useCallback(
    async function loginWithEmail(email: string) {
      setAuthenticationStatus("AUTHENTICATING");
      const selectedMagicInstance = overrideMagicInstance(email);
      const overrideEmail = selectedMagicInstance.testMode
        ? BYPASS_EMAIL_WITH_INSECURE_KEYS
        : email;

      const did = await selectedMagicInstance.auth.loginWithMagicLink({
        email: overrideEmail,
      });

      try {
        await login(LOGIN_MAGIC_ENDPOINT, {
          did,
          email: overrideEmail,
        });

        mixpanel.track(`Login success - email`);
      } catch (error) {
        logout();
        throw error;
      }
    },
    [login, logout, setAuthenticationStatus]
  );
  //#endregion
  return {
    loginWithPhoneNumber,
    loginWithEmail,
  };
}
