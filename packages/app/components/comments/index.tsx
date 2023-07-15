import { useCallback, useRef, useEffect } from "react";
import { Platform, StyleSheet, TextInput } from "react-native";

import type { ListRenderItemInfo } from "@shopify/flash-list";
import { AvoidSoftInput } from "react-native-avoid-softinput";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import { useAlert } from "@showtime-xyz/universal.alert";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import Spinner from "@showtime-xyz/universal.spinner";
import { View } from "@showtime-xyz/universal.view";

import { CommentRow } from "app/components/comments/comment-row";
import { CommentType, useComments } from "app/hooks/api/use-comments";
import { useModalListProps } from "app/hooks/use-modal-list-props";
import { useUser } from "app/hooks/use-user";
import {
  useReanimatedKeyboardAnimation,
  KeyboardController,
  AndroidSoftInputModes,
} from "app/lib/keyboard-controller";
import type { NFT } from "app/types";

import { EmptyPlaceholder } from "../empty-placeholder";
import { CommentInputBox, CommentInputBoxMethods } from "./comment-input-box";
import { CommentsStatus } from "./comments-status";

const keyExtractor = (item: CommentType) => `comment-${item.id}`;

type CommentsProps = {
  nft: NFT;
  webListHeight?: number | string;
  ListHeaderComponent?: React.ComponentType<any>;
  inputBackgroundColor?: string | null;
};

export function Comments({
  nft,
  webListHeight,
  ListHeaderComponent,
  inputBackgroundColor,
}: CommentsProps) {
  //#region refs
  const Alert = useAlert();
  const inputRef = useRef<CommentInputBoxMethods>(null);
  const commentInputRef = useRef<TextInput>(null);

  useEffect(() => {
    AvoidSoftInput?.setEnabled(false);
    KeyboardController?.setInputMode(
      AndroidSoftInputModes.SOFT_INPUT_ADJUST_NOTHING
    );

    return () => {
      AvoidSoftInput?.setEnabled(true);
      KeyboardController?.setDefaultMode();
    };
  }, []);
  //#endregion

  const keyboard =
    Platform.OS !== "web"
      ? // eslint-disable-next-line react-hooks/rules-of-hooks
        useReanimatedKeyboardAnimation()
      : { height: { value: 0 }, state: {} };

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
  //#endregion
  //#region variables

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
      !isLoading && !error && !data.length ? (
        <EmptyPlaceholder
          text="Be the first to add a comment!"
          title="💬 No comments yet..."
          tw="ios:min-h-[60vh] android:min-h-[70vh] web:min-h-[350px] h-full flex-1"
        />
      ) : null,
    [isLoading, data.length, error]
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

  const fakeView = useAnimatedStyle(
    () => ({
      height: keyboard.height.value
        ? Math.abs(keyboard.height.value)
        : Math.abs(keyboard.height.value),
    }),
    [keyboard]
  );

  const animatedInputStyle = useAnimatedStyle(() => {
    return {
      bottom: bottom / 2,
      transform: [
        {
          translateY: keyboard.height.value ? bottom / 2 : 0,
        },
      ],
    };
  }, [keyboard, bottom]);

  return (
    <View style={styles.container}>
      {isLoading || (data.length == 0 && error) ? (
        <CommentsStatus isLoading={true} error={error} />
      ) : (
        <View tw="flex-grow">
          {/*TODO: @Alan, please fix TS */}
          {/* @ts-expect-error Types wrong becuase of modalListProps */}
          <InfiniteScrollList
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            estimatedItemSize={70}
            keyboardDismissMode={
              Platform.OS === "ios" ? "interactive" : "on-drag"
            }
            contentInsetAdjustmentBehavior="always"
            automaticallyAdjustContentInsets={true}
            ListFooterComponent={listFooterComponent}
            ListHeaderComponent={ListHeaderComponent}
            contentContainerStyle={styles.contentContainer}
            getItemType={getItemType}
            ListEmptyComponent={listEmptyComponent}
            onEndReached={fetchMore}
            {...modalListProps}
          />
          {isAuthenticated && (
            <Animated.View style={animatedInputStyle}>
              <CommentInputBox
                ref={inputRef}
                commentInputRef={commentInputRef}
                submitting={isSubmitting}
                submit={newComment}
                backgroundColor={inputBackgroundColor}
              />
            </Animated.View>
          )}
          <Animated.View style={[fakeView]} />
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
  },
});
