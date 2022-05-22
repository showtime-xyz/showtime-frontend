import { useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";

import { Web3Provider as EthersWeb3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";

import { Web3Context } from "app/context/web3-context";
import { magic, Relayer } from "app/lib/magic";
import { useWalletConnect } from "app/lib/walletconnect";
import getWeb3Modal from "app/lib/web3-modal";

interface Web3ProviderProps {
  children: React.ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  //#region state
  const [web3, setWeb3] = useState<EthersWeb3Provider | undefined>(undefined);
  const [mountRelayerOnApp, setMountRelayerOnApp] = useState(true);
  const connector = useWalletConnect();
  //#endregion

  //#region variables
  const Web3ContextValue = useMemo(
    () => ({
      web3,
      setWeb3,
      //@ts-ignore
      isMagic: web3?.provider.isMagic,
      setMountRelayerOnApp,
    }),
    [web3]
  );

  useEffect(() => {
    if (Platform.OS !== "web") {
      if (connector.connected) {
        const walletConnectProvider = new WalletConnectProvider({
          connector,
          qrcode: false,
          infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
        });

        (async function setWeb3Provider() {
          await walletConnectProvider.enable();
          const ethersProvider = new EthersWeb3Provider(walletConnectProvider);
          setWeb3(ethersProvider);
        })();
      }
    }
  }, [connector]);

  useEffect(() => {
    magic?.user?.isLoggedIn().then((isLoggedIn) => {
      if (magic.rpcProvider && isLoggedIn) {
        //@ts-ignore
        const provider = new EthersWeb3Provider(magic.rpcProvider);
        setWeb3(provider);
      }
    });

    if (Platform.OS === "web") {
      (async () => {
        const web3Modal = await getWeb3Modal();

        if (web3Modal.cachedProvider) {
          const provider = await web3Modal.connect();
          const ethersProvider = new EthersWeb3Provider(provider);
          setWeb3(ethersProvider);
        }
      })();
    }
  }, []);

  //#endregion
  return (
    <Web3Context.Provider value={Web3ContextValue}>
      {children}
      {/* TODO: Open Relayer on FullWindow, need change in relayer source */}
      {mountRelayerOnApp ? <Relayer /> : null}
    </Web3Context.Provider>
  );
}
