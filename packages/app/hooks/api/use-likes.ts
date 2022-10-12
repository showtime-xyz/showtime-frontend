import useSWR from "swr";
import useUnmountSignal from "use-unmount-signal";

import { axios } from "app/lib/axios";

import { UserItemType } from "./use-follow-list";

export interface Data {
  likers: UserItemType[];
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
