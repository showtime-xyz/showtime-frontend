import useSWR from "swr";

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
