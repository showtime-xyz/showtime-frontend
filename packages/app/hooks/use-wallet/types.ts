import { ethers } from "ethers";

export type UseWalletReturnType = {
  address?: string;
  disconnect: () => Promise<void>;
  connected?: boolean;
  networkChanged?: boolean;
  connect: () => Promise<void>;
  name?: string;
  signMessageAsync: (args: {
    message: string | ethers.utils.Bytes;
  }) => Promise<string | undefined>;
};
