import { useState, useEffect, useMemo } from "react";

import type { Bytes } from "@ethersproject/bytes";
import { useWalletConnect } from "@walletconnect/react-native-dapp";

import { useWeb3 } from "app/hooks/use-web3";

import { UseWalletReturnType } from "./types";
import { useRandomWallet } from "./use-random-wallet";

const useWallet = (): UseWalletReturnType => {
  const connector = useWalletConnect();
  const { web3, isMagic, magicWalletAddress } = useWeb3();
  const [address, setAddress] = useState<string | undefined>();

  useEffect(() => {
    (async function fetchUserAddress() {
      if (connector.session?.accounts?.[0]) {
        const getAddress = (await import("@ethersproject/address")).getAddress;
        setAddress(getAddress(connector.session.accounts[0]));
      } else if (magicWalletAddress) {
        setAddress(magicWalletAddress);
      } else if (web3) {
        const address = await web3.getSigner().getAddress();
        setAddress(address);
      } else {
        setAddress(undefined);
      }
    })();
  }, [web3, connector.session, magicWalletAddress]);

  const result = useMemo(() => {
    return {
      address,
      connect: async () => {
        await connector.connect();
      },
      disconnect: async () => {
        localStorage.removeItem("walletconnect");
        await connector.killSession();
      },
      name: connector.peerMeta?.name,
      connected: connector.connected || isMagic,
      networkChanged: undefined,
      signMessageAsync: async (args: { message: string | Bytes }) => {
        const signature = await connector.signPersonalMessage([
          args.message,
          address,
        ]);
        return signature;
      },
    };
  }, [address, connector, isMagic]);

  if (process.env.E2E) {
    // env variables won't change between renders, so this looks safe

    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useRandomWallet();
  }

  return result;
};

export { useWallet };
