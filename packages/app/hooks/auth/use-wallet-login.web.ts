import { useState, useRef } from "react";

import { useWallet } from "app/hooks/use-wallet";
import { Logger } from "app/lib/logger";
import { isMobileWeb } from "app/utilities";

import { useAuth } from "./use-auth";
import { useNonce } from "./use-nonce";
import { useWalletLoginState } from "./use-wallet-login-state";

const LOGIN_WALLET_ENDPOINT = "login_wallet";

export function useWalletLogin() {
  //#region states
  const { status, name, error, dispatch } = useWalletLoginState();
  //#endregion

  //#region hooks
  const { getNonce, rotateNonce } = useNonce();
  const { login: _login, logout, setAuthenticationStatus } = useAuth();
  const [showSignMessage, setShowSignMessage] = useState(false);
  const walletConnector = useWallet();
  const cachedNonce = useRef<string | null>();

  //#endregion

  const loginWithWallet = async () => {
    let address, walletName;

    dispatch("CONNECT_TO_WALLET_REQUEST");

    const res = await walletConnector.connect();

    if (res?.address) {
      address = res.address;
    }
    if (res?.walletName) walletName = res.walletName;

    try {
      if (address) {
        dispatch("CONNECT_TO_WALLET_SUCCESS", {
          name: walletName,
          address: address,
        });

        // on mobile web we show a prompt to sign a message
        if (isMobileWeb()) {
          getNonce(address).then((nonce) => {
            cachedNonce.current = nonce;
          });
          setShowSignMessage(true);
        } else {
          await verifySignature(address);
        }
      }
    } catch (error) {
      logout();
      Logger.error("login with wallet error", error);
      dispatch("ERROR", { error });
    }
  };

  const verifySignature = async (addr?: string) => {
    setAuthenticationStatus("AUTHENTICATING");
    dispatch("FETCH_NONCE_REQUEST");
    const address = addr ?? walletConnector.address;

    if (address) {
      let nonce;
      if (cachedNonce.current) {
        nonce = cachedNonce.current;
        cachedNonce.current = null;
      } else {
        nonce = await getNonce(address);
      }

      dispatch("FETCH_NONCE_SUCCESS", {
        nonce,
      });

      if (nonce) {
        dispatch("SIGN_PERSONAL_MESSAGE_REQUEST");
        const message = process.env.NEXT_PUBLIC_SIGNING_MESSAGE + " " + nonce;
        const signature = await walletConnector.signMessageAsync({
          message,
        });

        if (signature) {
          dispatch("SIGN_PERSONAL_MESSAGE_SUCCESS", {
            signature,
          });
          dispatch("LOG_IN_REQUEST");
          await _login(LOGIN_WALLET_ENDPOINT, {
            signature: signature,
            address,
          });
          dispatch("LOG_IN_SUCCESS");

          dispatch("EXPIRE_NONCE_REQUEST");
          await rotateNonce(address);
          dispatch("EXPIRE_NONCE_SUCCESS");
        }
      }
    }
  };

  //#endregion

  return {
    status,
    name,
    error,
    loginWithWallet,
    showSignMessage,
    verifySignature,
  };
}
