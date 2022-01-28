import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { captureException } from "@sentry/nextjs";
import { useSWRConfig } from "swr";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { magic } from "app/lib/magic";
import { axios } from "app/lib/axios";
// @ts-ignore
import getWeb3Modal from "app/lib/web3-modal";
import { AppContext } from "app/context/app-context";
import { convertUtf8ToHex } from "@walletconnect/utils";
import { personalSignMessage } from "app/lib/utilities";
import { setRefreshToken } from "app/lib/refresh-token";
import { accessTokenManager } from "app/lib/access-token-manager";
import { setLogin } from "app/lib/login";
import { mixpanel } from "app/lib/mixpanel";
import { useMagicLogin } from "app/hooks/auth/use-magic-login";
import { useWalletLogin } from "app/hooks/auth/use-wallet-login";
import { useAuth } from "app/hooks/auth/use-auth";

export const useLogin = (onLogin?: () => void) => {
  //#region state
  // const [signaturePending, setSignaturePending] = useState(false);
  // // const [walletName, setWalletName] = useState("");
  // const loginRequested = useRef(false);

  const { authenticationStatus } = useAuth();

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
      mutate(null);
      mixpanel.track(`Login success - ${source}`);

      if (onLogin) {
        onLogin();
      }
    },
    [mutate, onLogin]
  );
  const handleLoginFailure = useCallback(function handleLoginFailure(error) {
    if (process.env.NODE_ENV === "development") {
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
    [loginWithEmail, handleLoginFailure, handleLoginSuccess]
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
    [handleLoginSuccess, handleLoginFailure]
  );
  //#endregion

  //#region effects
  // useEffect(() => {
  //   if (connector.connected && loginRequested.current) {
  //     handleSubmitWallet();
  //   }
  // }, [connector?.connected]);
  //#endregion
  return {
    loading: authenticationStatus === "AUTHENTICATING",
    walletName,
    walletStatus,

    handleSubmitWallet,
    handleSubmitEmail,
    handleSubmitPhoneNumber,
  };
};
