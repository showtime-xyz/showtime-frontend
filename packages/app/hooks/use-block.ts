import { useCallback } from "react";
import { useSWRConfig } from "swr";

import { axios } from "app/lib/axios";
import { useToast } from "design-system/toast";

function useBlock() {
  const toast = useToast();
  const { mutate } = useSWRConfig();

  const block = useCallback(
    async (userId: number) => {
      await axios({
        url: `/v1/block_profile`,
        method: "POST",
        data: { blocked_profile_id: userId },
      });
      mutate(null);
      toast?.show({ message: "Blocked!", hideAfter: 4000 });
    },
    [toast, mutate]
  );

  const unblock = useCallback(
    async (userId: number) => {
      await axios({
        url: `/v1/unblock_profile`,
        method: "POST",
        data: { blocked_profile_id: userId },
      });
      mutate(null);
      toast?.show({ message: "Unblocked!", hideAfter: 4000 });
    },
    [toast, mutate]
  );

  return {
    block,
    unblock,
  };
}

export { useBlock };
