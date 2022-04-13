import { Fragment, memo, useCallback, useMemo, useState } from "react";
import { Platform } from "react-native";

import { CommentType } from "app/hooks/api/use-comments";
import { useUser } from "app/hooks/use-user";
import { useRouter } from "app/navigation/use-router";
import { formatAddressShort, getRoundedCount } from "app/utilities";

import { MessageMore } from "design-system/messages/message-more";
import { MessageRow } from "design-system/messages/message-row";

interface CommentRowProps {
  comment: CommentType;
  isLastReply?: boolean;

  likeComment: (id: number) => Promise<boolean>;
  unlikeComment: (id: number) => Promise<boolean>;
  deleteComment: (id: number) => Promise<void>;
  // eslint-disable-next-line no-unused-vars
  reply?: (comment: CommentType) => void;
}

const REPLIES_PER_BATCH = 2;

function CommentRowComponent({
  comment,
  isLastReply,
  likeComment,
  unlikeComment,
  deleteComment,
  reply,
}: CommentRowProps) {
  //#region state
  const [likeCount, setLikeCount] = useState(comment.like_count);
  const [displayedRepliesCount, setDisplayedRepliesCount] =
    useState(REPLIES_PER_BATCH);
  //#endregion

  //#region hooks
  const { isAuthenticated, user } = useUser();
  const router = useRouter();
  //#endregion

  //#region variables
  const repliesCount = comment.replies?.length ?? 0;
  const replies = useMemo(
    () =>
      repliesCount > 0 ? comment.replies!.slice(0, displayedRepliesCount) : [],
    [comment.replies, repliesCount, displayedRepliesCount]
  );
  const isMyComment = useMemo(
    () => user?.data.profile.profile_id === comment.commenter_profile_id,
    [user, comment.commenter_profile_id]
  );
  const isRepliedByMe = useMemo(
    () => user?.data.comments.includes(comment.comment_id),
    [user]
  );
  const isLikedByMe = useMemo(
    () => user?.data.likes_comment.includes(comment.comment_id),
    [user, comment.comment_id]
  );
  const isReply = comment.parent_id !== null && comment.parent_id !== undefined;
  //#endregion

  //#region callbacks
  const handleOnLikePress = useCallback(
    async function handleOnLikePress() {
      if (!isAuthenticated) {
        router.push(
          Platform.select({
            native: "/login",
            web: {
              pathname: router.pathname,
              query: { ...router.query, login: true },
            },
          }),
          "/login",
          { shallow: true }
        );
        return;
      }

      if (isLikedByMe) {
        await unlikeComment(comment.comment_id);
        setLikeCount((state) => Math.max(state - 1, 0));
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
  const handelOnLoadMoreRepliesPress = useCallback(() => {
    setDisplayedRepliesCount((state) => state + REPLIES_PER_BATCH);
  }, []);
  const handleOnReplyPress = useCallback(() => {
    if (!isAuthenticated) {
      router.push(
        Platform.select({
          native: "/login",
          web: {
            pathname: router.pathname,
            query: { ...router.query, login: true },
          },
        }),
        "/login",
        { shallow: true }
      );
      return;
    }

    if (reply) {
      reply(comment);
    }
  }, [reply, comment, isAuthenticated]);
  const handleOnUserPress = useCallback((username: string) => {
    router.push(`/@${username}`);
  }, []);
  //#endregion

  return (
    <Fragment key={comment.comment_id}>
      <MessageRow
        username={
          comment.username && comment.username.length > 0
            ? comment.username
            : formatAddressShort(comment.address)
        }
        userAvatar={comment.img_url}
        userVerified={comment.verified as any}
        content={comment.text}
        likeCount={getRoundedCount(Math.max(0, likeCount))}
        replayCount={
          isReply ? undefined : getRoundedCount(comment.replies?.length)
        }
        hasReplies={
          isReply ? false : comment.replies && comment.replies.length > 0
        }
        hasParent={isReply}
        likedByMe={isLikedByMe}
        repliedByMe={isRepliedByMe}
        createdAt={comment.added}
        position={isLastReply ? "last" : undefined}
        onLikePress={handleOnLikePress}
        onDeletePress={isMyComment ? handleOnDeletePress : undefined}
        onReplyPress={handleOnReplyPress}
        onTagPress={handleOnUserPress}
        onUserPress={handleOnUserPress}
      />
      {!isReply
        ? replies.map((reply, index) => (
            <CommentRowComponent
              key={`comment-reply-${reply.comment_id}`}
              comment={reply}
              isLastReply={index === (replies.length ?? 0) - 1}
              likeComment={likeComment}
              unlikeComment={unlikeComment}
              deleteComment={deleteComment}
            />
          ))
        : null}

      {!isReply && repliesCount > displayedRepliesCount ? (
        <MessageMore
          count={repliesCount - displayedRepliesCount}
          onPress={handelOnLoadMoreRepliesPress}
        />
      ) : null}
    </Fragment>
  );
}

export const CommentRow = memo(CommentRowComponent);
CommentRow.displayName = "CommentRow";
