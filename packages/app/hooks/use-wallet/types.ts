import type { Bytes } from "@ethersproject/bytes";

export type ConnectResult = Promise<
  | {
      address: string;
      walletName: string;
    }
  | undefined
>;
export type UseWalletReturnType = {
  address?: string;
  disconnect: () => Promise<void>;
  connected?: boolean;
  networkChanged?: boolean;
  connect: () => ConnectResult;
  name?: string;
  signMessageAsync: (args: {
    message: string | Bytes;
  }) => Promise<string | undefined>;
};
