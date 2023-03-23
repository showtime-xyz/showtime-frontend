import { useMemo, useEffect, useState } from "react";

import { useSigner } from "wagmi";

import { useWallet } from "app/hooks/use-wallet";
import { useAccessToken } from "app/lib/access-token";
import { Logger } from "app/lib/logger";
import { isMobileWeb } from "app/utilities";

import { useUser } from "../use-user";
import { useWeb3 } from "../use-web3";
import { useAuth } from "./use-auth";
import { useNonce } from "./use-nonce";
import { useWalletLoginState } from "./use-wallet-login-state";

const LOGIN_WALLET_ENDPOINT = "login_wallet";

export function useWalletLogin() {
  //#region states
  const { status, name, error, dispatch } = useWalletLoginState();
  //#endregion

  //#region hooks
  const { setWeb3 } = useWeb3();
  const { getNonce, rotateNonce } = useNonce();
  const { login: _login, logout, setAuthenticationStatus } = useAuth();
  const [showSignMessage, setShowSignMessage] = useState(false);
  const walletConnector = useWallet();

  const wagmiSigner = useSigner();

  const { isAuthenticated } = useUser();
  const accessToken = useAccessToken();
  const authenticated = useMemo(() => !!isAuthenticated, [isAuthenticated]);
  //#endregion

  const loginWithWallet = async () => {
    let address, walletName;

    if (!walletConnector.connected) {
      dispatch("CONNECT_TO_WALLET_REQUEST");
      const res = await walletConnector.connect();
      if (res?.address) address = res.address;
      if (res?.walletName) walletName = res.walletName;
    } else {
      address = walletConnector.address;
      walletName = walletConnector.name;
    }
    try {
      if (address) {
        setAuthenticationStatus("AUTHENTICATING");
        dispatch("CONNECT_TO_WALLET_SUCCESS", {
          name: walletName,
          address: address,
        });

        // on mobile web we show a prompt to sign a message
        if (!isMobileWeb()) {
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
    dispatch("FETCH_NONCE_REQUEST");
    const address = addr ?? walletConnector.address;
    if (address) {
      const nonce = await getNonce(address);
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

  // TODO: below thing doesn't work. Keeping it for now
  const handleSetWeb3 = async () => {
    if (wagmiSigner.data?.provider) {
      //@ts-ignore
      setWeb3(wagmiSigner.data.provider);
    }
  };

  useEffect(() => {
    if (
      (walletConnector.connected && authenticated) ||
      (walletConnector.connected &&
        authenticated &&
        !walletConnector.networkChanged)
    ) {
      handleSetWeb3();
    } else if (walletConnector.connected && !authenticated) {
      // TODO: refactor after getting a better alternative
      // https://github.com/rainbow-me/rainbowkit/discussions/536
      if (isMobileWeb()) {
        setShowSignMessage(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    accessToken,
    walletConnector.connected,
    authenticated,
    walletConnector.networkChanged,
  ]);

  return {
    status,
    name,
    error,
    loginWithWallet,
    showSignMessage,
    verifySignature,
  };
}
