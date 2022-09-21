import { useWallet } from "app/hooks/use-wallet";
import { Logger } from "app/lib/logger";

import { useAuth } from "./use-auth";
import { useNonce } from "./use-nonce";
import { useWalletLoginState } from "./use-wallet-login-state";

const LOGIN_WALLET_ENDPOINT = "login_wallet";

export function useWalletLogin() {
  //#region hooks
  const walletConnector = useWallet();
  const { getNonce, rotateNonce } = useNonce();
  const { setAuthenticationStatus, login: _login, logout } = useAuth();
  const { name, status, error, dispatch } = useWalletLoginState();
  //#endregion

  const loginWithWallet = async () => {
    setAuthenticationStatus("AUTHENTICATING");
    dispatch("CONNECT_TO_WALLET_REQUEST");
    if (!walletConnector.connected) {
      try {
        const res = await walletConnector.connect();
        if (res?.address) {
          dispatch("CONNECT_TO_WALLET_SUCCESS", {
            name: res.walletName,
            address: res.address,
          });
          dispatch("FETCH_NONCE_REQUEST");
          const nonce = await getNonce(res.address);
          dispatch("FETCH_NONCE_SUCCESS", {
            nonce,
          });
          if (nonce) {
            dispatch("SIGN_PERSONAL_MESSAGE_REQUEST");
            const message =
              process.env.NEXT_PUBLIC_SIGNING_MESSAGE + " " + nonce;
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
                address: res.address,
              });
              dispatch("LOG_IN_SUCCESS");

              dispatch("EXPIRE_NONCE_REQUEST");
              await rotateNonce(res.address);
              dispatch("EXPIRE_NONCE_SUCCESS");
            }
          }
        }
      } catch (error) {
        logout();
        Logger.error("login with wallet error", error);
        dispatch("ERROR", { error });
      }
    }
  };

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
