import axios from "axios";
import useSWR from "swr";

type LinkOptions = {
  icon_url: string;
  id: number;
  name: string;
  prefix: string;
};

export const useLinkOptions = () => {
  const state = useSWR(
    "/v1/link_options",
    (url) => {
      return axios.get<LinkOptions[]>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`
      );
    },
    { revalidateOnFocus: false }
  );

  return state;
};
