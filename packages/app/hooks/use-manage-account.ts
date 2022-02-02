import { useCallback } from "react";
import { useToast } from "design-system/toast";
import { axios } from "app/lib/axios";
import { useSWRConfig } from "swr";
import { USER_API_KEY } from "app/hooks/use-user";

export function useManageAccount() {
  const toast = useToast();
  const { mutate } = useSWRConfig();

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

        mutate(USER_API_KEY);

        toast?.show({
          message: "Email added and will soon appear on your profile",
          hideAfter: 4000,
        });
      } catch (error) {
        toast?.show({
          message:
            "Unable to add the email to your profile at this time, please try again",
          hideAfter: 4000,
        });
      }
    },
    [toast]
  );

  const removeAccount = useCallback(
    async (address: string) => {
      try {
        await axios({
          url: "/v1/removewallet",
          method: "POST",
          data: { address },
        });

        mutate(USER_API_KEY);

        toast?.show({
          message: "Account removed and will disappear from your profile soon",
          hideAfter: 4000,
        });
      } catch (error) {
        toast?.show({
          message:
            "Unable to remove the selected account at this time, please try again",
          hideAfter: 4000,
        });
      }
    },
    [toast]
  );

  return { addEmail, removeAccount };
}
