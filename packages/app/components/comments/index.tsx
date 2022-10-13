import { useCallback, useMemo, useRef, useEffect } from "react";
import { Platform, StyleSheet, TextInput } from "react-native";

import { ListRenderItemInfo } from "@shopify/flash-list";

import { useAlert } from "@showtime-xyz/universal.alert";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { View } from "@showtime-xyz/universal.view";

import { CommentRow } from "app/components/comments/comment-row";
import { CommentType, useComments } from "app/hooks/api/use-comments";
import { useModalListProps } from "app/hooks/use-modal-list-props";
import { useUser } from "app/hooks/use-user";
import type { NFT } from "app/types";

import { EmptyPlaceholder } from "../empty-placeholder";
import { CommentInputBox, CommentInputBoxMethods } from "./comment-input-box";
import { CommentsContainer } from "./comments-container";
import { CommentsStatus } from "./comments-status";

const keyExtractor = (item: CommentType) => `comment-${item.comment_id}`;

export function Comments({ nft }: { nft: NFT }) {
  //#region refs
  const Alert = useAlert();
  const inputRef = useRef<CommentInputBoxMethods>(null);
  const commentInputRef = useRef<TextInput>(null);
  //#endregion

  //#region effects

  useEffect(() => {
    // auto focus on comment modal open on native
    if (Platform.OS !== "web") {
      setTimeout(() => {
        commentInputRef.current?.focus?.();
      }, 100);
    }
  }, []);

  //#region hooks
  const { isAuthenticated } = useUser();
  const {
    data,
    error,
    isSubmitting,
    isLoading,
    likeComment,
    unlikeComment,
    deleteComment,
    newComment,
  } = useComments(nft.nft_id);
  const modalListProps = useModalListProps();
  const { bottom } = useSafeAreaInsets();
  //#endregion
  //#region variables
  const dataReversed = useMemo(
    () => data?.comments.slice().reverse() || [],
    [data]
  );

  //#endregion

  //#region callbacks
  const handleOnDeleteComment = useCallback(
    async function handleOnDeleteComment(commentId: number) {
      const _deleteComment = async () => {
        try {
          await deleteComment(commentId);
        } catch (error) {
          Alert.alert("Error", "Cannot delete comment.", [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Try Again",
              style: "destructive",
              onPress: _deleteComment,
            },
          ]);
        }
      };

      Alert.alert(
        "Delete Comment",
        "Are you sure you want to delete this comment?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: _deleteComment,
          },
        ]
      );
    },
    [Alert, deleteComment]
  );
  const handleOnReply = useCallback((comment: CommentType) => {
    inputRef.current?.reply(comment);
  }, []);
  //#endregion

  //#region rendering
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<CommentType>) => (
      <CommentRow
        key={`comment-row-${item.comment_id}`}
        comment={item}
        likeComment={likeComment}
        unlikeComment={unlikeComment}
        deleteComment={handleOnDeleteComment}
        reply={handleOnReply}
      />
    ),
    [likeComment, unlikeComment, handleOnDeleteComment, handleOnReply]
  );

  const listEmptyComponent = useCallback(
    () => (
      <EmptyPlaceholder
        text="Be the first to add a comment!"
        title="💬 No comments yet..."
        titleTw="pt-1"
        tw="-mt-5 h-full flex-1 items-center justify-center"
      />
    ),
    []
  );
  const listFooterComponent = useCallback(
    () => <View style={{ height: Math.max(bottom, 20) }} />,
    [bottom]
  );
  return (
    <CommentsContainer style={styles.container}>
      {isLoading || (dataReversed.length == 0 && error) ? (
        <CommentsStatus isLoading={isLoading} error={error} />
      ) : (
        <>
          <InfiniteScrollList
            data={dataReversed}
            refreshing={isLoading}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            estimatedItemSize={98}
            overscan={98}
            keyboardDismissMode="on-drag"
            ListEmptyComponent={listEmptyComponent}
            ListFooterComponent={listFooterComponent}
            {...modalListProps}
          />
          {isAuthenticated && (
            <CommentInputBox
              ref={inputRef}
              commentInputRef={commentInputRef}
              submitting={isSubmitting}
              submit={newComment}
            />
          )}
        </>
      )}
    </CommentsContainer>
  );
  //#endregion
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
});
