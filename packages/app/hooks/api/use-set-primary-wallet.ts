import { useSWRConfig } from "swr";

import { axios } from "app/lib/axios";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";
import { WalletAddressesExcludingEmailV2 } from "app/types";

export const useSetPrimaryWallet = () => {
  const { mutate } = useSWRConfig();
  const setPrimaryWallet = async (wallet: WalletAddressesExcludingEmailV2) => {
    mutate(MY_INFO_ENDPOINT, async () => {
      await axios({
        url: `/v2/wallet/${wallet.address}/primary`,
        method: "PATCH",
      });
    });
  };

  return { setPrimaryWallet };
};
