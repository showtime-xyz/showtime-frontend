import { useEffect, useMemo, useState, useRef } from "react";
import { Platform } from "react-native";

import { createWalletClient, custom } from "viem";
import { mainnet } from "viem/chains";

import { Web3Context, Web3ContextType } from "app/context/web3-context";
import { useWalletMobileSDK } from "app/hooks/use-wallet-mobile-sdk";
import { useWeb3Modal } from "app/lib/react-native-web3-modal";

interface Web3ProviderProps {
  children: React.ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [web3, setWeb3State] = useState<Web3ContextType["web3"] | undefined>(
    undefined
  );
  const walletClientRef = useRef<Web3ContextType["web3"] | undefined>(null);
  const web3Modal = useWeb3Modal();
  const mobileSDK = useWalletMobileSDK();

  const setWeb3 = (web3: Web3ContextType["web3"] | undefined) => {
    walletClientRef.current = web3;
    setWeb3State(web3);
  };

  const Web3ContextValue = useMemo(
    () => ({
      web3,
      setWeb3,
      //@ts-ignore
      isMagic: web3?.isMagic,
      getWalletClient: () => walletClientRef.current,
    }),
    [web3]
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

  // (Native only) initializes coinbase wallet mobile sdk provider
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

  return (
    <Web3Context.Provider value={Web3ContextValue}>
      {children}
    </Web3Context.Provider>
  );
}
