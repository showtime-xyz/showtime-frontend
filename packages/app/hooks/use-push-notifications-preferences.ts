import useSWR from "swr";

import { fetcher } from "./use-infinite-list-query";

export function usePushNotificationsPreferences() {
  const { data, error, mutate } = useSWR<any>(
    "/v1/notifications/preferences/push",
    fetcher
  );

  return {
    data: data,
    loading: !data,
    error,
    refresh: mutate,
  };
}
