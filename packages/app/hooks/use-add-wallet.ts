import { useState } from "react";

import { useSWRConfig } from "swr";

import { useAlert } from "@showtime-xyz/universal.alert";

import { useSetPrimaryWallet } from "app/hooks/api/use-set-primary-wallet";
import { useUser } from "app/hooks/use-user";
import { useWallet } from "app/hooks/use-wallet";
import { useWeb3 } from "app/hooks/use-web3";
import { addWalletToBackend } from "app/lib/add-wallet/add-wallet";
import { Logger } from "app/lib/logger";
import { fetchNonce } from "app/lib/nonce";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";
import { WalletAddressesV2 } from "app/types";
import { isMobileWeb } from "app/utilities";

const getWalletDefalutNickname = (
  walletName: string | undefined,
  userWallets: WalletAddressesV2[] | undefined
) => {
  const index = userWallets?.findIndex((item) => item.nickname === walletName);
  if (!index || index === -1) {
    return walletName;
  }
  return `${walletName} ${(userWallets?.length ?? 0) + 1}`;
};

const useAddWallet = () => {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const Alert = useAlert();
  const { mutate } = useSWRConfig();
  const { setPrimaryWallet } = useSetPrimaryWallet();
  const user = useUser();
  const wallet = useWallet();
  const { isMagic } = useWeb3();

  const hasNoPrimaryWallet = user?.user?.data.profile.primary_wallet === null;
  const userWallets = user?.user?.data.profile.wallet_addresses_v2;

  const addWallet = async () => {
    let signature: string | undefined;
    let address: string | undefined;
    let walletName: string | undefined;

    try {
      setStatus("loading");

      if (wallet.connected && !isMagic) {
        await wallet.disconnect();
      }

      const res = await wallet.connect();

      if (res) {
        address = res.address;
        walletName = res.walletName;
        const nonce = await fetchNonce(address);
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
                  signature = await wallet.signMessageAsync({
                    message,
                  });
                  if (signature && address) {
                    const addedWallet = await addWalletToBackend({
                      address,
                      signature,
                      nickname: getWalletDefalutNickname(
                        walletName,
                        userWallets
                      ),
                    });

                    mutate(MY_INFO_ENDPOINT);

                    // automatically set the primary wallet on add wallet if user doesn't have one
                    if (hasNoPrimaryWallet) {
                      setPrimaryWallet(addedWallet.address);
                    }
                  }
                },
              },
            ]
          );
        } else {
          signature = await wallet.signMessageAsync({ message });
          if (signature && address) {
            const addedWallet = await addWalletToBackend({
              address,
              signature,
              nickname: getWalletDefalutNickname(walletName, userWallets),
            });

            mutate(MY_INFO_ENDPOINT);

            // automatically set the primary wallet on add wallet if user doesn't have one
            if (hasNoPrimaryWallet) {
              setPrimaryWallet(addedWallet.address);
            }
          }
        }
      }

      setStatus("idle");
    } catch (e: any) {
      setStatus("error");
      if (e?.response?.data?.error?.code === 409) {
        Alert.alert(
          `This wallet is already linked to another Showtime account`,
          e.message,
          [
            { text: "Cancel" },
            {
              text: "Confirm",
              onPress: async () => {
                if (signature && address) {
                  const addedWallet = await addWalletToBackend({
                    address,
                    signature,
                    nickname: getWalletDefalutNickname(walletName, userWallets),
                    reassignWallet: true,
                  });

                  mutate(MY_INFO_ENDPOINT);

                  // automatically set the primary wallet on add wallet if user doesn't have one
                  if (hasNoPrimaryWallet) {
                    setPrimaryWallet(addedWallet.address);
                  }
                }
              },
            },
          ]
        );
      } else {
        Logger.error("failed adding wallet", e);
        Alert.alert("Something went wrong", e.message);
      }
    }
  };

  return { addWallet, state: { status } };
};

export { useAddWallet };
