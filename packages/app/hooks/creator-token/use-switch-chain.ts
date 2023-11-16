import useSWRMutation from "swr/mutation";

import { isMobileWeb } from "app/utilities";

import { toast } from "design-system/toast";

import { useWallet } from "../use-wallet";
import { baseChain } from "./utils";

export const useSwitchChain = () => {
  const wallet = useWallet();
  const state = useSWRMutation("switchChain", async function switchChain() {
    const walletClient = await wallet.getWalletClient?.();
    const currentChain = await walletClient?.getChainId();
    if (currentChain !== baseChain.id) {
      // HACK because mobile wallets are notoriously buggy
      if (isMobileWeb()) {
        toast.error(
          `Please switch to the correct network "${baseChain.name}" and try again`
        );
      } else {
        try {
          await walletClient?.switchChain({ id: baseChain.id });
          return true;
        } catch (e: any) {
          if (e.code === 4902) {
            await walletClient?.addChain({
              chain: baseChain,
            });
          }
        }
      }
    } else {
      return true;
    }
  });

  return state;
};
