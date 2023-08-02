import { useMemo } from "react";

import axios from "axios";
import useSWR from "swr";

export type Banner = {
  type: "profile" | "drop" | "link";
  username: string;
  slug: string;
  link: string;
  image: string;
};

const fetcher = (key: string) =>
  axios
    .get(`${process.env.NEXT_PUBLIC_KV_REST_API_URL}/get/${key}`, {
      headers: {
        Authorization: "Bearer " + process.env.NEXT_PUBLIC_KV_REST_API_TOKEN,
      },
    })
    .then((res) => res.data);

export function useKV<T = any>(key: string) {
  const { data, ...rest } = useSWR<{ result: string }>(key, fetcher);

  const result = useMemo(() => {
    if (!data?.result) return null;
    return JSON.parse(data?.result) as T;
  }, [data?.result]);

  return {
    data: result,
    ...rest,
  };
}
