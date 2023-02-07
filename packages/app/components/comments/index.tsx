import { useCallback, useMemo, useRef, Fragment } from "react";
import {
  Platform,
  StyleSheet,
  TextInput,
  InputAccessoryView,
} from "react-native";

import { ListRenderItemInfo } from "@shopify/flash-list";

import { useAlert } from "@showtime-xyz/universal.alert";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { colors } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { CommentRow } from "app/components/comments/comment-row";
import { CommentType, useComments } from "app/hooks/api/use-comments";
import { useModalListProps } from "app/hooks/use-modal-list-props";
import { useStableFocusEffect } from "app/hooks/use-stable-focus-effect";
import { useUser } from "app/hooks/use-user";
import { useIsFocused } from "app/lib/react-navigation/native";
import type { NFT } from "app/types";

import { EmptyPlaceholder } from "../empty-placeholder";
import { CommentInputBox, CommentInputBoxMethods } from "./comment-input-box";
import { CommentsStatus } from "./comments-status";

const keyExtractor = (item: CommentType) => `comment-${item.comment_id}`;
const PlatformInputAccessoryView =
  Platform.OS === "ios" ? InputAccessoryView : Fragment;

type CommentsProps = {
  nft: NFT;
  webListHeight?: number | string;
};

export function Comments({ nft, webListHeight }: CommentsProps) {
  //#region refs
  const Alert = useAlert();
  const inputRef = useRef<CommentInputBoxMethods>(null);
  const commentInputRef = useRef<TextInput>(null);
  //#endregion

  //#region effects
  const isFocused = useIsFocused();
  useStableFocusEffect(() => {
    if (Platform.OS !== "web") {
      setTimeout(() => {
        isFocused && commentInputRef.current?.focus?.();
      }, 600);
    }
  });
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
  const modalListProps = useModalListProps(webListHeight);
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
      <View tw="absolute h-full w-full items-center justify-center">
        <EmptyPlaceholder
          text="Be the first to add a comment!"
          title="💬 No comments yet..."
        />
      </View>
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
        <View tw="web:pt-4 flex-1">
          <InfiniteScrollList
            data={dataReversed}
            refreshing={isLoading}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            estimatedItemSize={70}
            overscan={98}
            keyboardDismissMode="interactive"
            ListEmptyComponent={listEmptyComponent}
            ListFooterComponent={listFooterComponent}
            automaticallyAdjustKeyboardInsets
            automaticallyAdjustContentInsets={false}
            contentInsetAdjustmentBehavior="never"
            contentContainerStyle={styles.contentContainer}
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
        </View>
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
    paddingTop: 20,
  },
});
