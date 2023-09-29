import type { GetAccountResult, SignMessageArgs } from "@wagmi/core";
import type { WalletClient } from "viem";

export type ConnectResult = Promise<
  | {
      address: string;
      walletName: string;
      /**
       * **WEB ONLY**: from wagmi lib
       */
      connector?: GetAccountResult["connector"];
      isReconnected?: boolean;
    }
  | undefined
>;
export type UseWalletReturnType = {
  address?: string;
  disconnect: () => ConnectResult;
  connected?: boolean;
  networkChanged?: boolean;
  connect: () => ConnectResult;
  name?: string;
  signMessageAsync: (args: SignMessageArgs) => Promise<string | undefined>;
  isMagicWallet?: boolean;
  getBalance: (address: string) => Promise<bigint | undefined>;
  walletClient?: WalletClient | null;
};
