import {
  useCallback,
  useMemo,
  useRef,
  Fragment,
  useEffect,
  useState,
} from "react";
import { Platform, StyleSheet, TextInput } from "react-native";

import { ListRenderItemInfo } from "@shopify/flash-list";

import { useAlert } from "@showtime-xyz/universal.alert";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import Spinner from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { CommentRow } from "app/components/comments/comment-row";
import { CommentType, useComments } from "app/hooks/api/use-comments";
import { useModalListProps } from "app/hooks/use-modal-list-props";
import { useUser } from "app/hooks/use-user";
import type { NFT } from "app/types";

import { EmptyPlaceholder } from "../empty-placeholder";
import { InputAccessoryView } from "../input-accessory-view";
import { CommentInputBox, CommentInputBoxMethods } from "./comment-input-box";
import { CommentsStatus } from "./comments-status";

const keyExtractor = (item: CommentType) => `comment-${item.comment_id}`;
const PlatformInputAccessoryView =
  Platform.OS === "ios" ? InputAccessoryView : Fragment;

type CommentsProps = {
  nft: NFT;
  webListHeight?: number | string;
  ListHeaderComponent?: React.ComponentType<any>;
};

export function Comments({
  nft,
  webListHeight,
  ListHeaderComponent,
}: CommentsProps) {
  //#region refs
  const Alert = useAlert();
  const inputRef = useRef<CommentInputBoxMethods>(null);
  const commentInputRef = useRef<TextInput>(null);
  const [mounted, setMounted] = useState(Platform.OS !== "ios");
  const [handleInset, setHandleInset] = useState(false);

  useEffect(() => {
    // we need to use this to prevent a flicker on ios due to InputAccessoryView
    const handle = setTimeout(() => {
      setMounted(true);
      setTimeout(() => {
        // we need to let RN handle the inset with a delay or it will shift the start offset
        setHandleInset(true);
      }, 300);
    }, 600);

    return () => {
      // Clean up
      clearTimeout(handle);
    };
  }, []);
  //#endregion

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
    fetchMore,
    isLoadingMore,
  } = useComments(nft.nft_id);
  const modalListProps = useModalListProps(webListHeight);
  const { bottom } = useSafeAreaInsets();
  const isDark = useIsDarkMode();
  //#endregion
  //#region variables
  const dataReversed = useMemo(() => data.slice().reverse() || [], [data]);

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

      return new Promise<void>((resolve) => {
        Alert.alert(
          "Delete Comment",
          "Are you sure you want to delete this comment?",
          [
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => {
                resolve();
              },
            },
            {
              text: "Delete",
              style: "destructive",
              onPress: () => {
                resolve();
                _deleteComment();
              },
            },
          ]
        );
      });
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
        creatorId={nft.creator_id}
      />
    ),
    [
      likeComment,
      unlikeComment,
      handleOnDeleteComment,
      handleOnReply,
      nft.creator_id,
    ]
  );

  const listEmptyComponent = useCallback(
    () =>
      !isLoading && !error && !dataReversed.length ? (
        <EmptyPlaceholder
          text="Be the first to add a comment!"
          title="💬 No comments yet..."
          tw="ios:min-h-[60vh] android:min-h-[70vh] web:min-h-[350px] -mt-5 h-full flex-1"
        />
      ) : null,
    [isLoading, dataReversed.length, error]
  );
  const listFooterComponent = useCallback(() => {
    if (isLoadingMore)
      return (
        <View tw="items-center pb-4">
          <Spinner size="small" />
        </View>
      );
    return <View style={{ height: Math.max(bottom, 20) }} />;
  }, [bottom, isLoadingMore]);

  // run two recycling pools to optimize performance
  const getItemType = useCallback((item: CommentType) => {
    if (item.replies && item.replies?.length > 0) {
      return "reply";
    }
    return "comment";
  }, []);

  return (
    <View style={styles.container}>
      {isLoading || (dataReversed.length == 0 && error) ? (
        <CommentsStatus isLoading={isLoading} error={error} />
      ) : (
        <View tw="flex-grow">
          <InfiniteScrollList
            data={dataReversed}
            refreshing={isLoading}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            estimatedItemSize={70}
            keyboardDismissMode="interactive"
            ListFooterComponent={listFooterComponent}
            automaticallyAdjustKeyboardInsets={handleInset}
            automaticallyAdjustContentInsets={false}
            contentInsetAdjustmentBehavior="never"
            ListHeaderComponent={ListHeaderComponent}
            contentContainerStyle={styles.contentContainer}
            getItemType={getItemType}
            ListEmptyComponent={listEmptyComponent}
            onEndReached={fetchMore}
            {...modalListProps}
          />
          {isAuthenticated && mounted && (
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
    flexGrow: 1,
  },
  contentContainer: {
    paddingTop: 10,
    paddingBottom: 80,
  },
});
