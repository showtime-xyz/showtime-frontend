import Axios from "axios";
import useSWRMutation from "swr/mutation";

import { useAlert } from "@showtime-xyz/universal.alert";

import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { formatAPIErrorMessage } from "app/utilities";

export const useCreatorTokenOptIn = () => {
  const Alert = useAlert();
  const state = useSWRMutation(
    "creatorTokenOptIn",
    async (_url: string, { arg }: { arg?: { inviteCode: string } }) => {
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

  return state;
};
