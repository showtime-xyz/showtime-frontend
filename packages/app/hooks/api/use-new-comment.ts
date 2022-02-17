import { useCallback, useState } from "react";

import { axios } from "app/lib/axios";

export function useNewComment(nftId: number) {
  const [submitting, setSubmitting] = useState(false);

  //#region callbacks
  const newComment = useCallback(
    async function newComment(message: string, parentId: number | null = null) {
      try {
        setSubmitting(true);
        await axios({
          url: `/v1/newcomment/${nftId}`,
          method: "POST",
          data: JSON.stringify({
            message,
            parent_id: parentId,
          }),
        });
        setSubmitting(false);
        return true;
      } catch (error) {
        setSubmitting(false);
        return false;
      }
    },
    [nftId]
  );
  //#endregion

  return {
    submitting,
    newComment,
  };
}
