import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { ethers } from "ethers";

import { useWeb3 } from "app/hooks/use-web3";

export type UseWalletReturnType = {
  address?: string;
  disconnect: () => void;
  connected?: boolean;
  networkChanged?: boolean;
  signMessageAsync: (args: {
    message: string | ethers.utils.Bytes;
  }) => Promise<string | undefined>;
  provider?: ethers.providers.Provider;
};

const useWallet = (): UseWalletReturnType => {
  const { connected, killSession, session } = useWalletConnect();
  const { web3, isMagic } = useWeb3();

  return {
    address: connected
      ? ethers.utils.getAddress(session.accounts[0])
      : undefined,
    disconnect: killSession,
    connected: connected || isMagic,
    networkChanged: undefined,
    signMessageAsync: async (args: {
      message: string | ethers.utils.Bytes;
    }) => {
      const signature = await web3?.getSigner().signMessage(args.message);
      return signature;
    },
    provider: undefined,
  };
};

export { useWallet };
