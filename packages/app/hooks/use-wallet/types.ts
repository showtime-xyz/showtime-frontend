import type { Bytes } from "@ethersproject/bytes";
import type { GetAccountResult } from "@wagmi/core";

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
  signMessageAsync: (args: {
    message: string | Bytes;
  }) => Promise<string | undefined>;
};
