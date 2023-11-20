import Axios from "axios";
import useSWRMutation from "swr/mutation";

import { useAlert } from "@showtime-xyz/universal.alert";
import { useRouter } from "@showtime-xyz/universal.router";

import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { formatAPIErrorMessage, formatAddressShort } from "app/utilities";

import { useSetPrimaryWallet } from "../api/use-set-primary-wallet";
import { useUser } from "../use-user";
import { useWallet } from "../use-wallet";

export const useCreatorTokenOptIn = () => {
  const Alert = useAlert();
  const wallet = useWallet();
  const user = useUser();
  const router = useRouter();
  const { setPrimaryWallet } = useSetPrimaryWallet();

  const state = useSWRMutation(
    "creatorTokenOptIn",
    async (_url: string, { arg }: { arg?: { inviteCode: string } }) => {
      // if primary wallet is magic, we don't support creating tokens
      if (
        user.user?.data.profile.primary_wallet?.is_apple ||
        user.user?.data.profile.primary_wallet?.is_google ||
        user.user?.data.profile.primary_wallet?.is_phone ||
        user.user?.data.profile.primary_wallet?.is_twitter ||
        user.user?.data.profile.primary_wallet?.is_email
      ) {
        await setPrimaryIfMagic();
      }

      return axios({
        url: "/v1/profile/creator-tokens/optin",
        method: "POST",
        data: {
          invite_code: arg?.inviteCode,
        },
      });
    },
    {
      onError: (error) => {
        Logger.error(error);
        if (Axios.isAxiosError(error)) {
          Alert.alert(formatAPIErrorMessage(error));
        }
      },
    }
  );

  const setPrimaryIfMagic = () => {
    return new Promise<void>((resolve, reject) => {
      // Current logged in wallet is magic, we ask user to login using a regular web3 wallet
      if (wallet.isMagicWallet) {
        Alert.alert(
          "Unsupported wallet",
          "To enable creator token, please add a regular web3 wallet to your account and set that to primary",
          [
            {
              text: "Okay",
              onPress: () => {
                router.push("/settings");
              },
            },
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => {
                reject("User cancelled");
              },
            },
          ]
        );
      } else if (wallet.address) {
        setPrimaryWallet(wallet.address).then(resolve).catch(reject);
      }
    });
  };

  return state;
};
