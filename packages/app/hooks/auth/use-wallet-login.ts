import { useCallback, useEffect } from "react";
import { mixpanel } from "app/lib/mixpanel";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { convertUtf8ToHex } from "@walletconnect/utils";
import { useAuth } from "./use-auth";
import { useWalletLoginState } from "./use-wallet-login-state";
import { useNonce } from "./use-nonce";
import { useStableCallback } from "../use-stable-callback";

const LOGIN_WALLET_ENDPOINT = "login_wallet";

export function useWalletLogin() {
  //#region hooks
  const walletConnector = useWalletConnect();
  const { getNonce, rotateNonce } = useNonce();
  const { setAuthenticationStatus, login: _login, logout } = useAuth();
  const { status, name, address, signature, nonce, error, dispatch } =
    useWalletLoginState();
  //#endregion

  //#region methods
  const connectToWallet = useCallback(
    async function connectToWallet() {
      dispatch("CONNECT_TO_WALLET_REQUEST");
      let walletName, walletAddress;
      if (!walletConnector.connected) {
        try {
          const wallet = await walletConnector.connect();
          // @ts-ignore
          walletName = wallet.peerMeta?.name;
          walletAddress = wallet.accounts[0];
        } catch (error) {
          dispatch("ERROR", { error });
          return;
        }
      } else {
        walletName = walletConnector.peerMeta?.name;
        walletAddress = walletConnector.session.accounts[0];
      }
      dispatch("CONNECT_TO_WALLET_SUCCESS", {
        name: walletName,
        address: walletAddress,
      });
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
        dispatch("ERROR", { error });
      }
    },
    [address, rotateNonce, dispatch]
  );
  const signPersonalMessage = useCallback(
    async function signPersonalMessage() {
      dispatch("SIGN_PERSONAL_MESSAGE_REQUEST");
      try {
        const messageParams = [
          convertUtf8ToHex(
            process.env.NEXT_PUBLIC_SIGNING_MESSAGE + " " + nonce
          ),
          address!.toLowerCase(),
        ];
        const _signature = await walletConnector.signPersonalMessage(
          messageParams
        );
        dispatch("SIGN_PERSONAL_MESSAGE_SUCCESS", { signature: _signature });
      } catch (error) {
        dispatch("ERROR", { error });
      }
    },
    [nonce, address, dispatch, walletConnector]
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
      // We kill the session if connected so select wallet popup appears again
      if (walletConnector.connected) {
        await walletConnector.killSession();
      }
      connectToWallet();
    },
    [connectToWallet, setAuthenticationStatus, walletConnector]
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
