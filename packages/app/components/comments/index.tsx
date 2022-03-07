import { useCallback, useMemo, useRef } from "react";
import {
  Alert,
  FlatList as RNFlatList,
  Keyboard,
  ListRenderItemInfo,
  Platform,
} from "react-native";

import { BottomSheetFlatList } from "@gorhom/bottom-sheet";

import { CommentRow } from "app/components/comments/comment-row";
import { useComments, CommentType } from "app/hooks/api/use-comments";
import { useKeyboardDimensions } from "app/hooks/use-keyboard-dimensions";
import { useUser } from "app/hooks/use-user";

import { View } from "design-system";
import {
  MessageBox,
  MessageBoxMethods,
} from "design-system/messages/message-box-new";

import { CommentsStatus } from "./comments-status";

interface CommentsProps {
  nftId: number;
}

const keyExtractor = (item: CommentType) => `comment-${item.comment_id}`;

export function Comments({ nftId }: CommentsProps) {
  const inputRef = useRef<MessageBoxMethods>(null);

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
  const { keyboardHeight } = useKeyboardDimensions(true);
  //#endregion

  //#region variables
  const dataReversed = useMemo(
    () => data?.comments.slice().reverse() || [],
    [data]
  );
  //#endregion

  //#region callbacks
  const handleOnTouchMove = useCallback(() => {
    if (keyboardHeight > 0) {
      Keyboard.dismiss();
    }
  }, [keyboardHeight]);

  const handleOnSubmitComment = useCallback(
    async function handleOnSubmitComment(text: string) {
      const _newComment = async () => {
        try {
          await newComment(text);
          inputRef.current?.reset();
        } catch (error) {
          Alert.alert("Error", "Cannot add comment.", [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Try Again",
              style: "default",
              onPress: _newComment,
            },
          ]);
        }
      };

      await _newComment();
    },
    [newComment]
  );

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
      />
    ),
    [likeComment, unlikeComment, handleOnDeleteComment]
  );
  const FlatList = Platform.OS === "android" ? BottomSheetFlatList : RNFlatList;

  return (
    <View tw="flex-1 mt--4">
      {isLoading || (dataReversed.length == 0 && error) ? (
        <CommentsStatus isLoading={isLoading} error={error} />
      ) : (
        <>
          <FlatList
            data={dataReversed}
            refreshing={isLoading}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={5}
            onTouchMove={handleOnTouchMove}
          />
          {isAuthenticated && (
            <MessageBox
              ref={inputRef}
              submitting={isSubmitting}
              style={{ marginBottom: keyboardHeight }}
              onSubmit={handleOnSubmitComment}
            />
          )}
        </>
      )}
    </View>
  );
  //#endregion
}
