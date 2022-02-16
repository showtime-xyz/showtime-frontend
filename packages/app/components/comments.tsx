import { Fragment, Suspense, useCallback } from "react";
import {
  FlatList as RNFlatList,
  Keyboard,
  ListRenderItemInfo,
  Platform,
} from "react-native";

import { BottomSheetFlatList } from "@gorhom/bottom-sheet";

import { useComments, CommentType } from "app/hooks/api/use-comments";
import { useKeyboardDimensions } from "app/hooks/use-keyboard-dimensions";

import { ActivityIndicator, Spinner, View } from "design-system";
import { Comments as CommentsList } from "design-system/comments";
import { MessageBox } from "design-system/messages/message-box-new";
import { MessageRow } from "design-system/messages/message-row";

interface CommentsProps {
  nftId: number;
}

const keyExtractor = (item: CommentType) => `comment-${item.comment_id}`;

export function Comments({ nftId }: CommentsProps) {
  //#region hooks
  const { data, isLoading } = useComments({ nftId });
  const { keyboardHeight } = useKeyboardDimensions(true);
  //#endregion

  //#region callbacks
  const handleOnSubmit = useCallback((text: string) => {}, []);
  const handleOnTouchMove = useCallback(() => {
    if (keyboardHeight > 0) {
      Keyboard.dismiss();
    }
  }, [keyboardHeight]);
  //#endregion

  //#region rendering
  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<CommentType>) => (
      <Fragment key={item.comment_id}>
        <MessageRow
          username={item.username}
          userAvatar={item.img_url}
          userVerified={item.verified as any}
          content={item.text}
          likeCount={item.like_count}
          replayCount={item.replies?.length}
          hasReplies={item.replies && item.replies.length > 0}
          hasParent={item.parent_id != undefined}
          createdAt={item.added}
        />
        {item.replies?.length ?? 0 > 0
          ? item.replies?.map((reply) => (
              <MessageRow
                username={reply.username}
                userAvatar={reply.img_url}
                userVerified={reply.verified as any}
                content={reply.text}
                likeCount={reply.like_count}
                replayCount={reply.replies?.length}
                hasReplies={reply.replies && reply.replies.length > 0}
                hasParent={reply.parent_id != undefined}
                createdAt={reply.added}
              />
            ))
          : null}
      </Fragment>
    ),
    []
  );
  const FlatList = Platform.OS === "android" ? BottomSheetFlatList : RNFlatList;
  return (
    <Suspense fallback={<Spinner size="small" />}>
      <View tw="flex-1 mt--4">
        <FlatList
          data={data?.[0].data.comments}
          refreshing={isLoading}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          onTouchMove={handleOnTouchMove}
        />
        <MessageBox
          style={{ marginBottom: keyboardHeight }}
          onSubmit={handleOnSubmit}
        />
        {isLoading && (
          <View
            tw={
              "absolute top--8 right--4 bottom-4 left--4 opacity-95 dark:opacity-85 bg-white dark:bg-black justify-center items-center"
            }
          >
            <ActivityIndicator />
          </View>
        )}
      </View>
    </Suspense>
  );
  //#endregion
}
