import { useCallback, useRef, useState } from "react";
import { Platform } from "react-native";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { convertUtf8ToHex } from "@walletconnect/utils";
import { personalSignMessage } from "app/lib/utilities";
import { axios } from "app/lib/axios";
// @ts-ignore
import getWeb3Modal from "app/lib/web3-modal";
import { useAuth } from "./use-auth";
import { useFetchOnAppForeground } from "../use-fetch-on-app-foreground";

const LOGIN_WALLET_ENDPOINT = "login_wallet";

type WalletConnectionStatus =
  | "IDLE"
  | "FETCHING_SIGNATURE"
  | "FETCHING_NONCE"
  | "DONE";

export function useWalletLogin() {
  //#region states
  const [status, setStatus] = useState<WalletConnectionStatus>("IDLE");
  const walletName = useRef("");
  //#endregion

  //#region hooks
  const walletConnector = useWalletConnect();
  const { setAuthenticationStatus, login, logout } = useAuth();
  const fetchOnForeground = useFetchOnAppForeground();
  //#endregion

  //#region methods
  const loginWithWallet = useCallback(
    async function loginWithWallet() {
      setAuthenticationStatus("AUTHENTICATING");
      try {
        let address: string;
        let signature: string;

        if (Platform.OS === "web") {
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

          setStatus("FETCHING_SIGNATURE");
          signature = await personalSignMessage(
            web3,
            process.env.NEXT_PUBLIC_SIGNING_MESSAGE +
              " " +
              getNonceResponse?.data
          );
        } else {
          if (!walletConnector.connected) {
            await walletConnector.connect();
          }

          address = walletConnector.session.accounts[0];

          setStatus("FETCHING_NONCE");
          const getNonceResponse = await fetchOnForeground({
            url: `/v1/getnonce?address=${address}`,
            method: "GET",
          });

          walletName.current = walletConnector.peerMeta?.name ?? "";

          const messageParams = [
            convertUtf8ToHex(
              process.env.NEXT_PUBLIC_SIGNING_MESSAGE +
                " " +
                getNonceResponse?.data
            ),
            address.toLowerCase(),
          ];
          setStatus("FETCHING_SIGNATURE");
          signature = await walletConnector.signPersonalMessage(messageParams);
        }

        await login(LOGIN_WALLET_ENDPOINT, { signature, address });

        // Expire the nonce after successful login
        await axios({
          url: `/v1/rotatenonce?address=${address}`,
          method: "POST",
        });

        setStatus("DONE");
      } catch (error) {
        setStatus("IDLE");
        logout();
        throw error;
      }
    },
    [walletConnector, fetchOnForeground, login, logout]
  );
  //#endregion

  return { loginWithWallet, status, walletName: walletName.current };
}
