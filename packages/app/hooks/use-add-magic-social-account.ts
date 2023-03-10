import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

import { useAlert } from "@showtime-xyz/universal.alert";

import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { useMagicSocialAuth } from "app/lib/social-logins";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";

import { toast } from "design-system/toast";

type AddSocialType = {
  type: "google" | "twitter" | "apple";
};

export const useAddMagicSocialAccount = () => {
  const { mutate } = useSWRConfig();
  const Alert = useAlert();
  const {
    performMagicAuthWithGoogle,
    performMagicAuthWithApple,
    performMagicAuthWithTwitter,
  } = useMagicSocialAuth();

  const state = useSWRMutation(
    MY_INFO_ENDPOINT,
    async (key: string, values: { arg: AddSocialType }) => {
      let res;
      try {
        if (values.arg.type === "google") {
          res = await performMagicAuthWithGoogle();
        } else if (values.arg.type === "twitter") {
          res = await performMagicAuthWithTwitter();
        } else if (values.arg.type === "apple") {
          res = await performMagicAuthWithApple();
        }
      } catch (error: any) {
        Logger.error("Magic social auth failed ", error);
      }

      if (res) {
        const params = {
          did_token: res.magic.idToken,
          provider_access_token: res.oauth.accessToken,
          provider_scope: res.oauth.scope,
        };

        console.log("ress ", res);
        try {
          await axios({
            url: `/v2/wallet/add-magic-wallet`,
            method: "POST",
            data: params,
            overrides: {
              forceAccessTokenAuthorization: true,
            },
          });
          toast.success("Social account added");
        } catch (error: any) {
          Logger.error("Add social error", error);

          if (error?.response.status === 420) {
            Alert.alert(
              `This account is already linked to another Showtime account`,
              `Would you like to link it to this account? \n\n By doing so, you will lose your access to the previous account`,
              [
                { text: "Cancel" },
                {
                  text: "Confirm",
                  onPress: async () => {
                    await axios({
                      url: `/v2/wallet/add-magic-wallet`,
                      method: "POST",
                      data: { ...params, reassign_wallet: true },
                      overrides: {
                        forceAccessTokenAuthorization: true,
                      },
                    });

                    mutate(MY_INFO_ENDPOINT);
                    toast.success("Social account added");
                  },
                },
              ]
            );
          }
        }
      }
    }
  );

  return state;
};
