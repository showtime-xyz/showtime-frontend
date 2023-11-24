import useSWR from "swr";

import { creatorTokenAbi } from "app/abi/CreatorTokenAbi";
import { publicClient } from "app/lib/wallet-public-client";

export const getContractBalanceOfTokenKey = (params?: {
  ownerAddress?: any;
  contractAddress: string;
}) =>
  params ? "balanceOfToken" + params.ownerAddress + params.contractAddress : "";

export const useContractBalanceOfToken = (params: {
  ownerAddress?: any;
  contractAddress?: any;
}) => {
  console.log("balance of address ", params);
  const res = useSWR(
    getContractBalanceOfTokenKey({
      ownerAddress: params.ownerAddress,
      contractAddress: params.contractAddress,
    }),
    () => {
      if (params.ownerAddress && params.contractAddress) {
        return publicClient.readContract({
          address: params.contractAddress,
          abi: creatorTokenAbi,
          functionName: "balanceOf",
          args: [params.ownerAddress],
        }) as Promise<bigint>;
      }
    }
  );

  return res;
};
