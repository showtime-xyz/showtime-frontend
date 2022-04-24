import { useCallback, useMemo, useRef } from "react";
import {
  FlatList as RNFlatList,
  Keyboard,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
} from "react-native";

import { BottomSheetFlatList } from "@gorhom/bottom-sheet";

import { CommentRow } from "app/components/comments/comment-row";
import { useComments, CommentType } from "app/hooks/api/use-comments";
import { useUser } from "app/hooks/use-user";

import { View } from "design-system";
import { useAlert } from "design-system/alert";
import { ModalFooter } from "design-system/modal-new";

import { CommentInputBox, CommentInputBoxMethods } from "./comment-input-box";
import { CommentsStatus } from "./comments-status";

interface CommentsProps {
  nftId: number;
}

const keyExtractor = (item: CommentType) => `comment-${item.comment_id}`;

export function Comments({ nftId }: CommentsProps) {
  //#region refs
  const Alert = useAlert();
  const inputRef = useRef<CommentInputBoxMethods>(null);
  //#endregion

  //#region hooks
  const { isAuthenticated } = useUser();
  const {
    data,
    error,
    isSubmitting,
    isLoading,
    isRefreshing,
    likeComment,
    unlikeComment,
    deleteComment,
    newComment,
    refresh,
  } = useComments(nftId);
  //#endregion

  //#region variables
  const dataReversed = useMemo(
    () => data?.comments.slice().reverse() || [],
    [data]
  );
  //#endregion

  //#region callbacks
  const handleOnTouchMove = useCallback(() => {
    Keyboard.dismiss();
  }, []);
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
    [deleteComment]
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

  const FlatList = Platform.OS === "android" ? BottomSheetFlatList : RNFlatList;

  return (
    <View tw="flex-1">
      {isLoading || (dataReversed.length == 0 && error) ? (
        <CommentsStatus isLoading={isLoading} error={error} />
      ) : (
        <>
          <FlatList
            data={dataReversed}
            refreshing={isLoading}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            initialNumToRender={6}
            maxToRenderPerBatch={3}
            windowSize={6}
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            // onTouchMove={handleOnTouchMove}
            enableFooterMarginAdjustment={true}
          />
          {isAuthenticated && (
            <ModalFooter>
              <CommentInputBox
                ref={inputRef}
                submitting={isSubmitting}
                submit={newComment}
              />
            </ModalFooter>
          )}
        </>
      )}
    </View>
  );
  //#endregion
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
});
