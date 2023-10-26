import { createContext } from "react";

import type { WalletClient } from "viem";

export type Web3ContextType = {
  web3?: (WalletClient & { isMagic?: boolean }) | null;
  isMagic?: boolean;
  setWeb3: (web3: (WalletClient & { isMagic?: boolean }) | null) => void;
  setMountRelayerOnApp: (hide: boolean) => void;
  magicWalletAddress?: string;
  getWalletClient: () => Web3ContextType["web3"] | undefined;
};

export const Web3Context = createContext<Web3ContextType | null>(null);
