import { useCallback } from "react";

import { useInfiniteListQuerySWR } from "../use-infinite-list-query";

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

export const useComments = ({ nftId }: { nftId: number }) => {
  //#region callbacks
  const commentsAPICall = useCallback(
    function commentsAPICall(index) {
      const url = `/v2/comments/${nftId}?limit=10&page=${index + 1}`;
      return url;
    },
    [nftId]
  );
  //#endregion

  const queryState = useInfiniteListQuerySWR<CommentsPayload>(commentsAPICall);

  return queryState;
};
