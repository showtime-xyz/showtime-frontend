import { useCallback, useEffect, useRef } from "react";

import { captureException } from "@sentry/nextjs";

import { useAuth } from "app/hooks/auth/use-auth";
import { useMagicLogin } from "app/hooks/auth/use-magic-login";
import { useWalletLogin } from "app/hooks/auth/use-wallet-login";
import { useStableBlurEffect } from "app/hooks/use-stable-blur-effect";
import { Analytics, EVENTS } from "app/lib/analytics";

type LoginSource = "undetermined" | "magic" | "wallet";

export type SubmitWalletParams = {};
export const useLogin = () => {
  const loginSource = useRef<LoginSource>("undetermined");

  //#region hooks
  const { authenticationStatus, logout, setAuthenticationStatus } = useAuth();
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
  const { loginWithEmail, loginWithOtp } = useMagicLogin();

  //#endregion

  //#region methods
  const handleLoginFailure = useCallback(
    function handleLoginFailure(error: any) {
      loginSource.current = "undetermined";
      setAuthenticationStatus("UNAUTHENTICATED");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleSubmitWallet = useCallback(
    async function handleSubmitWallet() {
      try {
        loginSource.current = "wallet";

        Analytics.track(EVENTS.BUTTON_CLICKED, {
          name: "Login with wallet",
        });

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
        Analytics.track(EVENTS.BUTTON_CLICKED, {
          name: "Login with email",
        });

        return await loginWithEmail(email);
      } catch (error) {
        handleLoginFailure(error);
      }
    },
    [loginWithEmail, handleLoginFailure]
  );

  const handleSubmitOtp = useCallback(
    async function handleSubmitOtp(code: string, phone: string) {
      try {
        Analytics.track(EVENTS.BUTTON_CLICKED, {
          name: "Login with phone number",
        });

        return await loginWithOtp(code, phone);
      } catch (error) {
        handleLoginFailure(error);
      }
    },
    [loginWithOtp, handleLoginFailure]
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
    showSignMessage,
    handleSubmitOtp,
    verifySignature,
  };
};
