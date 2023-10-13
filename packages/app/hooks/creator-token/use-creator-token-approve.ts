import { baseGoerli, base } from "viem/chains";

import { publicClient } from "app/lib/wallet-public-client";
import { isDEV } from "app/utilities";

import { useWallet } from "../use-wallet";

const usdcAddress = isDEV
  ? "0xF175520C52418dfE19C8098071a252da48Cd1C19"
  : "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

type IUseApproveToken = {
  creatorTokenContract: string;
  maxPrice: BigInt;
};

export const useApproveToken = () => {
  const wallet = useWallet();

  async function approveToken(params: IUseApproveToken) {
    const { creatorTokenContract, maxPrice } = params;
    if (wallet.address) {
      const chain = isDEV ? baseGoerli : base;
      try {
        await wallet?.walletClient?.switchChain({ id: chain.id });
      } catch (e: any) {
        if (e.code === 4902) {
          await wallet?.walletClient?.addChain({
            chain,
          });
        }
      }

      const res = (await publicClient?.readContract({
        address: usdcAddress,
        account: wallet.address,
        abi: require("app/abi/IERC20Permit.json"),
        functionName: "allowance",
        args: [wallet.address, creatorTokenContract],
      })) as unknown as BigInt;
      console.log("EFjef 23234", res < maxPrice);

      if (res < maxPrice) {
        const hash = await wallet.walletClient?.writeContract({
          address: usdcAddress,
          account: wallet.address,
          abi: require("app/abi/IERC20Permit.json"),
          functionName: "approve",
          args: [creatorTokenContract, maxPrice],
          chain: chain,
        });
        console.log("hash ", hash);
        return hash;
      }
    }
  }

  return { approveToken };
};
