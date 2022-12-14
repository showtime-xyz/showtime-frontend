import { useCallback, useMemo, useRef, Fragment, useEffect } from "react";
import {
  Platform,
  StyleSheet,
  TextInput,
  InputAccessoryView,
} from "react-native";

import { ListRenderItemInfo } from "@shopify/flash-list";
import { AvoidSoftInput } from "react-native-avoid-softinput";

import { useAlert } from "@showtime-xyz/universal.alert";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { colors } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { CommentRow } from "app/components/comments/comment-row";
import { CommentType, useComments } from "app/hooks/api/use-comments";
import { useModalListProps } from "app/hooks/use-modal-list-props";
import { useUser } from "app/hooks/use-user";
import type { NFT } from "app/types";

import { EmptyPlaceholder } from "../empty-placeholder";
import { CommentInputBox, CommentInputBoxMethods } from "./comment-input-box";
import { CommentsStatus } from "./comments-status";

const keyExtractor = (item: CommentType) => `comment-${item.comment_id}`;

const PlatformInputAccessoryView =
  Platform.OS === "ios" ? InputAccessoryView : Fragment;

export function Comments({ nft }: { nft: NFT }) {
  //#region refs
  const Alert = useAlert();
  const inputRef = useRef<CommentInputBoxMethods>(null);
  const commentInputRef = useRef<TextInput>(null);
  //#endregion

  //#region effects

  useEffect(() => {
    // auto focus on comment modal open on native
    if (Platform.OS === "ios") {
      AvoidSoftInput.setEnabled(false);
    }

    if (Platform.OS !== "web") {
      setTimeout(() => {
        commentInputRef.current?.focus?.();
      }, 800);
    }
    return () => {
      if (Platform.OS === "ios") {
        AvoidSoftInput.setEnabled(true);
      }
    };
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
  const isDark = useIsDarkMode();
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
        tw="mt-5 h-full flex-1 items-center justify-center"
      />
    ),
    []
  );
  const listFooterComponent = useCallback(
    () => <View style={{ height: Math.max(bottom, 20) }} />,
    [bottom]
  );
  return (
    <View style={styles.container}>
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
            keyboardDismissMode="interactive"
            ListEmptyComponent={listEmptyComponent}
            ListFooterComponent={listFooterComponent}
            automaticallyAdjustKeyboardInsets
            contentInsetAdjustmentBehavior="never"
            {...modalListProps}
          />
          {isAuthenticated && (
            <PlatformInputAccessoryView
              {...Platform.select({
                ios: {
                  backgroundColor: isDark ? colors.black : colors.white,
                },
                default: {},
              })}
            >
              <CommentInputBox
                ref={inputRef}
                commentInputRef={commentInputRef}
                submitting={isSubmitting}
                submit={newComment}
              />
            </PlatformInputAccessoryView>
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
    // Notes: for `FlashList's rendered size is not usable` warning on Android.
    minHeight: 200,
  },
  contentContainer: {
    flex: 1,
  },
});
