import { useCallback } from "react";

import { useSWRConfig } from "swr";

import { axios } from "app/lib/axios";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";
import { UserType } from "app/types";

export function useComment(commentId: number) {
  //#region hooks
  const { mutate } = useSWRConfig();
  //#endregion

  //#region callbacks
  const likeComment = useCallback(async function likeComment() {
    try {
      await axios({
        url: `/v1/likecomment/${commentId}`,
        method: "POST",
      });

      // mutate local data
      mutate(
        MY_INFO_ENDPOINT,
        (data: UserType): UserType => ({
          data: {
            ...data.data,
            likes_comment: [...data.data.likes_comment, commentId],
          },
        }),
        false
      );

      return true;
    } catch (error) {
      return false;
    }
  }, []);
  const unlikeComment = useCallback(async function unlikeComment() {
    try {
      await axios({
        url: `/v1/unlikecomment/${commentId}`,
        method: "POST",
      });

      // mutate local data
      mutate(
        MY_INFO_ENDPOINT,
        (data: UserType): UserType => ({
          data: {
            ...data.data,
            likes_comment: data.data.likes_comment.filter(
              (item) => item !== commentId
            ),
          },
        }),
        false
      );

      return true;
    } catch (error) {
      return false;
    }
  }, []);
  const deleteComment = useCallback(async function deleteComment() {
    try {
      await axios({
        url: `/v1/deletecomment/${commentId}`,
        method: "POST",
      });
      return true;
    } catch (error) {
      return false;
    }
  }, []);
  //#endregion

  return { likeComment, unlikeComment, deleteComment };
}
