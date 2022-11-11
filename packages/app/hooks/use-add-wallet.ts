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
import { isMobileWeb } from "app/utilities";

const useAddWallet = () => {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const Alert = useAlert();
  const { mutate } = useSWRConfig();
  const { setPrimaryWallet } = useSetPrimaryWallet();
  const user = useUser();
  const wallet = useWallet();

  const hasNoPrimaryWallet = user?.user?.data.profile.primary_wallet === null;
  const userWallets = user?.user?.data.profile.wallet_addresses_v2;

  const addWallet = async (isMagic?: boolean) => {
    try {
      setStatus("loading");

      if (wallet.connected) {
        await wallet.disconnect();
      }

      const res = await wallet.connect();

      const getWalletDefalutNickname = () => {
        const walletName = res?.walletName;
        const index = userWallets?.findIndex(
          (item) => item.nickname === walletName
        );
        if (!index || index === -1) {
          return res?.walletName;
        }
        return `${res?.walletName} ${(userWallets?.length ?? 0) + 1}`;
      };

      if (res) {
        const nonce = await fetchNonce(res.address);
        const message = process.env.NEXT_PUBLIC_SIGNING_MESSAGE + " " + nonce;
        if (isMobileWeb()) {
          Alert.alert(
            "Sign message",
            "We need a signature in order to verify your identity. This won't cost any gas.",
            [
              {
                text: "Cancel",
              },
              {
                text: "Sign",
                onPress: async () => {
                  const signature = await wallet.signMessageAsync({
                    message,
                  });
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
                },
              },
            ]
          );
        } else {
          const signature = await wallet.signMessageAsync({ message });
          if (signature) {
            const addedWallet = await addWalletToBackend({
              address: res.address,
              signature,
              nickname: getWalletDefalutNickname(),
            });

            mutate(MY_INFO_ENDPOINT);

            // automatically set the primary wallet on add wallet if user doesn't have one
            if (hasNoPrimaryWallet) {
              setPrimaryWallet(addedWallet);
            }
          }
        }
      }

      setStatus("idle");
    } catch (e: any) {
      setStatus("error");
      Alert.alert("Something went wrong", e.message);
      Logger.error("failed adding wallet", e);
    }
  };

  return { addWallet, state: { status } };
};

export { useAddWallet };
