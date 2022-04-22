import useSWR from "swr";
import useUnmountSignal from "use-unmount-signal";

import { axios } from "app/lib/axios";

export interface Liker {
  profile_id: number;
  verified: number;
  wallet_address: string;
  name: string;
  img_url: string;
  timestamp: Date;
  username: string;
}

export interface Data {
  likers: Liker[];
}

interface LikesPayload {
  data: Data;
}

export function useLikes(nftId?: number) {
  const unmountSignal = useUnmountSignal();
  const { data, error } = useSWR<LikesPayload>(
    nftId ? "/v1/likes/" + nftId : null,
    (url) => axios({ url, method: "GET", unmountSignal })
  );

  return {
    data: data?.data,
    loading: !data,
    error,
  };
}
