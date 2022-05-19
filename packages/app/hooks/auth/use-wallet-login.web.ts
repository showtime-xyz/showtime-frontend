import { useCallback, useEffect } from "react";

import { useAccount, useSignMessage } from "wagmi";

import { useStableCallback } from "../use-stable-callback";
import { useAuth } from "./use-auth";
import { useNonce } from "./use-nonce";
import { useWalletLoginState } from "./use-wallet-login-state";

const LOGIN_WALLET_ENDPOINT = "login_wallet";

export function useWalletLogin() {
  //#region states
  const { status, name, address, signature, nonce, error, dispatch } =
    useWalletLoginState();
  //#endregion

  //#region hooks
  const { data: wagmiData } = useAccount();
  const { data: wagmiSignData, signMessage } = useSignMessage();
  const { getNonce, rotateNonce } = useNonce();
  const { login: _login, logout } = useAuth();
  //#endregion

  useEffect(() => {
    if (wagmiData?.address) {
      dispatch("CONNECT_TO_WALLET_REQUEST");

      dispatch("CONNECT_TO_WALLET_SUCCESS", {
        name: "wallet",
        address: wagmiData.address,
      });
    }
  }, [wagmiData]);

  useEffect(() => {
    if (wagmiSignData) {
      dispatch("SIGN_PERSONAL_MESSAGE_SUCCESS", {
        signature: wagmiSignData,
      });
    }
  }, [wagmiSignData]);

  //#region methods
  const fetchNonce = useCallback(
    async function fetchNonce() {
      dispatch("FETCH_NONCE_REQUEST");
      try {
        const response = await getNonce(address!);
        dispatch("FETCH_NONCE_SUCCESS", {
          nonce: response,
        });
      } catch (error) {
        dispatch("ERROR", { error });
      }
    },
    [address, dispatch, getNonce]
  );
  const expireNonce = useCallback(
    async function expireNonce() {
      dispatch("EXPIRE_NONCE_REQUEST");
      try {
        await rotateNonce(address!);
        dispatch("EXPIRE_NONCE_SUCCESS");
      } catch (error) {
        dispatch("ERROR", { error });
      }
    },
    [address, dispatch, rotateNonce]
  );
  const signPersonalMessage = useCallback(
    async function signPersonalMessage() {
      dispatch("SIGN_PERSONAL_MESSAGE_REQUEST");

      try {
        signMessage({
          message: process.env.NEXT_PUBLIC_SIGNING_MESSAGE + " " + nonce,
        });
      } catch (error) {
        dispatch("ERROR", { error });
      }
    },
    [nonce, dispatch]
  );
  const login = useCallback(
    async function login() {
      dispatch("LOG_IN_REQUEST");
      try {
        await _login(LOGIN_WALLET_ENDPOINT, {
          signature: signature,
          address: address,
        });

        dispatch("LOG_IN_SUCCESS");
      } catch (error) {
        dispatch("ERROR", { error });
      }
    },
    [dispatch, signature, _login]
  );
  const continueLoginIn = useStableCallback(() => {
    if (status === "CONNECTED_TO_WALLET" && address && name) {
      fetchNonce();
    } else if (status === "FETCHED_NONCE" && nonce) {
      signPersonalMessage();
    } else if (status === "SIGNED_PERSONAL_MESSAGE" && signature) {
      login();
    } else if (status === "LOGGED_IN") {
      expireNonce();
    } else if (status === "EXPIRED_NONCE") {
      // do nothing
    } else if (status === "ERRORED") {
      console.error("Error logging in with wallet", error);
      logout();
    }
  });
  //#endregion

  //#region effects
  useEffect(() => {
    continueLoginIn();
  }, [continueLoginIn, status]);
  //#endregion

  return { status, name, error };
}
