import { Fragment, Suspense, useCallback, useMemo } from "react";
import {
  FlatList as RNFlatList,
  Keyboard,
  ListRenderItemInfo,
  Platform,
} from "react-native";

import { BottomSheetFlatList } from "@gorhom/bottom-sheet";

import { CommentRow } from "app/components/comments/comment-row";
import { useComments, CommentType } from "app/hooks/api/use-comments";
import { useKeyboardDimensions } from "app/hooks/use-keyboard-dimensions";

import { ActivityIndicator, Spinner, View } from "design-system";
import { MessageBox } from "design-system/messages/message-box-new";

import { useNewComment } from "../hooks/api/use-new-comment";
import { useUser } from "../hooks/use-user";

interface CommentsProps {
  nftId: number;
}

const keyExtractor = (item: CommentType) => `comment-${item.comment_id}`;

export function Comments({ nftId }: CommentsProps) {
  //#region hooks
  const { isAuthenticated } = useUser();
  const { data, isLoading } = useComments({ nftId });
  const { newComment, submitting } = useNewComment(nftId);
  const { keyboardHeight } = useKeyboardDimensions(true);
  //#endregion

  //#region callbacks
  const handleOnSubmit = useCallback(async function handleOnSubmit(
    text: string
  ) {
    return await newComment(text);
  },
  []);
  const handleOnTouchMove = useCallback(() => {
    if (keyboardHeight > 0) {
      Keyboard.dismiss();
    }
  }, [keyboardHeight]);
  //#endregion

  //#region rendering
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<CommentType>) => (
      <CommentRow key={`comment-row-${item.comment_id}`} comment={item} />
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
        {isAuthenticated && (
          <MessageBox
            submitting={submitting}
            style={{ marginBottom: keyboardHeight }}
            onSubmit={handleOnSubmit}
          />
        )}
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
