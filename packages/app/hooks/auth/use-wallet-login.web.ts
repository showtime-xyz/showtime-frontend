import { useMemo, useEffect, useState } from "react";

import { useSigner } from "wagmi";

import { useWallet } from "app/hooks/use-wallet";
import { useAccessToken } from "app/lib/access-token";
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
  const { login: _login } = useAuth();
  const [showSignMessage, setShowSignMessage] = useState(false);
  const {
    address: walletAddress,
    connected,
    networkChanged,
    signMessageAsync,
  } = useWallet();
  const wagmiSigner = useSigner();
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
      const signature = await signMessageAsync({
        message: process.env.NEXT_PUBLIC_SIGNING_MESSAGE + " " + nonce,
      });
      handleSignature(signature);
    } else {
      dispatch("ERROR", { error: "Nonce is null" });
    }
  };
  const handleSignature = async (signature?: string) => {
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

  // TODO: below thing doesn't work. Keeping it for now
  const handleSetWeb3 = async () => {
    if (wagmiSigner.data?.provider) {
      //@ts-ignore
      setWeb3(wagmiSigner.data.provider);
    }
  };

  useEffect(() => {
    if (
      (connected && authenticated) ||
      (connected && authenticated && !networkChanged)
    ) {
      handleSetWeb3();
    } else if (connected && !authenticated) {
      // TODO: refactor after getting a better alternative
      // https://github.com/rainbow-me/rainbowkit/discussions/536
      if (isMobileWeb()) {
        setShowSignMessage(true);
      } else {
        handleLogin();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, connected, authenticated, networkChanged]);

  return {
    status,
    name,
    error,
    loginWithWallet: handleLogin,
    showSignMessage,
    verifySignature: handleLogin,
  };
}
