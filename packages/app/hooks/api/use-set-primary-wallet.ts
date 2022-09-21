import { useSWRConfig } from "swr";

import { axios } from "app/lib/axios";
import { createParam } from "app/navigation/use-param";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";
import { WalletAddressesExcludingEmailV2 } from "app/types";

import { useRedirectToClaimDrop } from "../use-redirect-to-claim-drop";

type Query = {
  editionContractAddress: string;
};

const { useParam } = createParam<Query>();
export const useSetPrimaryWallet = () => {
  const { mutate } = useSWRConfig();
  const redirectToClaimDrop = useRedirectToClaimDrop();
  const [editionContractAddress] = useParam("editionContractAddress");

  const setPrimaryWallet = async (wallet: WalletAddressesExcludingEmailV2) => {
    mutate(MY_INFO_ENDPOINT, async () => {
      await axios({
        url: `/v2/wallet/${wallet.address}/primary`,
        method: "PATCH",
      });
      if (editionContractAddress) {
        redirectToClaimDrop(editionContractAddress);
      }
    });
  };

  return { setPrimaryWallet };
};
