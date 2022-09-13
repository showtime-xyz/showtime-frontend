import { useState } from "react";

import { useSWRConfig } from "swr";

import { useAlert } from "@showtime-xyz/universal.alert";

import { useWallet } from "app/hooks/use-wallet";
import { addWalletToBackend } from "app/lib/add-wallet/add-wallet";
import { Logger } from "app/lib/logger";
import { fetchNonce } from "app/lib/nonce";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";

const useAddWallet = () => {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const Alert = useAlert();
  const { mutate } = useSWRConfig();

  const wallet = useWallet();
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
          await addWalletToBackend({
            address: res.address,
            signature,
          });
          mutate(MY_INFO_ENDPOINT);
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
