import { Fragment, memo, useCallback, useMemo, useState } from "react";

import { CommentType } from "app/hooks/api/use-comments";
import { useUser } from "app/hooks/use-user";
import { useRouter } from "app/navigation/use-router";

import { MessageRow } from "design-system/messages/message-row";

interface CommentRowProps {
  comment: CommentType;
  isLastReply?: boolean;

  likeComment: (id: number) => Promise<boolean>;
  unlikeComment: (id: number) => Promise<boolean>;
  deleteComment: (id: number) => Promise<void>;
}

function CommentRowComponent({
  comment,
  isLastReply,
  likeComment,
  unlikeComment,
  deleteComment,
}: CommentRowProps) {
  //#region state
  const [likeCount, setLikeCount] = useState(comment.like_count);
  //#endregion

  //#region hooks
  const { isAuthenticated, user } = useUser();
  const router = useRouter();
  //#region

  //#region variables
  const isMyComment = useMemo(
    () => user?.data.profile.profile_id === comment.commenter_profile_id,
    [user, comment.commenter_profile_id]
  );
  const isLikedByMe = useMemo(
    () => user?.data.likes_comment.includes(comment.comment_id),
    [user, comment.comment_id]
  );
  //#endregion

  //#region callbacks
  const handleOnLikePress = useCallback(
    async function handleOnLikePress() {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      if (isLikedByMe) {
        await unlikeComment(comment.comment_id);
        setLikeCount((state) => state - 1);
      } else {
        await likeComment(comment.comment_id);
        setLikeCount((state) => state + 1);
      }
    },
    [
      comment.comment_id,
      isAuthenticated,
      isLikedByMe,
      likeComment,
      unlikeComment,
    ]
  );
  const handleOnDeletePress = useCallback(
    async function handleOnDeletePress() {
      await deleteComment(comment.comment_id);
    },
    [comment.comment_id]
  );
  //#endregion

  const isReply = comment.parent_id !== undefined;
  return (
    <Fragment key={comment.comment_id}>
      <MessageRow
        username={
          comment.username && comment.username.length > 0
            ? comment.username
            : comment.address.substring(0, 8)
        }
        userAvatar={comment.img_url}
        userVerified={comment.verified as any}
        content={comment.text}
        likeCount={Math.max(0, likeCount)}
        replayCount={isReply ? undefined : comment.replies?.length}
        hasReplies={
          isReply ? false : comment.replies && comment.replies.length > 0
        }
        hasParent={isReply}
        likedByMe={isLikedByMe}
        createdAt={comment.added}
        position={isLastReply ? "last" : undefined}
        onLikePress={handleOnLikePress}
        onDeletePress={isMyComment ? handleOnDeletePress : undefined}
      />
      {!isReply && (comment.replies?.length ?? 0) > 0
        ? comment.replies?.map((reply, index) => (
            <CommentRowComponent
              key={`comment-reply-${reply.comment_id}`}
              comment={reply}
              isLastReply={index === (comment.replies?.length ?? 0) - 1}
              likeComment={likeComment}
              unlikeComment={unlikeComment}
              deleteComment={deleteComment}
            />
          ))
        : null}
    </Fragment>
  );
}

export const CommentRow = memo(CommentRowComponent);
CommentRow.displayName = "CommentRow";
