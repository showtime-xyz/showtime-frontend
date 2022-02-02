import { useCallback, useRef, useState } from "react";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { personalSignMessage } from "app/lib/utilities";
import { axios } from "app/lib/axios";
// @ts-ignore
import getWeb3Modal from "app/lib/web3-modal";
import { useAuth } from "./use-auth";
import type { WalletConnectionStatus } from "../../types";

const LOGIN_WALLET_ENDPOINT = "login_wallet";

export function useWalletLogin() {
  //#region states
  const [status, setStatus] = useState<WalletConnectionStatus>("IDLE");
  const walletName = useRef("");
  //#endregion

  //#region hooks
  const walletConnector = useWalletConnect();
  const { setAuthenticationStatus, login, logout } = useAuth();
  //#endregion

  //#region methods
  const loginWithWallet = useCallback(
    async function loginWithWallet() {
      setAuthenticationStatus("AUTHENTICATING");
      try {
        let address: string;
        let signature: string;

        const Web3Provider = (await import("@ethersproject/providers"))
          .Web3Provider;
        const web3Modal = await getWeb3Modal();
        const web3 = new Web3Provider(await web3Modal.connect());

        address = await web3.getSigner().getAddress();

        setStatus("FETCHING_NONCE");
        const getNonceResponse = await axios({
          url: `/v1/getnonce?address=${address}`,
          method: "GET",
        });

        walletName.current = web3Modal.selectedWallet.name;

        setStatus("CREATING_SIGNATURE");
        signature = await personalSignMessage(
          web3,
          process.env.NEXT_PUBLIC_SIGNING_MESSAGE + " " + getNonceResponse?.data
        );

        await login(LOGIN_WALLET_ENDPOINT, { signature, address });

        console.log("loginWithWallet", "logged in");

        // Expire the nonce after successful login
        await axios({
          url: `/v1/rotatenonce?address=${address}`,
          method: "POST",
        });

        console.log("loginWithWallet", "rotatenonce");
        setStatus("SUCCESS");
      } catch (error) {
        console.log("loginWithWallet", error);
        setStatus("IDLE");
        logout();
        throw error;
      }
    },
    [walletConnector, login, logout]
  );
  //#endregion

  return { loginWithWallet, status, walletName: walletName.current };
}
