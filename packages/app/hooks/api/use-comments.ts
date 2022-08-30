import { useMemo, useCallback, useState } from "react";

import { useSWRConfig } from "swr";

import { useInfiniteListQuerySWR } from "app/hooks/use-infinite-list-query";
import { axios } from "app/lib/axios";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";
import { UserType } from "app/types";

export interface Liker {
  profile_id: number;
  verified: number;
  wallet_address: string;
  name: string;
  img_url: string;
  timestamp: string;
  username: string;
  comment_id: number;
}

export interface CommentType {
  comment_id: number;
  added: string;
  text: string;
  commenter_profile_id: number;
  nft_id: number;
  name: string;
  img_url: string;
  address: string;
  username: string;
  verified: number;
  like_count: number;
  likers: Liker[];
  parent_id?: number;
  replies?: CommentType[];
}

export interface Data {
  comments: CommentType[];
  has_more: boolean;
}

export interface CommentsPayload {
  data: Data;
}

export const useComments = (nftId?: number) => {
  //#region state
  const [isSubmitting, setIsSubmitting] = useState(false);
  //#endregion

  //#region hooks
  const { mutate } = useSWRConfig();
  const fetchCommentsURL = useCallback(
    function fetchCommentsURL() {
      // TODO: uncomment when pagination is fixed.
      // return `/v2/comments/${nftId}?limit=10&page=${index + 1}`;
      return nftId ? `/v2/comments/${nftId}` : null;
    },
    [nftId]
  );

  const {
    data,
    isLoading,
    isLoadingMore,
    isRefreshing,
    error,
    fetchMore,
    refresh,
    mutate: mutateComments,
  } = useInfiniteListQuerySWR<CommentsPayload>(fetchCommentsURL);
  const commentsCount = useMemo(() => {
    return data?.[0].data?.comments?.length ?? 0;
  }, [data]);
  //#endregion

  //#region callbacks
  const likeComment = useCallback(
    async function likeComment(commentId: number) {
      try {
        await axios({
          url: `/v1/likecomment/${commentId}`,
          method: "POST",
          data: {},
        });

        // mutate customer info
        mutate(
          MY_INFO_ENDPOINT,
          (data: UserType): UserType => ({
            data: {
              ...data.data,
              likes_comment: [...data.data.likes_comment, commentId],
            },
          }),
          true
        );

        return true;
      } catch (error) {
        return false;
      }
    },
    [mutate]
  );
  const unlikeComment = useCallback(
    async function unlikeComment(commentId: number) {
      try {
        await axios({
          url: `/v1/unlikecomment/${commentId}`,
          method: "POST",
          data: {},
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
          true
        );

        return true;
      } catch (error) {
        return false;
      }
    },
    [mutate]
  );
  const deleteComment = useCallback(
    async function deleteComment(commentId: number) {
      await axios({
        url: `/v1/deletecomment/${commentId}`,
        method: "POST",
        data: {},
      });

      mutateComments((data) => {
        if (data?.[0].data?.comments) {
          data[0].data.comments = deleteCommentRecursively(
            commentId,
            data[0].data.comments
          );
        }
        return data;
      }, true);
    },
    [mutateComments]
  );

  const newComment = useCallback(
    async function newComment(message: string, parentId: number | null = null) {
      try {
        setIsSubmitting(true);
        await axios({
          url: `/v1/newcomment/${nftId}`,
          method: "POST",
          data: JSON.stringify({
            message,
            parent_id: parentId,
          }),
        });

        // mutate comments
        mutateComments();

        // mutate user info
        // TODO: add parent id to user comments list
        // mutate(
        //   MY_INFO_ENDPOINT,
        //   (data: UserType): UserType => ({
        //     data: {
        //       ...data.data,
        //       comments: [...data.data.comments],
        //     },
        //   }),
        //   true
        // );
        setIsSubmitting(false);
      } catch (error) {
        setIsSubmitting(false);
        throw error;
      }
    },
    [nftId, mutateComments]
  );
  //#endregion

  return {
    error,
    data: data?.[0].data,

    isSubmitting,
    isLoading,
    isLoadingMore,
    isRefreshing,

    commentsCount,

    refresh,
    fetchMore,

    likeComment,
    unlikeComment,
    deleteComment,
    newComment,
  };
};

const deleteCommentRecursively = (
  commentId: number,
  comments?: CommentType[]
) => {
  return (
    comments?.reduce((result, comment) => {
      if (comment.comment_id == commentId) {
        return result;
      }

      if (comment.replies && comment.replies.length > 0) {
        comment.replies = deleteCommentRecursively(commentId, comment.replies);
      }

      result.push(comment);
      return result;
    }, [] as CommentType[]) || []
  );
};
