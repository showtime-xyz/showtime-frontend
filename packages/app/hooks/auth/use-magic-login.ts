import { useCallback } from "react";

import { useWeb3 } from "app/hooks/use-web3";
import { BYPASS_EMAIL_WITH_INSECURE_KEYS } from "app/lib/constants";
import { magic } from "app/lib/magic";
import { overrideMagicInstance } from "app/utilities";

import { useAuth } from "./use-auth";

const LOGIN_MAGIC_ENDPOINT = "login_magic";

export function useMagicLogin() {
  //#region hooks
  const { setAuthenticationStatus, login, logout } = useAuth();
  const { setWeb3 } = useWeb3();
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

        const Web3Provider = (await import("@ethersproject/providers"))
          .Web3Provider;
        // @ts-ignore
        const web3 = new Web3Provider(magic.rpcProvider);
        setWeb3(web3);
      } catch (error) {
        logout();
        throw error;
      }
    },
    [login, logout, setAuthenticationStatus, setWeb3]
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

        const Web3Provider = (await import("@ethersproject/providers"))
          .Web3Provider;
        // @ts-ignore
        const web3 = new Web3Provider(selectedMagicInstance.rpcProvider);
        setWeb3(web3);
      } catch (error) {
        logout();
        throw error;
      }
    },
    [login, logout, setAuthenticationStatus, setWeb3]
  );
  //#endregion
  return {
    loginWithPhoneNumber,
    loginWithEmail,
  };
}
