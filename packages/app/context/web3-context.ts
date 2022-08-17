import { createContext } from "react";

import type { Web3Provider } from "@ethersproject/providers";

type Web3ContextType = {
  web3?: Web3Provider;
  isMagic?: boolean;
  setWeb3: (web3?: Web3Provider) => void;
  setMountRelayerOnApp: (hide: boolean) => void;
  magicWalletAddress?: string;
};

export const Web3Context = createContext<Web3ContextType | null>(null);
