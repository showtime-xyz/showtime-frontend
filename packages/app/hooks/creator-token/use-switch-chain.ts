import useSWRMutation from "swr/mutation";
import { baseGoerli, base } from "viem/chains";

import { isDEV } from "app/utilities";

import { useWallet } from "../use-wallet";

export const useSwitchChain = () => {
  const wallet = useWallet();
  const state = useSWRMutation("switchChain", async function switchChain() {
    if (wallet.address) {
      const chain = isDEV ? baseGoerli : base;
      if (wallet.walletClient?.chain?.id !== chain.id) {
        try {
          await wallet?.walletClient?.switchChain({ id: chain.id });
        } catch (e: any) {
          if (e.code === 4902) {
            await wallet?.walletClient?.addChain({
              chain,
            });
          }
        }
      }
    }
  });

  return state;
};
