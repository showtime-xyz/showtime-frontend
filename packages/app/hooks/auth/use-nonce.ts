import { useCallback } from "react";
import { axios } from "app/lib/axios";

export function useNonce() {
  const getNonce = useCallback(async function getNonce(address: string) {
    const response = await axios({
      url: `/v1/getnonce?address=${address}`,
      method: "GET",
    });

    return response.data as string;
  }, []);
  const rotateNonce = useCallback(async function expireNonce(address: string) {
    await axios({
      url: `/v1/rotatenonce?address=${address}`,
      method: "POST",
    });
  }, []);

  return { getNonce, rotateNonce };
}
