import { useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";

import type { Web3Provider as EthersWeb3ProviderType } from "@ethersproject/providers";

import { Web3Context } from "app/context/web3-context";
import { useWalletMobileSDK } from "app/hooks/use-wallet-mobile-sdk";
import { useMagic, Relayer } from "app/lib/magic";
import { useWalletConnect } from "app/lib/walletconnect";

interface Web3ProviderProps {
  children: React.ReactNode;
  connected?: boolean;
  provider?: EthersWeb3ProviderType | undefined;
}

export function Web3Provider({
  children,
  connected,
  provider,
}: Web3ProviderProps) {
  const [web3, setWeb3] = useState<EthersWeb3ProviderType | undefined>(
    undefined
  );
  const [mountRelayerOnApp, setMountRelayerOnApp] = useState(true);
  const connector = useWalletConnect();
  const mobileSDK = useWalletMobileSDK();
  const { magic } = useMagic();
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
      (async function setWeb3Provider() {
        const WalletConnectProvider = (
          await import("@walletconnect/web3-provider")
        ).default;
        const walletConnectProvider = new WalletConnectProvider({
          connector,
          qrcode: false,
          infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
        });

        await walletConnectProvider.enable();

        const EthersWeb3Provider = (await import("@ethersproject/providers"))
          .Web3Provider;
        const ethersProvider = new EthersWeb3Provider(walletConnectProvider);
        setWeb3(ethersProvider);
      })();
    }
  }, [connector]);

  // (Native only) initializes wallet mobile sdk provider
  useEffect(() => {
    (async function setWeb3Provider() {
      if (Platform.OS !== "web" && mobileSDK.connected && mobileSDK.address) {
        const MobileSDKProvider = (
          await import(
            "@coinbase/wallet-mobile-sdk/build/WalletMobileSDKEVMProvider"
          )
        ).WalletMobileSDKEVMProvider;
        const mobileSDKProvider = new MobileSDKProvider({
          jsonRpcUrl: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
          address: mobileSDK.address,
        });

        const EthersWeb3Provider = (await import("@ethersproject/providers"))
          .Web3Provider;
        const ethersProvider = new EthersWeb3Provider(mobileSDKProvider as any);
        setWeb3(ethersProvider);
      }
    })();
  }, [mobileSDK.address, mobileSDK.connected]);

  // (Web/Native) initialises magic web3 provider
  useEffect(() => {
    magic?.user?.isLoggedIn().then(async (isLoggedIn) => {
      if (magic.rpcProvider && isLoggedIn) {
        const EthersWeb3Provider = (await import("@ethersproject/providers"))
          .Web3Provider;
        // @ts-ignore
        const ethersProvider = new EthersWeb3Provider(magic.rpcProvider);
        setWeb3(ethersProvider);
      }
    });
  }, [magic]);

  useEffect(() => {
    // @ts-ignore
    if (web3?.provider.isMagic)
      web3
        ?.getSigner()
        .getAddress()
        .then((address) => {
          setMagicWalletAddress(address);
        });
  }, [web3]);

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
