import { useCallback, useEffect, useRef } from "react";
import { Platform } from "react-native";

import { captureException } from "@sentry/nextjs";

import { useAuth } from "app/hooks/auth/use-auth";
import { useMagicLogin } from "app/hooks/auth/use-magic-login";
import { useWalletLogin } from "app/hooks/auth/use-wallet-login";
import { useStableBlurEffect } from "app/hooks/use-stable-blur-effect";
import { useRudder } from "app/lib/rudderstack";

type LoginSource = "undetermined" | "magic" | "wallet";

export type SubmitWalletParams = {
  onOpenConnectModal?: () => void;
};
export const useLogin = (onLogin?: () => void) => {
  const loginSource = useRef<LoginSource>("undetermined");
  const { rudder } = useRudder();

  //#region hooks
  const { authenticationStatus, logout } = useAuth();
  const {
    loginWithWallet,
    name: walletName,
    status: walletStatus,
    error: walletError,
    //@ts-ignore web only
    showSignMessage,
    //@ts-ignore web only
    verifySignature,
  } = useWalletLogin();
  const { loginWithEmail, loginWithPhoneNumber } = useMagicLogin();
  const isWeb = Platform.OS === "web";
  //#endregion

  //#region methods
  const handleLoginFailure = useCallback(function handleLoginFailure(
    error: any
  ) {
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
  },
  []);

  const handleSubmitWallet = useCallback(
    async function handleSubmitWallet(params?: SubmitWalletParams) {
      try {
        loginSource.current = "wallet";

        rudder?.track("Button Clicked", {
          name: "Login with wallet",
        });

        if (isWeb) {
          console.log(loginSource.current);

          params?.onOpenConnectModal?.();
        } else {
          await loginWithWallet();
        }
      } catch (error) {
        handleLoginFailure(error);
      }
    },
    [rudder, isWeb, loginWithWallet, handleLoginFailure]
  );
  const handleSubmitEmail = useCallback(
    async function handleSubmitEmail(email: string) {
      try {
        loginSource.current = "magic";
        rudder?.track("Button Clicked", {
          name: "Login with email",
        });

        return await loginWithEmail(email);
      } catch (error) {
        handleLoginFailure(error);
      }
    },
    [loginWithEmail, handleLoginFailure, rudder]
  );
  const handleSubmitPhoneNumber = useCallback(
    async function handleSubmitPhoneNumber(phoneNumber: string) {
      try {
        loginSource.current = "magic";
        rudder?.track("Button Clicked", {
          name: "Login with phone number",
        });

        return await loginWithPhoneNumber(phoneNumber);
      } catch (error) {
        handleLoginFailure(error);
      }
    },
    [loginWithPhoneNumber, handleLoginFailure, rudder]
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
    showSignMessage,
    verifySignature,
  };
};
