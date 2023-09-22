import { useContext } from "react";

import useSWRMutation from "swr/mutation";

import { UserContext } from "app/context/user-context";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";

import { axios } from "../lib/axios";
import { useManageAccount } from "./use-manage-account";

type AddSocialType = {
  providerId: string;
};

export const useDisconnectTwitter = () => {
  const wallet =
    useContext(UserContext)?.user?.data.profile.wallet_addresses_v2;
  const { removeAccount } = useManageAccount();

  const state = useSWRMutation(
    MY_INFO_ENDPOINT,
    async (key: string, values: { arg: AddSocialType }) => {
      const twitterMagicWalletIndex = wallet?.findIndex((w) => w.is_twitter);
      if (twitterMagicWalletIndex && twitterMagicWalletIndex !== -1 && wallet) {
        await removeAccount(wallet[twitterMagicWalletIndex].address);
      } else {
        await axios({
          url: `/v1/profile/accounts/token/twitter/${values.arg.providerId}`,
          method: "DELETE",
        });
      }
    }
  );

  return state;
};
