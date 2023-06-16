import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { axios } from "app/lib/axios";

import { fetcher } from "./use-infinite-list-query";

export function usePushNotificationsPreferences() {
  const { data, error, mutate, isLoading } = useSWR<any>(
    "/v1/notifications/preferences/push",
    fetcher
  );

  return {
    data: data,
    loading: !data,
    isLoading,
    error,
    refresh: mutate,
  };
}

async function editPushSettings(
  url: string,
  { arg }: { arg: { pushKey: any; pushValue: boolean } }
) {
  return axios({
    url: `/v1/notifications/preferences/push`,
    method: "PATCH",
    data: {
      [arg.pushKey]: arg.pushValue,
    },
  });
}

export const useEditPushNotificationsPreferences = () => {
  const { trigger, isMutating, error } = useSWRMutation(
    `/v1/notifications/preferences/push`,
    editPushSettings
  );

  return {
    trigger,
    isMutating,
    error,
  };
};
