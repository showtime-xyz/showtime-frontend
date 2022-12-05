import { useCallback } from "react";

import { axios } from "../lib/axios";
import { Logger } from "../lib/logger";

export const NOTIFICATIONS_FOLLOW_KEY = "/";

export function useNotificationsFollow() {
  //#region hooks
  const notificationsFollow = useCallback(
    async (profileId: number | undefined) => {
      try {
        await axios({
          url: `/v1/notifications/follow`,
          method: "POST",
          data: {
            creator_profile_id: profileId,
          },
        });
      } catch (err) {
        Logger.error(err);
      }
    },
    []
  );
  const notificationsUnfollow = useCallback(
    async (profileId: number | undefined) => {
      try {
        await axios({
          url: `/v1/notifications/unfollow`,
          method: "POST",
          data: { creator_profile_id: profileId },
        });
      } catch (err) {
        Logger.error(err);
      }
    },
    []
  );
  //#endregion

  return {
    notificationsFollow,
    notificationsUnfollow,
  };
}
