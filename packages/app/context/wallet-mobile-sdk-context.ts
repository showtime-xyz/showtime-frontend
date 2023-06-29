import { createContext } from "react";

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
  personalSign: (message: string, address: string) => Promise<string>;
};

export const WalletMobileSDKContext =
  createContext<WalletMobileSDKContextType | null>(null);
