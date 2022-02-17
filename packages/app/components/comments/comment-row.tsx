import { Fragment, memo, useCallback, useMemo, useState } from "react";

import { useComment } from "app/hooks/api/use-comment";
import { CommentType } from "app/hooks/api/use-comments";
import { useUser } from "app/hooks/use-user";
import { useRouter } from "app/navigation/use-router";

import { MessageRow } from "design-system/messages/message-row";

interface CommentRowProps {
  comment: CommentType;
}

function CommentRowComponent({ comment }: CommentRowProps) {
  //#region state
  const [likeCount, setLikeCount] = useState(comment.like_count);
  //#endregion

  //#region hooks
  const { isAuthenticated, user } = useUser();
  const router = useRouter();
  const { likeComment, unlikeComment, deleteComment } = useComment(
    comment.comment_id
  );
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
        await unlikeComment();
        setLikeCount((state) => state - 1);
      } else {
        await likeComment();
        setLikeCount((state) => state + 1);
      }
    },
    [isAuthenticated, isLikedByMe, likeComment, unlikeComment]
  );
  const handleOnDeletePress = useCallback(async function handleOnDeletePress() {
    await deleteComment();
  }, []);
  //#endregion

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
        replayCount={comment.replies?.length}
        hasReplies={comment.replies && comment.replies.length > 0}
        hasParent={comment.parent_id != undefined}
        createdAt={comment.added}
        onLikePress={handleOnLikePress}
        onDeletePress={isMyComment ? handleOnDeletePress : undefined}
      />
      {comment.replies?.length ?? 0 > 0
        ? comment.replies?.map((reply) => (
            <CommentRowComponent
              key={`comment-reply-${reply.comment_id}`}
              comment={reply}
            />
          ))
        : null}
    </Fragment>
  );
}

export const CommentRow = memo(CommentRowComponent);
CommentRow.displayName = "CommentRow";
