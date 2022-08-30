import { useCallback, useEffect } from "react";

import { useWallet } from "app/hooks/use-wallet";

import { useStableCallback } from "../use-stable-callback";
import { useAuth } from "./use-auth";
import { useNonce } from "./use-nonce";
import { useWalletLoginState } from "./use-wallet-login-state";

const LOGIN_WALLET_ENDPOINT = "login_wallet";

export function useWalletLogin() {
  //#region hooks
  const walletConnector = useWallet();
  const { getNonce, rotateNonce } = useNonce();
  const { setAuthenticationStatus, login: _login, logout } = useAuth();
  const { status, name, address, signature, nonce, error, dispatch } =
    useWalletLoginState();
  //#endregion

  //#region methods
  const connectToWallet = useCallback(
    async function connectToWallet() {
      dispatch("CONNECT_TO_WALLET_REQUEST");
      if (!walletConnector.connected) {
        try {
          await walletConnector.connect();
        } catch (error) {
          console.log("connectToWallet error", error);
          dispatch("ERROR", { error });
          return;
        }
      }
    },
    [dispatch, walletConnector]
  );
  const fetchNonce = useCallback(
    async function fetchNonce() {
      dispatch("FETCH_NONCE_REQUEST");
      try {
        const response = await getNonce(address!);
        dispatch("FETCH_NONCE_SUCCESS", {
          nonce: response,
        });
      } catch (error) {
        console.log("fetchNonce error", error);
        dispatch("ERROR", { error });
      }
    },
    [address, getNonce, dispatch]
  );
  const expireNonce = useCallback(
    async function expireNonce() {
      dispatch("EXPIRE_NONCE_REQUEST");
      try {
        await rotateNonce(address!);
        dispatch("EXPIRE_NONCE_SUCCESS");
      } catch (error) {
        console.log("expirenonce error", error);
        dispatch("ERROR", { error });
      }
    },
    [address, rotateNonce, dispatch]
  );
  const signPersonalMessage = useCallback(
    async function signPersonalMessage() {
      dispatch("SIGN_PERSONAL_MESSAGE_REQUEST");
      try {
        const message = process.env.NEXT_PUBLIC_SIGNING_MESSAGE + " " + nonce;

        const _signature = await walletConnector.signMessageAsync({ message });
        dispatch("SIGN_PERSONAL_MESSAGE_SUCCESS", { signature: _signature });
      } catch (error) {
        dispatch("ERROR", { error });
      }
    },
    [nonce, dispatch, walletConnector]
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
        console.log("login wallet error", error);
        dispatch("ERROR", { error });
      }
    },
    [dispatch, address, signature, _login]
  );
  const loginWithWallet = useCallback(
    async function loginWithWallet() {
      setAuthenticationStatus("AUTHENTICATING");
      connectToWallet();
    },
    [connectToWallet, setAuthenticationStatus]
  );
  const continueLoginIn = useStableCallback(() => {
    if (status === "CONNECTED_TO_WALLET" && (!address || !name)) {
      connectToWallet();
    } else if (status === "CONNECTED_TO_WALLET" && address && name) {
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
      logout();
    }
  });
  //#endregion

  //#region effects
  useEffect(() => {
    continueLoginIn();
  }, [continueLoginIn, status]);
  useEffect(() => {
    // Signing requests post await connector.connect doesn't work everytime and throws session disconnected error
    // so we only consider session is established when connector.connected is true
    if (status === "CONNECTING_TO_WALLET" && walletConnector.connected) {
      const walletName = walletConnector.name;
      const walletAddress = walletConnector.address;
      dispatch("CONNECT_TO_WALLET_SUCCESS", {
        name: walletName,
        address: walletAddress,
      });
    }
  }, [status, dispatch, walletConnector]);

  if (__DEV__) {
    console.log(
      "wallet connection status ",
      status,
      error,
      walletConnector.connected
    );
  }

  //#endregion
  return { loginWithWallet, status, name, error };
}
