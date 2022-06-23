import { useMemo, useEffect } from "react";

import { useAccessToken } from "../../lib/access-token";
import { useUser } from "../use-user";
import { useWeb3 } from "../use-web3";
import { useAuth } from "./use-auth";
import { useNonce } from "./use-nonce";
import { useWallet } from "./use-wallet";
import { useWalletLoginState } from "./use-wallet-login-state";

const LOGIN_WALLET_ENDPOINT = "login_wallet";

export function useWalletLogin() {
  //#region states
  const { status, name, error, dispatch } = useWalletLoginState();
  //#endregion

  //#region hooks
  const { setWeb3 } = useWeb3();
  const { getNonce, rotateNonce } = useNonce();
  const { login: _login } = useAuth();
  const {
    address: walletAddress,
    connected,
    loggedIn,
    networkChanged,
    signMessage,
    signed,
    provider,
    signature,
  } = useWallet();
  const { user } = useUser();

  const getAddress = () => {
    return walletAddress || user?.data.profile.wallet_addresses[0];
  };

  const { isAuthenticated } = useUser();
  const accessToken = useAccessToken();
  const authenticated = useMemo(() => !!isAuthenticated, [isAuthenticated]);
  //#endregion

  //#region methods
  const fetchNonce = async (_address: string) => {
    try {
      const response = await getNonce(_address);

      return response;
    } catch (error) {
      dispatch("ERROR", { error });
      return null;
    }
  };
  const expireNonce = async (_address: string) => {
    try {
      await rotateNonce(_address);
      dispatch("EXPIRE_NONCE_SUCCESS");
    } catch (error) {
      dispatch("ERROR", { error });
    }
  };
  const handleLogin = async () => {
    const address = getAddress();
    const nonce = await fetchNonce(address as string);
    if (nonce) {
      signMessage({
        message: process.env.NEXT_PUBLIC_SIGNING_MESSAGE + " " + nonce,
      });
    } else {
      dispatch("ERROR", { error: "Nonce is null" });
    }
  };
  const handleSignature = async () => {
    try {
      const address = getAddress();
      if (address && signature) {
        await _login(LOGIN_WALLET_ENDPOINT, {
          signature: signature,
          address: address,
        });
        expireNonce(address);
      } else {
        dispatch("ERROR", {
          error: "Couldn't find address or signature data!",
        });
      }
    } catch (error) {
      dispatch("ERROR", { error });
    }
  };
  //#endregion

  const handleSetWeb3 = () => {
    setWeb3(provider);
  };

  useEffect(() => {
    if (
      (connected && authenticated) ||
      (connected && authenticated && !networkChanged)
    ) {
      handleSetWeb3();
    } else if (connected && !authenticated && loggedIn) {
      handleLogin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn, accessToken, connected, authenticated, networkChanged]);

  useEffect(() => {
    if (signed) {
      handleSignature();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signed]);

  return { status, name, error, loginWithWallet: handleLogin };
}
