import { useCallback, useContext } from "react";

import { Alert } from "@showtime-xyz/universal.alert";

import { axios } from "app/lib/axios";

export type EditDropDetailParams = {
  title: string;
  description: string;
};

export const useDropEditDetails = () => {
  const editDropDetails = async (
    editionAddress?: string,
    params?: EditDropDetailParams,
    callback?: () => void
  ) => {
    if (!editionAddress) return { error: "No edition address" };
    const res = await axios({
      url: `/v1/edition/draft/${editionAddress}/edit`,
      method: "POST",
      data: {
        ...params,
      },
    });
    console.log(res);

    callback?.();
  };

  return {
    editDropDetails,
  };
};
