import type { Bytes } from "@ethersproject/bytes";

export type UseWalletReturnType = {
  address?: string;
  disconnect: () => Promise<void>;
  connected?: boolean;
  networkChanged?: boolean;
  connect: () => Promise<void>;
  name?: string;
  signMessageAsync: (args: {
    message: string | Bytes;
  }) => Promise<string | undefined>;
};
