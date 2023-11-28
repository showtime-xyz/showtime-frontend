import type { GetAccountResult, SignMessageArgs } from "@wagmi/core";
import type { WalletClient } from "viem";

export type ConnectResult = Promise<
  | {
      address: `0x${string}`;
      walletName: string;
      /**
       * **WEB ONLY**: from wagmi lib
       */
      connector?: GetAccountResult["connector"];
      isReconnected?: boolean;
      walletClientType?: string;
    }
  | undefined
>;
export type UseWalletReturnType = {
  address?: string;
  disconnect: () => ConnectResult;
  connected?: boolean;
  connect: () => ConnectResult;
  name?: string;
  signMessageAsync: (args: SignMessageArgs) => Promise<string> | undefined;
  isMagicWallet?: boolean;
  walletClient?: WalletClient | null;
  getWalletClient: () => any;
  walletClientType?: string;
};
