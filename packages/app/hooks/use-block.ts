import { useCallback } from "react";

import { useAlert } from "@showtime-xyz/universal.alert";

import { axios } from "app/lib/axios";

import { toast } from "design-system/toast";

import { useNavigateToLogin } from "../navigation/use-navigate-to";
import { useUser } from "./use-user";

type ToggleBlockUserParams = {
  isBlocked: boolean;
  creatorId?: number;
  name?: string;
  /**
   * on blocked success callback
   */
  onBlocked?: () => void;
};
function useBlock() {
  //#region hooks
  // const { mutate } = useSWRConfig();
  const { user, mutate, isAuthenticated } = useUser();
  const navigateToLogin = useNavigateToLogin();
  const Alert = useAlert();
  //#endregion

  //#region methods
  const getIsBlocked = useCallback(
    function isBlocked(userId?: number) {
      return userId === undefined
        ? false
        : user?.data.blocked_profile_ids.includes(userId) ?? false;
    },
    [user?.data?.blocked_profile_ids]
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
      toast("Blocked!");
    },
    [mutate]
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
      toast("Blocked!");
    },
    [mutate]
  );
  const toggleBlock = useCallback(
    async function toggleBlock({
      isBlocked,
      creatorId,
      name,
      onBlocked,
    }: ToggleBlockUserParams) {
      if (!creatorId) return;
      if (!isAuthenticated) return navigateToLogin();
      if (isBlocked) {
        await unblock(creatorId);
      } else {
        Alert.alert(`Block ${name ? `@${name}` : ""}?`, "", [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Block",
            style: "destructive",
            onPress: async () => {
              await block(creatorId);
              onBlocked?.();
            },
          },
        ]);
      }
    },
    [Alert, block, isAuthenticated, navigateToLogin, unblock]
  );
  //#endregion
  return {
    getIsBlocked,
    block,
    unblock,
    toggleBlock,
  };
}

export { useBlock };
