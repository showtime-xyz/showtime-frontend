import { useCallback } from "react";

import { useSWRConfig } from "swr";

import { useAlert } from "@showtime-xyz/universal.alert";
import { useToast } from "@showtime-xyz/universal.toast";

import { removeWalletFromBackend } from "app/lib/add-wallet";
import { axios } from "app/lib/axios";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";
import { obfuscatePhoneNumber } from "app/utilities";

import { Logger } from "../lib/logger";

export function useManageAccount() {
  const toast = useToast();
  const { mutate } = useSWRConfig();

  const Alert = useAlert();

  const addSocial = useCallback(
    async (did: string, type?: "twitter" | "google" | "apple") => {
      try {
        await axios({
          url: `/v1/magic/wallet`,
          method: "POST",
          // I am not proud of this
          data: { did },
          overrides: {
            forceAccessTokenAuthorization: true,
          },
        });

        mutate(MY_INFO_ENDPOINT);

        toast?.show({
          message: "Social account added",
          hideAfter: 4000,
        });
      } catch (error: any) {
        Logger.error("Add social error", error);

        if (error?.response.status === 420) {
          Alert.alert(
            `This ${type} account is already linked to another Showtime account`,
            `Would you like to link it to this account? \n\n By doing so, you will lose your access to the previous account`,
            [
              { text: "Cancel" },
              {
                text: "Confirm",
                onPress: async () => {
                  await axios({
                    url: `/v1/magic/wallet`,
                    method: "POST",
                    // I am not proud of this
                    data: { did, ["reassign_" + type + "_email"]: true },
                    overrides: {
                      forceAccessTokenAuthorization: true,
                    },
                  });

                  mutate(MY_INFO_ENDPOINT);

                  toast?.show({
                    message: "Social account added",
                    hideAfter: 4000,
                  });
                },
              },
            ]
          );
        }
      }
    },
    [toast, mutate, Alert]
  );

  const addEmail = useCallback(
    async (email: string, did: string) => {
      try {
        await axios({
          url: `/v1/magic/wallet`,
          method: "POST",
          data: { email, did },
          overrides: {
            forceAccessTokenAuthorization: true,
          },
        });

        mutate(MY_INFO_ENDPOINT);

        toast?.show({
          message: "Email added and will soon appear on your profile!",
          hideAfter: 4000,
        });
      } catch (error: any) {
        Logger.error("Add email error", error);

        if (error?.response?.status === 420) {
          Alert.alert(
            `This email account is already linked to another Showtime account`,
            `Please disconnect your email from another account or reach out to our support.`,
            [{ text: "Ok" }]
          );
        } else {
          toast?.show({
            message:
              error?.response?.data?.error?.message ??
              "Unable to add the email to your profile at this time, please try again!",
            hideAfter: 4000,
          });
        }
      }
    },
    [toast, mutate, Alert]
  );

  const verifyPhoneNumber = useCallback(
    async (phoneNumber: string, did: string) => {
      try {
        await axios({
          url: `/v1/magic/wallet`,
          method: "POST",
          data: { phone_number: phoneNumber, did },
          overrides: {
            forceAccessTokenAuthorization: true,
          },
        });

        mutate(MY_INFO_ENDPOINT);
        toast?.show({
          message: "Phone number successfully verified!",
          hideAfter: 4000,
        });
      } catch (error: any) {
        Logger.error("Add Phone error", error);
        // User has already linked this phone to another account so we ask whether we should reassign to this account.
        if (error?.response?.data?.error?.code === 420) {
          Alert.alert(
            "Phone number already linked to another account",
            `Would you like to link \n ${obfuscatePhoneNumber(
              phoneNumber
            )} \n to this account? \n\n By doing so, you will lose your access to the previous account`,
            [
              { text: "Cancel" },
              {
                text: "Confirm",
                onPress: async () => {
                  try {
                    await axios({
                      url: `/v1/magic/wallet`,
                      method: "POST",
                      data: {
                        phone_number: phoneNumber,
                        did,
                        reassign_phone_number: true,
                      },
                      overrides: {
                        forceAccessTokenAuthorization: true,
                      },
                    });
                    mutate(MY_INFO_ENDPOINT);
                    toast?.show({
                      message: "Phone number successfully verified!",
                      hideAfter: 4000,
                    });
                  } catch (e: any) {
                    toast?.show({
                      message:
                        e?.response?.data?.error?.message ??
                        "Unable to verify your phone number at this time, please try again!",
                      hideAfter: 4000,
                    });
                  }
                },
              },
            ]
          );
        } else {
          toast?.show({
            message:
              error?.response?.data?.error?.message ??
              "Unable to verify your phone number at this time, please try again!",
            hideAfter: 4000,
          });
        }
      }
    },
    [toast, mutate, Alert]
  );

  const removeAccount = useCallback(
    async (address: string) => {
      try {
        await removeWalletFromBackend(address);

        mutate(MY_INFO_ENDPOINT);

        toast?.show({
          message: "Account removed and will disappear from your profile soon",
          hideAfter: 4000,
        });
      } catch (error: any) {
        Logger.error("Remove account error", error);
        toast?.show({
          message:
            error?.response?.data?.error?.message ??
            "Unable to remove the selected account at this time, please try again",
          hideAfter: 4000,
        });
      }
    },
    [toast, mutate]
  );

  const removePhoneNumber = useCallback(
    async (address: string) => {
      try {
        await axios({
          url: `v2/wallet/${address}/remove`,
          method: "DELETE",
        });

        mutate(MY_INFO_ENDPOINT);
        toast?.show({
          message: "Phone number has removed",
          hideAfter: 4000,
        });
      } catch (error: any) {
        Logger.error("Remove Phone error", error);
        toast?.show({
          message:
            e?.response?.data?.error?.message ??
            "Unable to remove the phone number at this time, please try again",
          hideAfter: 4000,
        });
      }
    },
    [toast, mutate]
  );
  return {
    addEmail,
    verifyPhoneNumber,
    removeAccount,
    removePhoneNumber,
    addSocial,
  };
}
