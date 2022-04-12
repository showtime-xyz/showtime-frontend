import { useCallback } from "react";

import { axios } from "app/lib/axios";

import { useToast } from "design-system/toast";

import { useUser } from "./use-user";

function useBlock() {
  //#region hooks
  const toast = useToast();
  // const { mutate } = useSWRConfig();
  const { user, mutate } = useUser();
  //#endregion

  //#region methods
  const getIsBlocked = useCallback(
    function isBlocked(userId?: number) {
      return userId === undefined
        ? false
        : user?.data.blocked_profile_ids.includes(userId) ?? false;
    },
    [user?.data.blocked_profile_ids]
  );
  const block = useCallback(
    async function block(userId?: number) {
      if (userId === undefined) {
        return;
      }

      await axios({
        url: `/v1/block_profile`,
        method: "POST",
        data: { blocked_profile_id: userId },
      });

      // mutate user data
      mutate(
        (data) => ({
          data: {
            ...data!.data,
            blocked_profile_ids: [...data!.data.blocked_profile_ids, userId],
          },
        }),
        true
      );
      toast?.show({ message: "Blocked!", hideAfter: 4000 });
    },
    [toast, mutate]
  );
  const unblock = useCallback(
    async function unblock(userId?: number) {
      if (userId === undefined) {
        return;
      }
      await axios({
        url: `/v1/unblock_profile`,
        method: "POST",
        data: { blocked_profile_id: userId },
      });

      // mutate user data
      mutate(
        (data) => ({
          data: {
            ...data!.data,
            blocked_profile_ids: data!.data.blocked_profile_ids.filter(
              (id) => id !== userId
            ),
          },
        }),
        false
      );
      toast?.show({ message: "Unblocked!", hideAfter: 4000 });
    },
    [toast, mutate]
  );
  //#endregion

  return {
    getIsBlocked,
    block,
    unblock,
  };
}

export { useBlock };
