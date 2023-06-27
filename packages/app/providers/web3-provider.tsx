import { useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";

import { createWalletClient, custom } from "viem";
import { mainnet } from "viem/chains";

import { Web3Context, Web3ContextType } from "app/context/web3-context";
import { useWalletMobileSDK } from "app/hooks/use-wallet-mobile-sdk";
import { useMagic, Relayer } from "app/lib/magic";
import { useWeb3Modal } from "app/lib/react-native-web3-modal";

interface Web3ProviderProps {
  children: React.ReactNode;
  connected?: boolean;
  client?: Web3ContextType["web3"];
}

export function Web3Provider({
  children,
  connected,
  client,
}: Web3ProviderProps) {
  const [web3, setWeb3] = useState<Web3ContextType["web3"] | undefined>(
    undefined
  );
  const [mountRelayerOnApp, setMountRelayerOnApp] = useState(true);
  const web3Modal = useWeb3Modal();
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
      isMagic: web3?.isMagic,
      setMountRelayerOnApp,
      magicWalletAddress,
    }),
    [web3, magicWalletAddress]
  );

  // (Native only) initialises wallet connect native web3 provider
  useEffect(() => {
    if (Platform.OS !== "web" && web3Modal.isConnected) {
      (async function setWeb3Provider() {
        if (web3Modal.provider) {
          const client = createWalletClient({
            chain: mainnet,
            transport: custom(web3Modal.provider),
          });

          setWeb3(client);
        }
      })();
    }
  }, [web3Modal.isConnected, web3Modal.provider]);

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

        const client = createWalletClient({
          chain: mainnet,
          transport: custom(mobileSDKProvider as any),
        });

        setWeb3(client);
      }
    })();
  }, [mobileSDK.address, mobileSDK.connected]);

  // (Web/Native) initialises magic web3 provider
  useEffect(() => {
    magic?.user?.isLoggedIn().then(async (isLoggedIn) => {
      if (magic.rpcProvider && isLoggedIn) {
        const client = createWalletClient({
          chain: mainnet,
          transport: custom(magic.rpcProvider),
        });

        setWeb3({ ...client, isMagic: true });
      }
    });
  }, [magic]);

  useEffect(() => {
    // @ts-ignore
    if (web3?.isMagic)
      web3.getAddresses().then((address) => {
        setMagicWalletAddress(address[0]);
      });
  }, [web3]);

  // (Web only) initialises web3 provider from wagmi
  useEffect(() => {
    if (Platform.OS === "web" && connected) {
      setWeb3(client);
    }
  }, [connected, client]);

  return (
    <Web3Context.Provider value={Web3ContextValue}>
      {children}
      {/* TODO: Open Relayer on FullWindow, need change in relayer source */}
      {mountRelayerOnApp ? <Relayer /> : null}
    </Web3Context.Provider>
  );
}
