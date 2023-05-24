import { useMemo, useCallback, useState } from "react";

import { useSWRConfig } from "swr";

import { useInfiniteListQuerySWR } from "app/hooks/use-infinite-list-query";
import { Analytics, EVENTS } from "app/lib/analytics";
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
  next_page: number | null;
  count: number;
}

export type CommentsPayload = Data;

export const useComments = (nftId?: number) => {
  const PAGE_SIZE = 20;
  //#region state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);
  const [isReachingEnd, setIsReachingEnd] = useState(false);

  //#endregion

  //#region hooks
  const { mutate } = useSWRConfig();
  const fetchCommentsURL = useCallback(
    (index: number, previousPageData: any) => {
      if (previousPageData && !previousPageData?.comments.length) return null;
      return `/v3/comments/${nftId}?page=${index + 1}&limit=${PAGE_SIZE}`;
    },
    [nftId]
  );

  const {
    data,
    isLoading,
    isLoadingMore,
    isRefreshing,
    error,
    fetchMore: fetchMoreComments,
    refresh,
    mutate: mutateComments,
  } = useInfiniteListQuerySWR<CommentsPayload>(fetchCommentsURL, {
    pageSize: PAGE_SIZE,
  });

  const newData = useMemo(() => {
    let newData: any = [];
    if (data) {
      const lastData = data[data.length - 1];
      setCommentsCount(lastData.count ?? 0);
      setIsReachingEnd(!lastData?.next_page);
      data.forEach((p) => {
        if (p) {
          newData = newData.concat(p.comments);
        }
      });
    }
    return newData;
  }, [data]);
  const fetchMore = async () => {
    if (isReachingEnd) return;
    await fetchMoreComments();
  };
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

        Analytics.track(EVENTS.USER_LIKED_COMMENT);

        // mutate customer info
        mutate<any>(
          MY_INFO_ENDPOINT,
          (data?: UserType) => {
            if (data) {
              return {
                data: {
                  ...data.data,
                  likes_comment: [...data.data.likes_comment, commentId],
                },
              };
            }
          },
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
        Analytics.track(EVENTS.USER_UNLIKED_COMMENT);

        // mutate local data
        mutate<any>(
          MY_INFO_ENDPOINT,
          (data?: UserType) => {
            if (data) {
              return {
                data: {
                  ...data.data,
                  likes_comment: data.data.likes_comment.filter(
                    (item) => item !== commentId
                  ),
                },
              };
            }
          },
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
        if (data?.[0]?.comments) {
          data[0].comments = deleteCommentRecursively(
            commentId,
            data[0].comments
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
    data: newData,
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
