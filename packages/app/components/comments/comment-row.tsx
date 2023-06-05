import { memo, useCallback, useMemo, useState, useRef } from "react";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useRouter } from "@showtime-xyz/universal.router";

import { MessageMore } from "app/components/messages/message-more";
import { MessageRow } from "app/components/messages/message-row";
import { CommentType } from "app/hooks/api/use-comments";
import { useUser } from "app/hooks/use-user";
import { useNavigateToLogin } from "app/navigation/use-navigate-to";
import { formatNumber } from "app/utilities";

interface CommentRowProps {
  comment: CommentType;
  isLastReply?: boolean;

  likeComment: (id: number) => Promise<boolean>;
  unlikeComment: (id: number) => Promise<boolean>;
  deleteComment: (id: number) => Promise<void>;
  reply?: (comment: CommentType) => void;
  creatorId?: number;
  isReply?: boolean;
}

const REPLIES_PER_BATCH = 2;

function CommentRowComponent({
  comment,
  isLastReply,
  likeComment,
  unlikeComment,
  deleteComment,
  reply,
  creatorId,
  isReply,
}: CommentRowProps) {
  /**
   * we used memo, so needs to add this hooks to here,
   * otherwise some page switching theme will be invalid
   */
  useIsDarkMode();
  //#region state
  const lastItemId = useRef<number>(comment.id);
  const [likeCount, setLikeCount] = useState(comment.like_count);
  const [isLikedByMe, setIsLikedByMe] = useState(comment.self_liked);
  console.log(creatorId);

  const [displayedRepliesCount, setDisplayedRepliesCount] =
    useState(REPLIES_PER_BATCH);

  // This part here is important for FlashList, since state gets recycled
  // we need to reset the state when the comment changes
  // I had to remove `key` from CommentRow (Parent) and here, on View,
  // because it was breaking recycling
  // https://shopify.github.io/flash-list/docs/recycling/
  if (comment.id !== lastItemId.current) {
    lastItemId.current = comment.id;
    setLikeCount(comment.like_count);
    setDisplayedRepliesCount(REPLIES_PER_BATCH);
  }
  //#endregion

  //#region hooks
  const { isAuthenticated, user } = useUser();
  const router = useRouter();
  const navigateToLogin = useNavigateToLogin();
  //#endregion

  //#region variables
  const isDropCreator = useMemo(
    () => creatorId === user?.data.profile.profile_id,
    [creatorId, user?.data.profile.profile_id]
  );

  const repliesCount = comment.replies?.length ?? 0;

  const replies = useMemo(
    () =>
      repliesCount > 0 ? comment.replies!.slice(0, displayedRepliesCount) : [],
    [comment.replies, repliesCount, displayedRepliesCount]
  );

  const isMyComment = useMemo(
    () => user?.data.profile.profile_id === comment.commenter_profile,
    [user, comment.commenter_profile]
  );

  const isRepliedByMe = useMemo(
    () => user?.data.comments.includes(comment.id),
    [user, comment.id]
  );

  //#endregion

  //#region callbacks
  const handleOnLikePress = useCallback(
    async function handleOnLikePress() {
      if (!isAuthenticated) {
        navigateToLogin();
        return;
      }
      const handler = isLikedByMe ? unlikeComment : likeComment;
      const isSuccessed = await handler(comment.id);
      if (isSuccessed) {
        setLikeCount((state) => Math.max(state + (isLikedByMe ? -1 : 1), 0));
        setIsLikedByMe(!isLikedByMe);
      }
    },
    [
      comment.id,
      isAuthenticated,
      isLikedByMe,
      likeComment,
      navigateToLogin,
      unlikeComment,
    ]
  );

  const handleOnDeletePress = useCallback(async () => {
    return await deleteComment(comment.id);
  }, [comment.id, deleteComment]);

  const handelOnLoadMoreRepliesPress = useCallback(() => {
    setDisplayedRepliesCount((state) => state + REPLIES_PER_BATCH);
  }, []);

  const handleOnReplyPress = useCallback(() => {
    if (!isAuthenticated) {
      navigateToLogin();
      return;
    }

    if (reply) {
      reply(comment);
    }
  }, [reply, comment, isAuthenticated, navigateToLogin]);

  const handleOnReplyOnAReply = useCallback(
    (replyComment: CommentType) => {
      reply?.({ ...comment, username: replyComment.username });
    },
    [reply, comment]
  );

  const handleOnUserPress = useCallback((username: string) => {
    router.push(`/@${username}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //#endregion
  return (
    <>
      <MessageRow
        address={comment.address}
        username={comment.username}
        userAvatar={comment.img_url}
        userVerified={comment.verified as any}
        content={comment.text}
        likeCount={formatNumber(Math.max(0, likeCount))}
        replyCount={isReply ? undefined : comment.replies?.length ?? 0}
        hasReplies={
          isReply ? false : comment.replies && comment.replies.length > 0
        }
        hasParent={isReply}
        likedByMe={isLikedByMe}
        repliedByMe={isRepliedByMe}
        createdAt={comment.added}
        position={isLastReply ? "last" : undefined}
        onLikePress={handleOnLikePress}
        onDeletePress={
          isMyComment || isDropCreator ? handleOnDeletePress : undefined
        }
        onReplyPress={handleOnReplyPress}
        onTagPress={handleOnUserPress}
        onUserPress={handleOnUserPress}
        isLastReply={isLastReply}
      />
      {!isReply
        ? replies.map((reply, index) => (
            // only index as key when using map with FlashList
            // https://shopify.github.io/flash-list/docs/fundamentals/performant-components#remove-key-prop
            <CommentRow
              key={index}
              comment={reply}
              isLastReply={index === (replies.length ?? 0) - 1}
              likeComment={likeComment}
              unlikeComment={unlikeComment}
              deleteComment={deleteComment}
              reply={handleOnReplyOnAReply}
              creatorId={creatorId}
              isReply
            />
          ))
        : null}

      {!isReply && repliesCount > displayedRepliesCount ? (
        <MessageMore
          count={repliesCount - displayedRepliesCount}
          onPress={handelOnLoadMoreRepliesPress}
        />
      ) : null}
    </>
  );
}

export const CommentRow = memo(CommentRowComponent);
CommentRow.displayName = "CommentRow";
