import useSWRMutation from "swr/mutation";

import { useWallet } from "../use-wallet";
import { baseChain } from "./utils";

export const useSwitchChain = () => {
  const wallet = useWallet();
  const state = useSWRMutation("switchChain", async function switchChain() {
    if (wallet.address) {
      if (wallet.walletClient?.chain?.id !== baseChain.id) {
        try {
          await wallet?.walletClient?.switchChain({ id: baseChain.id });
        } catch (e: any) {
          if (e.code === 4902) {
            await wallet?.walletClient?.addChain({
              chain: baseChain,
            });
          }
        }
      }
    }
  });

  return state;
};
