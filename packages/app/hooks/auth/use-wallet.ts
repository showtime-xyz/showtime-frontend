import { useState, useEffect, useMemo } from "react";

import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { ethers } from "ethers";

import { useWeb3 } from "app/hooks/use-web3";
import { getWallet } from "app/lib/random-wallet";
import { delay } from "app/utilities";

export type UseWalletReturnType = {
  address?: string;
  disconnect: () => Promise<void>;
  connected?: boolean;
  networkChanged?: boolean;
  connect: () => Promise<void>;
  name?: string;
  signMessageAsync: (args: {
    message: string | ethers.utils.Bytes;
  }) => Promise<string | undefined>;
};

let wallet: ethers.Wallet;
if (process.env.E2E) {
  wallet = getWallet();
}

const useWallet = (): UseWalletReturnType => {
  const connector = useWalletConnect();
  const { web3, isMagic, magicWalletAddress } = useWeb3();
  const [address, setAddress] = useState<string | undefined>();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    (async function fetchUserAddress() {
      if (connector.session?.accounts?.[0]) {
        setAddress(ethers.utils.getAddress(connector.session.accounts[0]));
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
    if (process.env.E2E) {
      return {
        address: wallet.address,
        connect: async () => {
          await delay(200);
          setConnected(true);
        },
        disconnect: async () => {
          await delay(200);
          setConnected(false);
        },
        name: "test wallet",
        connected,
        networkChanged: undefined,
        signMessageAsync: async (args: {
          message: string | ethers.utils.Bytes;
        }) => {
          const signature = await wallet.signMessage(args.message);
          return signature;
        },
      };
    }

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
      signMessageAsync: async (args: {
        message: string | ethers.utils.Bytes;
      }) => {
        const signature = await connector.signPersonalMessage([
          args.message,
          address,
        ]);
        return signature;
      },
    };
  }, [address, connector, isMagic, connected]);

  return result;
};

export { useWallet };
