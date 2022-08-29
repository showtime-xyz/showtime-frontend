import { useState, useEffect } from "react";

import type { Bytes } from "@ethersproject/bytes";
import { useWalletConnect } from "@walletconnect/react-native-dapp";

import { useWeb3 } from "app/hooks/use-web3";

export type UseWalletReturnType = {
  address?: string;
  disconnect: () => Promise<void>;
  connected?: boolean;
  networkChanged?: boolean;
  connect: () => Promise<void>;
  signMessageAsync: (args: {
    message: string | Bytes;
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
        const getAddress = (await import("@ethersproject/address")).getAddress;
        setAddress(getAddress(session.accounts[0]));
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
    connect: async () => {
      await connector.connect();
    },
    disconnect: async () => {
      localStorage.removeItem("walletconnect");
      await connector.killSession();
    },
    connected: connected || isMagic,
    networkChanged: undefined,
    signMessageAsync: async (args: { message: string | Bytes }) => {
      const signature = await web3?.getSigner().signMessage(args.message);
      return signature;
    },
  };
};

export { useWallet };
