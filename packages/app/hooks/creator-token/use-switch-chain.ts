import useSWRMutation from "swr/mutation";

import { isMobileWeb } from "app/utilities";

import { toast } from "design-system/toast";

import { useWallet } from "../use-wallet";
import { baseChain } from "./utils";

export const useSwitchChain = () => {
  const wallet = useWallet();
  const state = useSWRMutation("switchChain", async function switchChain() {
    if (wallet.address) {
      const currentChain = await wallet.walletClient?.getChainId();
      if (currentChain !== baseChain.id) {
        // HACK because mobile wallets are notoriously buggy
        if (isMobileWeb()) {
          toast.error(
            `Please switch to the correct network "${baseChain.name}" and try again`
          );
        } else {
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
    }
  });

  return state;
};
