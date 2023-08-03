import { useMemo } from "react";

import axios from "axios";
import useSWR from "swr";

const fetcher = (key: string) =>
  axios
    .get(`${process.env.NEXT_PUBLIC_KV_REST_API_URL}/get/${key}`, {
      headers: {
        Authorization: "Bearer " + process.env.NEXT_PUBLIC_KV_REST_API_TOKEN,
      },
    })
    .then((res) => res.data);

export function useKV<T = any>(key: string) {
  const { data, ...rest } = useSWR<{ result: string }>(key, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    focusThrottleInterval: 100000,
  });

  const result = useMemo(() => {
    if (!data?.result) return null;
    return JSON.parse(data?.result) as T;
  }, [data?.result]);

  return {
    data: result,
    ...rest,
  };
}
