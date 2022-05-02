import { useCallback, useMemo, useRef } from "react";
import {
  FlatList as RNFlatList,
  Keyboard,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

import { BottomSheetFlatList } from "@gorhom/bottom-sheet";

import { CommentRow } from "app/components/comments/comment-row";
import { CommentType, useComments } from "app/hooks/api/use-comments";
import { useUser } from "app/hooks/use-user";
import { useRouter } from "app/navigation/use-router";
import type { NFT } from "app/types";

import { useAlert } from "design-system/alert";
import { Button } from "design-system/button";
import { ModalFooter } from "design-system/modal";
import { Text } from "design-system/text";
import { breakpoints } from "design-system/theme";
import { View } from "design-system/view";

import { CommentInputBox, CommentInputBoxMethods } from "./comment-input-box";
import { CommentsContainer } from "./comments-container";
import { CommentsStatus } from "./comments-status";

const keyExtractor = (item: CommentType) => `comment-${item.comment_id}`;

const FlatList = Platform.OS === "android" ? BottomSheetFlatList : RNFlatList;

export function Comments({ nft }: { nft: NFT }) {
  //#region refs
  const Alert = useAlert();
  const inputRef = useRef<CommentInputBoxMethods>(null);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
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
  } = useComments(nft?.nft_id);
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
  const listEmptyComponent = useCallback(
    () => (
      <View tw="items-center justify-center p-4">
        <Text variant="text-lg" tw="text-gray-900 dark:text-gray-100">
          💬 No comments yet...
        </Text>
        <View tw="h-4" />
        <Text variant="text-sm" tw="text-gray-600 dark:text-gray-400">
          Be the first to add a comment!
        </Text>
        {!isAuthenticated ? (
          <>
            <View tw="h-4" />
            <Button
              onPress={() => {
                router.push(
                  Platform.select({
                    native: "/login",
                    // @ts-ignore
                    web: {
                      pathname: router.pathname,
                      query: { ...router.query, loginModal: true },
                    },
                  }),
                  Platform.select({
                    native: "/login",
                    web: router.asPath === "/" ? "/login" : router.asPath,
                  }),
                  { shallow: true }
                );
              }}
              variant="primary"
              size={isMdWidth ? "regular" : "small"}
              labelTW="font-semibold"
            >
              Sign&nbsp;In
            </Button>
          </>
        ) : null}
      </View>
    ),
    [isAuthenticated, router, isMdWidth]
  );
  return (
    <CommentsContainer style={styles.container}>
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
            keyboardDismissMode="on-drag"
            enableFooterMarginAdjustment={true}
            ListEmptyComponent={listEmptyComponent}
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
    </CommentsContainer>
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
