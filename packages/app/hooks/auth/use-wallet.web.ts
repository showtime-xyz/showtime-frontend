import { useMemo } from "react";

import {
  useAccount,
  useSignMessage,
  useSigner,
  useNetwork,
  useDisconnect,
} from "wagmi";

import { UseWalletReturnType } from "./use-wallet";

const useWallet = (): UseWalletReturnType => {
  const wagmiData = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { data: wagmiSigner } = useSigner();
  const { chain } = useNetwork();
  const { disconnect } = useDisconnect();

  const networkChanged = useMemo(() => !!chain && chain.id !== 137, [chain]);

  return {
    address: wagmiData.isConnected ? wagmiData?.address : undefined,
    connected: wagmiData.isConnected && !!wagmiSigner?.provider && !!chain,
    disconnect,
    networkChanged,
    provider: wagmiSigner?.provider,
    signMessageAsync,
  };
};

export { useWallet };
