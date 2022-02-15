import { useCallback, useContext, useEffect, useRef } from "react";

import { captureException } from "@sentry/nextjs";

import { useAuth } from "app/hooks/auth/use-auth";
import { useMagicLogin } from "app/hooks/auth/use-magic-login";
import { useWalletLogin } from "app/hooks/auth/use-wallet-login";
import { useStableBlurEffect } from "app/hooks/use-stable-blur-effect";
import { useWeb3 } from "app/hooks/use-web3";
import { magic } from "app/lib/magic";
import { mixpanel } from "app/lib/mixpanel";

type LoginSource = "undetermined" | "magic" | "wallet";

export const useLogin = (onLogin?: () => void) => {
  const loginSource = useRef<LoginSource>("undetermined");

  //#region hooks
  const { authenticationStatus, logout } = useAuth();
  const {
    loginWithWallet,
    name: walletName,
    status: walletStatus,
    error: walletError,
  } = useWalletLogin();
  const { loginWithEmail, loginWithPhoneNumber } = useMagicLogin();
  //#endregion

  //#region hooks
  const { setWeb3 } = useWeb3();
  //#endregion

  //#region methods
  const handleLoginFailure = useCallback(function handleLoginFailure(error) {
    loginSource.current = "undetermined";

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
        loginSource.current = "wallet";
        mixpanel.track("Login - wallet button click");

        await loginWithWallet();
      } catch (error) {
        handleLoginFailure(error);
      }
    },
    [loginWithWallet, handleLoginFailure]
  );
  const handleSubmitEmail = useCallback(
    async function handleSubmitEmail(email: string) {
      try {
        loginSource.current = "magic";
        mixpanel.track("Login - email button click");

        const Web3Provider = (await import("@ethersproject/providers"))
          .Web3Provider;
        // @ts-ignore
        const web3 = new Web3Provider(magic.rpcProvider);
        setWeb3(web3);

        return await loginWithEmail(email);
      } catch (error) {
        handleLoginFailure(error);
      }
    },
    [loginWithEmail, handleLoginFailure, setWeb3]
  );
  const handleSubmitPhoneNumber = useCallback(
    async function handleSubmitPhoneNumber(phoneNumber: string) {
      try {
        loginSource.current = "magic";
        mixpanel.track("Login - phone number button click");

        const Web3Provider = (await import("@ethersproject/providers"))
          .Web3Provider;
        // @ts-ignore
        const web3 = new Web3Provider(magic.rpcProvider);
        setWeb3(web3);

        return await loginWithPhoneNumber(phoneNumber);
      } catch (error) {
        handleLoginFailure(error);
      }
    },
    [loginWithPhoneNumber, handleLoginFailure, setWeb3]
  );

  /**
   * We make sure to prevent/stop the authentication state,
   * when customer closes the login modal.
   */
  const handleBlur = useCallback(() => {
    // @ts-ignore
    loginSource.current = undefined;

    if (authenticationStatus === "AUTHENTICATING") {
      logout();
    }
  }, [logout, authenticationStatus]);
  //#endregion

  //#region effects
  useStableBlurEffect(handleBlur);
  useEffect(() => {
    const isLoggedInByMagic =
      loginSource.current === "magic" &&
      authenticationStatus === "AUTHENTICATED";
    const isLoggedInByWallet =
      loginSource.current === "wallet" && walletStatus === "EXPIRED_NONCE";

    if ((isLoggedInByWallet || isLoggedInByMagic) && onLogin) {
      onLogin();
    }
  }, [authenticationStatus, walletStatus, onLogin]);

  useEffect(() => {
    if (walletStatus === "ERRORED" && walletError) {
      handleLoginFailure(walletError);
    }
  }, [handleLoginFailure, walletStatus, walletError]);
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
