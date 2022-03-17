import { useCallback } from "react";

import { useFetchOnAppForeground } from "../use-fetch-on-app-foreground";

export function useNonce() {
  const fetchOnAppForeground = useFetchOnAppForeground();

  const getNonce = useCallback(async function getNonce(address: string) {
    const response = await fetchOnAppForeground({
      url: `/v1/getnonce?address=${address}`,
      method: "GET",
    });

    return response.data as string;
  }, []);
  const rotateNonce = useCallback(async function expireNonce(address: string) {
    await fetchOnAppForeground({
      url: `/v1/rotatenonce?address=${address}`,
      method: "POST",
      data: {},
    });
  }, []);

  return { getNonce, rotateNonce };
}
