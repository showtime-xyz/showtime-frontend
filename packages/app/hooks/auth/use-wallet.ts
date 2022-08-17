import { useState, useEffect } from "react";

import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { ethers } from "ethers";

import { useWeb3 } from "app/hooks/use-web3";

export type UseWalletReturnType = {
  address?: string;
  disconnect: () => void;
  connected?: boolean;
  networkChanged?: boolean;
  connect?: () => void;
  signMessageAsync: (args: {
    message: string | ethers.utils.Bytes;
  }) => Promise<string | undefined>;
};

const useWallet = (): UseWalletReturnType => {
  const connector = useWalletConnect();
  const { connected, session } = connector;
  const { web3, isMagic, magicWalletAddress } = useWeb3();
  const [address, setAddress] = useState<string | undefined>();

  useEffect(() => {
    (async function fetchUserAddress() {
      if (session?.accounts?.[0]) {
        setAddress(ethers.utils.getAddress(session.accounts[0]));
      } else if (magicWalletAddress) {
        setAddress(magicWalletAddress);
      } else if (web3) {
        const address = await web3.getSigner().getAddress();
        setAddress(address);
      } else {
        setAddress(undefined);
      }
    })();
  }, [web3, session, magicWalletAddress]);

  return {
    address,
    connect: connector.connect,
    disconnect: connector.killSession,
    connected: connected || isMagic,
    networkChanged: undefined,
    signMessageAsync: async (args: {
      message: string | ethers.utils.Bytes;
    }) => {
      const signature = await web3?.getSigner().signMessage(args.message);
      return signature;
    },
  };
};

export { useWallet };
