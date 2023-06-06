import { createContext } from "react";

import type { Bytes } from "@ethersproject/bytes";

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
  personalSign: (message: string | Bytes, address: string) => Promise<string>;
};

export const WalletMobileSDKContext =
  createContext<WalletMobileSDKContextType | null>(null);
