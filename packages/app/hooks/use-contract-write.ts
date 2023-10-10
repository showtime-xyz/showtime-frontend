import { SimulateContractParameters } from "viem";

import { publicClient } from "app/lib/wallet-public-client";

import { useWallet } from "./use-wallet";

export const useWriteContract = (param: SimulateContractParameters) => {
  const { walletClient } = useWallet();
  const writeContract = async () => {
    const { request } = await publicClient.simulateContract(param);
    await walletClient?.writeContract(request);
  };

  return writeContract;
};
