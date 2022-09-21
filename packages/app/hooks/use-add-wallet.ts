import { useState } from "react";

import { useSWRConfig } from "swr";

import { useAlert } from "@showtime-xyz/universal.alert";

import { useSetPrimaryWallet } from "app/hooks/api/use-set-primary-wallet";
import { useUser } from "app/hooks/use-user";
import { useWallet } from "app/hooks/use-wallet";
import { addWalletToBackend } from "app/lib/add-wallet/add-wallet";
import { Logger } from "app/lib/logger";
import { fetchNonce } from "app/lib/nonce";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";

const useAddWallet = () => {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const Alert = useAlert();
  const { mutate } = useSWRConfig();
  const { setPrimaryWallet } = useSetPrimaryWallet();

  const user = useUser();
  const wallet = useWallet();

  const hasNoPrimaryWallet = user?.user?.data.profile.primary_wallet === null;

  const addWallet = async () => {
    try {
      setStatus("loading");
      if (wallet.connected) {
        await wallet.disconnect();
      }

      const res = await wallet.connect();

      if (res) {
        const nonce = await fetchNonce(res.address);
        const message = process.env.NEXT_PUBLIC_SIGNING_MESSAGE + " " + nonce;
        const signature = await wallet.signMessageAsync({ message });
        if (signature) {
          const addedWallet = await addWalletToBackend({
            address: res.address,
            signature,
          });

          mutate(MY_INFO_ENDPOINT);

          // automatically set the primary wallet on add wallet if user doesn't have one
          if (hasNoPrimaryWallet) {
            setPrimaryWallet(addedWallet);
          }
        }
      }

      setStatus("idle");
    } catch (e) {
      setStatus("error");
      Alert.alert("Something went wrong", e.message);
      Logger.error("failed adding wallet", e);
    }
  };

  return { addWallet, state: { status } };
};

export { useAddWallet };
