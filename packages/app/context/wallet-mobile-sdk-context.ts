import { createContext } from "react";

import { ethers } from "ethers";

type Metadata = {
  name: string;
};

type WalletMobileSDKContextType = {
  connected: boolean;
  address: string | null;
  metadata: Metadata | null;
  onConnected: () => Promise<void>;
  connect: () => Promise<void>;
  disconnect: () => void;
  personalSign: (
    message: string | ethers.utils.Bytes,
    address: string
  ) => Promise<string>;
};

export const WalletMobileSDKContext =
  createContext<WalletMobileSDKContextType | null>(null);
