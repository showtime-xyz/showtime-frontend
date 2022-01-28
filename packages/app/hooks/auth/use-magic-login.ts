import { useCallback } from "react";
import { magic } from "app/lib/magic";
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
      const did = await magic.auth.loginWithMagicLink({ email });

      try {
        await login(LOGIN_MAGIC_ENDPOINT, {
          did,
          email,
        });
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
