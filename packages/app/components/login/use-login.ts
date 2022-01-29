import { useCallback, useContext, useEffect, useRef } from "react";
import { captureException } from "@sentry/nextjs";
import { useSWRConfig } from "swr";
import { magic } from "app/lib/magic";
import { AppContext } from "app/context/app-context";
import { mixpanel } from "app/lib/mixpanel";
import { useMagicLogin } from "app/hooks/auth/use-magic-login";
import { useWalletLogin } from "app/hooks/auth/use-wallet-login";
import { useAuth } from "app/hooks/auth/use-auth";
import { useStableBlurEffect } from "app/hooks/use-stable-blur-effect";

export const useLogin = (onLogin?: () => void) => {
  //#region state
  const { authenticationStatus, logout } = useAuth();
  const {
    loginWithWallet,
    walletName,
    status: walletStatus,
  } = useWalletLogin();
  const { loginWithEmail, loginWithPhoneNumber } = useMagicLogin();
  //#endregion

  //#region hooks
  const { mutate } = useSWRConfig();
  const context = useContext(AppContext);
  //#endregion

  //#region methods
  const handleLoginSuccess = useCallback(
    (source: string) => {
      mixpanel.track(`Login success - ${source}`);
      if (onLogin) {
        onLogin();
      }
    },
    [mutate, onLogin]
  );
  const handleLoginFailure = useCallback(function handleLoginFailure(error) {
    if (process.env.NODE_ENV === "development" || __DEV__) {
      console.error(error);
    }

    captureException(error, {
      tags: {
        login_signature_flow: "use-login.ts",
        login_magic_link: "use-login.ts",
      },
    });
  }, []);

  const handleSubmitWallet = useCallback(
    async function handleSubmitWallet() {
      try {
        mixpanel.track("Login - wallet button click");

        await loginWithWallet();

        handleLoginSuccess("wallet");
      } catch (error) {
        handleLoginFailure(error);
      }
    },
    [loginWithWallet, handleLoginFailure, handleLoginSuccess]
  );
  const handleSubmitEmail = useCallback(
    async function handleSubmitEmail(email: string) {
      try {
        mixpanel.track("Login - email button click");

        const Web3Provider = (await import("@ethersproject/providers"))
          .Web3Provider;
        // @ts-ignore
        const web3 = new Web3Provider(magic.rpcProvider);
        context.setWeb3(web3);

        await loginWithEmail(email);

        handleLoginSuccess("email");
      } catch (error) {
        handleLoginFailure(error);
      }
    },
    [loginWithEmail, handleLoginFailure, handleLoginSuccess, context.setWeb3]
  );
  const handleSubmitPhoneNumber = useCallback(
    async function handleSubmitPhoneNumber(phoneNumber: string) {
      try {
        mixpanel.track("Login - phone number button click");

        const Web3Provider = (await import("@ethersproject/providers"))
          .Web3Provider;
        // @ts-ignore
        const web3 = new Web3Provider(magic.rpcProvider);
        context.setWeb3(web3);

        await loginWithPhoneNumber(phoneNumber);

        handleLoginSuccess("phone number");
      } catch (error) {
        handleLoginFailure(error);
      }
    },
    [
      loginWithPhoneNumber,
      handleLoginSuccess,
      handleLoginFailure,
      context.setWeb3,
    ]
  );

  /**
   * We make sure to prevent/stop the authentication state,
   * when customer closes the login modal.
   */
  const handleBlur = useCallback(() => {
    if (authenticationStatus === "AUTHENTICATING") {
      logout();
    }
  }, [logout, authenticationStatus]);
  //#endregion

  //#region effects
  useStableBlurEffect(handleBlur);
  //#endregion

  return {
    authenticationStatus,
    loading: authenticationStatus === "AUTHENTICATING",
    walletName,
    walletStatus,

    handleSubmitWallet,
    handleSubmitEmail,
    handleSubmitPhoneNumber,
  };
};
