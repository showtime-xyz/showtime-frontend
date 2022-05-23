import { useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";

import { Web3Provider as EthersWeb3Provider } from "@ethersproject/providers";
import { useAccount, useProvider } from "wagmi";

import { Web3Context } from "app/context/web3-context";
import { magic, Relayer } from "app/lib/magic";

interface Web3ProviderProps {
  children: React.ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  //#region state
  const [web3, setWeb3] = useState<EthersWeb3Provider | undefined>(undefined);
  const [mountRelayerOnApp, setMountRelayerOnApp] = useState(true);
  const provider = useProvider();
  //#endregion

  //#region variables
  const Web3ContextValue = useMemo(
    () => ({
      web3,
      setWeb3: (_web3) => {
        console.log("set web3 my fren", _web3);
        setWeb3(_web3);
      },
      setMountRelayerOnApp,
      isMagicLogin: Boolean(web3),
    }),
    [web3]
  );

  useEffect(() => {
    magic?.user?.isLoggedIn().then((isLoggedIn) => {
      if (magic.rpcProvider && isLoggedIn) {
        const ehterProvider = new EthersWeb3Provider(magic.rpcProvider);
        setWeb3(ehterProvider);
      }
    });

    // if (Platform.OS === "web" && !web3) {
    //   const ethersProvider = new EthersWeb3Provider(provider);
    //   setWeb3(ethersProvider);
    // }
  }, [provider]);

  //#endregion
  return (
    <Web3Context.Provider value={Web3ContextValue}>
      {children}
      {/* TODO: Open Relayer on FullWindow, need change in relayer source */}
      {mountRelayerOnApp ? <Relayer /> : null}
    </Web3Context.Provider>
  );
}
