import { useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";

import { Web3Provider as EthersWeb3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";

import { Web3Context } from "app/context/web3-context";
import { magic, Relayer } from "app/lib/magic";
import { useWalletConnect } from "app/lib/walletconnect";

interface Web3ProviderProps {
  children: React.ReactNode;
  connected?: boolean;
  provider?: EthersWeb3Provider | undefined;
}

export function Web3Provider({
  children,
  connected,
  provider,
}: Web3ProviderProps) {
  const [web3, setWeb3] = useState<EthersWeb3Provider | undefined>(undefined);
  const [mountRelayerOnApp, setMountRelayerOnApp] = useState(true);
  const connector = useWalletConnect();
  const [magicWalletAddress, setMagicWalletAddress] = useState<
    string | undefined
  >(undefined);

  const Web3ContextValue = useMemo(
    () => ({
      web3,
      setWeb3,
      //@ts-ignore
      isMagic: web3?.provider.isMagic,
      setMountRelayerOnApp,
      magicWalletAddress,
    }),
    [web3, magicWalletAddress]
  );

  // (Native only) initialises wallet connect native web3 provider
  useEffect(() => {
    if (Platform.OS !== "web" && connector.connected) {
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
  }, [connector]);

  // (Web/Native) initialises magic web3 provider
  useEffect(() => {
    magic?.user?.isLoggedIn().then((isLoggedIn) => {
      if (magic.rpcProvider && isLoggedIn) {
        //@ts-ignore
        const provider = new EthersWeb3Provider(magic.rpcProvider);
        provider
          .getSigner()
          .getAddress()
          .then((address) => {
            setMagicWalletAddress(address);
          });
        setWeb3(provider);
      }
    });
  }, []);

  // (Web only) initialises web3 provider from wagmi
  useEffect(() => {
    if (Platform.OS === "web" && connected) {
      setWeb3(provider);
    }
  }, [connected, provider]);

  return (
    <Web3Context.Provider value={Web3ContextValue}>
      {children}
      {/* TODO: Open Relayer on FullWindow, need change in relayer source */}
      {mountRelayerOnApp ? <Relayer /> : null}
    </Web3Context.Provider>
  );
}
