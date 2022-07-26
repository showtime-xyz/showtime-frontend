import { useCallback } from "react";

import { useUserProfile } from "./api-hooks";

function useFollow({ username }: { username?: string }) {
  //#region hooks
  const { mutate } = useUserProfile({ address: username });
  //#endregion

  //#region methods
  const onToggleFollow = useCallback(() => {
    mutate();
  }, [mutate]);
  //#endregion

  return {
    onToggleFollow,
  };
}

export { useFollow };
