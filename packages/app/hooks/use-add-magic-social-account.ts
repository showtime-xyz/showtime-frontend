import { Platform } from "react-native";

import * as WebBrowser from "expo-web-browser";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

import { useAlert } from "@showtime-xyz/universal.alert";

import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { useMagicSocialAuth } from "app/lib/social-logins";
import { authenticateWithTwitter } from "app/lib/social-logins/twitter-auth";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";

import { toast } from "design-system/toast";

type AddSocialType = {
  type: "google" | "twitter" | "apple" | "instagram";
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
    async (_key: string, values: { arg: AddSocialType }) => {
      if (values.arg.type === "instagram") {
        return handleInstagramAccountAdd(Alert, mutate);
      } else if (values.arg.type === "twitter") {
        return handleTwitterAccountAdd(Alert, mutate);
      } else {
        let res;
        try {
          if (values.arg.type === "google") {
            res = await performMagicAuthWithGoogle();
          } else if (values.arg.type === "apple") {
            res = await performMagicAuthWithApple();
          }
        } catch (error: any) {
          Logger.error("Magic social auth failed ", error);
          throw new Error("Connecting failed or aborted");
        }

        if (res) {
          const params = {
            did_token: res.magic.idToken,
            provider_access_token: res.oauth.accessToken,
            provider_scope: res.oauth.scope,
          };

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
        } else {
          // this throw is important to catch all magic errors but instagram
          throw new Error("Connecting failed or aborted");
        }
      }
    }
  );

  return state;
};

const handleInstagramAccountAdd = async (Alert: any, mutate: any) => {
  const scope = "user_profile";
  const redirectURI = Platform.select({
    web: `${
      __DEV__
        ? "http://localhost:3000"
        : `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}`
    }/instagram-oauth-redirect`,
    default: `io.showtime${
      __DEV__ ? ".development" : ""
    }://instagram-oauth-redirect`,
  });

  let redirectAPIHandler = `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}/api/instagram-oauth-redirect`;
  const url = `https://api.instagram.com/oauth/authorize?client_id=${
    process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID
  }&redirect_uri=${encodeURIComponent(
    redirectAPIHandler
  )}&response_type=code&scope=${scope}&state=${encodeURIComponent(
    redirectURI
  )}`;

  const res = await WebBrowser.openAuthSessionAsync(url, redirectURI);
  if (res.type === "success") {
    let urlObj = new URL(res.url);
    const code = urlObj.searchParams.get("code");

    try {
      const apiRes = await axios({
        url: `/v1/profile/accounts/token`,
        method: "POST",
        data: {
          provider: "instagram",
          code,
          redirect_uri: redirectAPIHandler,
          scope: [scope],
        },
      });
      mutate(MY_INFO_ENDPOINT);

      toast.success("Social account added");
      return apiRes;
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
                const apiRes = await axios({
                  url: `/v1/profile/accounts/token`,
                  method: "POST",
                  data: {
                    provider: "instagram",
                    code,
                    redirect_uri: redirectAPIHandler,
                    scope: [scope],
                    reassign_wallet: true,
                  },
                });
                mutate(MY_INFO_ENDPOINT);

                toast.success("Social account added");

                return apiRes;
              },
            },
          ]
        );

        throw new Error("Connecting failed or aborted");
      } else {
        Alert.alert(
          error.response?.data?.error?.message ??
            "Something went wrong. Please try again"
        );
        // since we're awaiting the promise, we need to throw
        throw new Error("Connecting failed or aborted");
      }
    }
  } else {
    throw new Error("Connecting failed or aborted");
  }
};

const handleTwitterAccountAdd = async (Alert: any, mutate: any) => {
  const res = await authenticateWithTwitter();
  if (res) {
    const { token, redirectUri } = res;
    try {
      const apiRes = await axios({
        url: `/v1/profile/accounts/token`,
        method: "POST",
        data: {
          provider: "twitter",
          access_token: token,
          redirect_uri: redirectUri,
        },
      });
      mutate(MY_INFO_ENDPOINT);

      toast.success("Social account added");
      return apiRes;
    } catch (error: any) {
      Logger.error("Add social error", error);

      if (error?.response.status === 420 || error?.response.status === 400) {
        Alert.alert(
          `This account is already linked to another Showtime account`,
          `Would you like to link it to this account? \n\n By doing so, you will lose your access to the previous account`,
          [
            { text: "Cancel" },
            {
              text: "Confirm",
              onPress: async () => {
                const apiRes = await axios({
                  url: `/v1/profile/accounts/token`,
                  method: "POST",
                  data: {
                    provider: "twitter",
                    access_token: token,
                    redirect_uri: redirectUri,
                    reassign_token: true,
                  },
                });
                mutate(MY_INFO_ENDPOINT);

                toast.success("Social account added");

                return apiRes;
              },
            },
          ]
        );

        throw new Error("Connecting failed or aborted");
      } else {
        Alert.alert(
          error.response?.data?.error?.message ??
            "Something went wrong. Please try again"
        );
        // since we're awaiting the promise, we need to throw
        throw new Error("Connecting failed or aborted");
      }
    }
  }
};
