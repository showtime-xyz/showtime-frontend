import { useSWRConfig } from "swr";

import { useRouter } from "@showtime-xyz/universal.router";

import { axios } from "app/lib/axios";
import { createParam } from "app/navigation/use-param";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";
import { WalletAddressesExcludingEmailV2 } from "app/types";

type Query = {
  popOnSuccess: boolean;
};

const { useParam } = createParam<Query>();
export const useSetPrimaryWallet = () => {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const [popOnSuccess] = useParam("popOnSuccess", {
    parse: (v) => v === "true",
    initial: false,
  });

  const setPrimaryWallet = async (wallet: WalletAddressesExcludingEmailV2) => {
    mutate(MY_INFO_ENDPOINT, async () => {
      await axios({
        url: `/v2/wallet/${wallet.address}/primary`,
        method: "PATCH",
      });
      if (popOnSuccess) {
        router.pop();
      }
    });
  };

  return { setPrimaryWallet };
};
