import { useCallback, useEffect } from "react";

import { mixpanel } from "app/lib/mixpanel";
import { personalSignMessage } from "app/lib/utilities";
// @ts-ignore
import getWeb3Modal from "app/lib/web3-modal";

import { useStableCallback } from "../use-stable-callback";
import { useWeb3 } from "../use-web3";
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
  const { web3, setWeb3 } = useWeb3();
  const { getNonce, rotateNonce } = useNonce();
  const { setAuthenticationStatus, login: _login, logout } = useAuth();
  //#endregion

  //#region methods
  const connectToWallet = useCallback(
    async function connectToWallet() {
      dispatch("CONNECT_TO_WALLET_REQUEST");
      let walletName, walletAddress;

      try {
        const Web3Provider = (await import("@ethersproject/providers"))
          .Web3Provider;
        const web3Modal = await getWeb3Modal();
        const _web3 = new Web3Provider(await web3Modal.connect());

        setWeb3(_web3);
        //TODO: couldn't find a way to get wallet name
        walletName = "wallet";
        walletAddress = await _web3.getSigner().getAddress();

        dispatch("CONNECT_TO_WALLET_SUCCESS", {
          name: walletName,
          address: walletAddress,
        });
      } catch (error) {
        dispatch("ERROR", { error });
      }
    },
    [dispatch]
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
        dispatch("ERROR", { error });
      }
    },
    [address, dispatch]
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
    [address, dispatch]
  );
  const signPersonalMessage = useCallback(
    async function signPersonalMessage() {
      dispatch("SIGN_PERSONAL_MESSAGE_REQUEST");
      try {
        const _signature = await personalSignMessage(
          web3,
          process.env.NEXT_PUBLIC_SIGNING_MESSAGE + " " + nonce
        );
        dispatch("SIGN_PERSONAL_MESSAGE_SUCCESS", { signature: _signature });
      } catch (error) {
        dispatch("ERROR", { error });
      }
    },
    [web3, nonce, address, dispatch]
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
      mixpanel.track(`Login success - wallet`);
    } else if (status === "ERRORED") {
      logout();
    }
  });
  //#endregion

  //#region effects
  useEffect(() => {
    continueLoginIn();
  }, [continueLoginIn, status]);
  //#endregion
  return { loginWithWallet, status, name, error };
}
