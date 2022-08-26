import { useMemo, useState, useEffect } from "react";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useSignMessage,
  useSigner,
  useNetwork,
  useDisconnect,
} from "wagmi";

import { useWeb3 } from "app/hooks/use-web3";

import { UseWalletReturnType } from "./use-wallet";

const useWallet = (): UseWalletReturnType => {
  const wagmiData = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { data: wagmiSigner } = useSigner();
  const { chain } = useNetwork();
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();
  const { web3, isMagic, magicWalletAddress } = useWeb3();

  const networkChanged = useMemo(() => !!chain && chain.id !== 137, [chain]);
  const [address, setAddress] = useState<string | undefined>();

  useEffect(() => {
    (async function fetchUserAddress() {
      if (wagmiData?.address) {
        setAddress(wagmiData?.address);
      } else if (magicWalletAddress) {
        setAddress(magicWalletAddress);
      } else if (web3) {
        const address = await web3.getSigner().getAddress();
        setAddress(address);
      } else {
        setAddress(undefined);
      }
    })();
  }, [web3, wagmiData?.address, magicWalletAddress]);

  const connected =
    (wagmiData.isConnected && !!wagmiSigner?.provider && !!chain) || isMagic;

  return {
    address,
    connect: async () => {
      await openConnectModal?.();
    },
    connected,
    disconnect: async () => {
      localStorage.removeItem("walletconnect");
      await disconnect();
    },
    networkChanged,
    signMessageAsync,
  };
};

export { useWallet };
