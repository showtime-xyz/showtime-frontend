import { useCallback, useMemo, useRef } from "react";
import {
  Alert,
  FlatList as RNFlatList,
  Keyboard,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
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

const comments = [
  {
    added: "2022-01-07T18:20:35.677",
    address: "tz1dzGd9EmqGeZ4FUc2hig2KQWGHgZM2aTee",
    comment_id: 103864,
    commenter_profile_id: 51,
    img_url:
      "https://lh3.googleusercontent.com/oxWrFL8uDDhnir_y6FAxRDfRvp_RyFWj-LIgtxL49J97RqICaF-Kg0K2yBy7dqvaZCxsUdaul25S6S2FjCpo7bQvLXc7V3SkFzQg",
    like_count: 10000000,
    likers: [],
    name: "Alex Kilkka",
    nft_id: 23882193,
    replies: [],
    text: "But how would you do this at 15 MPH 🤔",
    username: "alex",
    verified: 1,
  },
  {
    added: "2022-01-07T18:21:52.972",
    address: "0x8a9783c7f9a2a3a67120fabe46150da5082949f7",
    comment_id: 103865,
    commenter_profile_id: 332682,
    img_url: null,
    like_count: 1,
    likers: [
      {
        comment_id: 103865,
        img_url:
          "https://lh3.googleusercontent.com/oxWrFL8uDDhnir_y6FAxRDfRvp_RyFWj-LIgtxL49J97RqICaF-Kg0K2yBy7dqvaZCxsUdaul25S6S2FjCpo7bQvLXc7V3SkFzQg",
        name: "Alex Kilkka",
        profile_id: 51,
        timestamp: "2022-01-07T18:22:18.311",
        username: "alex",
        verified: 1,
        wallet_address: "tz1dzGd9EmqGeZ4FUc2hig2KQWGHgZM2aTee",
      },
    ],
    name: "kmeister",
    nft_id: 23882193,
    replies: [
      {
        added: "2022-01-07T18:24:26.763",
        address: "tz1dzGd9EmqGeZ4FUc2hig2KQWGHgZM2aTee",
        comment_id: 103866,
        commenter_profile_id: 51,
        img_url:
          "https://lh3.googleusercontent.com/oxWrFL8uDDhnir_y6FAxRDfRvp_RyFWj-LIgtxL49J97RqICaF-Kg0K2yBy7dqvaZCxsUdaul25S6S2FjCpo7bQvLXc7V3SkFzQg",
        like_count: 0,
        likers: [
          {
            comment_id: 103865,
            img_url:
              "https://lh3.googleusercontent.com/oxWrFL8uDDhnir_y6FAxRDfRvp_RyFWj-LIgtxL49J97RqICaF-Kg0K2yBy7dqvaZCxsUdaul25S6S2FjCpo7bQvLXc7V3SkFzQg",
            name: "Alex Kilkka",
            profile_id: 51,
            timestamp: "2022-01-07T18:22:18.311",
            username: "alex",
            verified: 1,
            wallet_address: "tz1dzGd9EmqGeZ4FUc2hig2KQWGHgZM2aTee",
          },
        ],
        name: "Alex Kilkka",
        nft_id: 23882193,
        parent_id: 103865,
        text: "@[0x26…Ee63](kmeister) I'm perplexed",
        username: "alex",
        verified: 1,
      },
      {
        added: "2022-01-07T18:24:26.763",
        address: "tz1dzGd9EmqGeZ4FUc2hig2KQWGHgZM2aTee",
        comment_id: 1032866,
        commenter_profile_id: 51,
        img_url:
          "https://lh3.googleusercontent.com/oxWrFL8uDDhnir_y6FAxRDfRvp_RyFWj-LIgtxL49J97RqICaF-Kg0K2yBy7dqvaZCxsUdaul25S6S2FjCpo7bQvLXc7V3SkFzQg",
        like_count: 0,
        likers: [
          {
            comment_id: 103865,
            img_url:
              "https://lh3.googleusercontent.com/oxWrFL8uDDhnir_y6FAxRDfRvp_RyFWj-LIgtxL49J97RqICaF-Kg0K2yBy7dqvaZCxsUdaul25S6S2FjCpo7bQvLXc7V3SkFzQg",
            name: "Alex Kilkka",
            profile_id: 51,
            timestamp: "2022-01-07T18:22:18.311",
            username: "alex",
            verified: 1,
            wallet_address: "tz1dzGd9EmqGeZ4FUc2hig2KQWGHgZM2aTee",
          },
        ],
        name: "Alex Kilkka",
        nft_id: 23882193,
        parent_id: 103865,
        text: "@[0x26…Ee63](kmeister) I'm perplexed",
        username: "alex",
        verified: 1,
      },
      {
        added: "2022-01-07T18:24:26.763",
        address: "tz1dzGd9EmqGeZ4FUc2hig2KQWGHgZM2aTee",
        comment_id: 1038616,
        commenter_profile_id: 51,
        img_url:
          "https://lh3.googleusercontent.com/oxWrFL8uDDhnir_y6FAxRDfRvp_RyFWj-LIgtxL49J97RqICaF-Kg0K2yBy7dqvaZCxsUdaul25S6S2FjCpo7bQvLXc7V3SkFzQg",
        like_count: 0,
        likers: [
          {
            comment_id: 103865,
            img_url:
              "https://lh3.googleusercontent.com/oxWrFL8uDDhnir_y6FAxRDfRvp_RyFWj-LIgtxL49J97RqICaF-Kg0K2yBy7dqvaZCxsUdaul25S6S2FjCpo7bQvLXc7V3SkFzQg",
            name: "Alex Kilkka",
            profile_id: 51,
            timestamp: "2022-01-07T18:22:18.311",
            username: "alex",
            verified: 1,
            wallet_address: "tz1dzGd9EmqGeZ4FUc2hig2KQWGHgZM2aTee",
          },
        ],
        name: "Alex Kilkka",
        nft_id: 23882193,
        parent_id: 103865,
        text: "@[0x26…Ee63](kmeister) I'm perplexed",
        username: "alex",
        verified: 1,
      },

      {
        added: "2022-01-07T18:24:26.763",
        address: "tz1dzGd9EmqGeZ4FUc2hig2KQWGHgZM2aTee",
        comment_id: 10386216,
        commenter_profile_id: 51,
        img_url:
          "https://lh3.googleusercontent.com/oxWrFL8uDDhnir_y6FAxRDfRvp_RyFWj-LIgtxL49J97RqICaF-Kg0K2yBy7dqvaZCxsUdaul25S6S2FjCpo7bQvLXc7V3SkFzQg",
        like_count: 0,
        likers: [
          {
            comment_id: 103865,
            img_url:
              "https://lh3.googleusercontent.com/oxWrFL8uDDhnir_y6FAxRDfRvp_RyFWj-LIgtxL49J97RqICaF-Kg0K2yBy7dqvaZCxsUdaul25S6S2FjCpo7bQvLXc7V3SkFzQg",
            name: "Alex Kilkka",
            profile_id: 51,
            timestamp: "2022-01-07T18:22:18.311",
            username: "alex",
            verified: 1,
            wallet_address: "tz1dzGd9EmqGeZ4FUc2hig2KQWGHgZM2aTee",
          },
        ],
        name: "Alex Kilkka",
        nft_id: 23882193,
        parent_id: 103865,
        text: "@[0x26…Ee63](kmeister) I'm perplexed",
        username: "alex",
        verified: 1,
      },

      {
        added: "2022-01-07T18:24:26.763",
        address: "tz1dzGd9EmqGeZ4FUc2hig2KQWGHgZM2aTee",
        comment_id: 10386416,
        commenter_profile_id: 51,
        img_url:
          "https://lh3.googleusercontent.com/oxWrFL8uDDhnir_y6FAxRDfRvp_RyFWj-LIgtxL49J97RqICaF-Kg0K2yBy7dqvaZCxsUdaul25S6S2FjCpo7bQvLXc7V3SkFzQg",
        like_count: 0,
        likers: [
          {
            comment_id: 103865,
            img_url:
              "https://lh3.googleusercontent.com/oxWrFL8uDDhnir_y6FAxRDfRvp_RyFWj-LIgtxL49J97RqICaF-Kg0K2yBy7dqvaZCxsUdaul25S6S2FjCpo7bQvLXc7V3SkFzQg",
            name: "Alex Kilkka",
            profile_id: 51,
            timestamp: "2022-01-07T18:22:18.311",
            username: "alex",
            verified: 1,
            wallet_address: "tz1dzGd9EmqGeZ4FUc2hig2KQWGHgZM2aTee",
          },
        ],
        name: "Alex Kilkka",
        nft_id: 23882193,
        parent_id: 103865,
        text: "@[0x26…Ee63](kmeister) I'm perplexed",
        username: "alex",
        verified: 1,
      },

      {
        added: "2022-01-07T18:24:26.763",
        address: "tz1dzGd9EmqGeZ4FUc2hig2KQWGHgZM2aTee",
        comment_id: 11038616,
        commenter_profile_id: 51,
        img_url:
          "https://lh3.googleusercontent.com/oxWrFL8uDDhnir_y6FAxRDfRvp_RyFWj-LIgtxL49J97RqICaF-Kg0K2yBy7dqvaZCxsUdaul25S6S2FjCpo7bQvLXc7V3SkFzQg",
        like_count: 0,
        likers: [
          {
            comment_id: 103865,
            img_url:
              "https://lh3.googleusercontent.com/oxWrFL8uDDhnir_y6FAxRDfRvp_RyFWj-LIgtxL49J97RqICaF-Kg0K2yBy7dqvaZCxsUdaul25S6S2FjCpo7bQvLXc7V3SkFzQg",
            name: "Alex Kilkka",
            profile_id: 51,
            timestamp: "2022-01-07T18:22:18.311",
            username: "alex",
            verified: 1,
            wallet_address: "tz1dzGd9EmqGeZ4FUc2hig2KQWGHgZM2aTee",
          },
        ],
        name: "Alex Kilkka",
        nft_id: 23882193,
        parent_id: 103865,
        text: "@[0x26…Ee63](kmeister) I'm perplexed",
        username: "alex",
        verified: 1,
      },

      {
        added: "2022-01-07T18:24:26.763",
        address: "tz1dzGd9EmqGeZ4FUc2hig2KQWGHgZM2aTee",
        comment_id: 10638616,
        commenter_profile_id: 51,
        img_url:
          "https://lh3.googleusercontent.com/oxWrFL8uDDhnir_y6FAxRDfRvp_RyFWj-LIgtxL49J97RqICaF-Kg0K2yBy7dqvaZCxsUdaul25S6S2FjCpo7bQvLXc7V3SkFzQg",
        like_count: 0,
        likers: [
          {
            comment_id: 103865,
            img_url:
              "https://lh3.googleusercontent.com/oxWrFL8uDDhnir_y6FAxRDfRvp_RyFWj-LIgtxL49J97RqICaF-Kg0K2yBy7dqvaZCxsUdaul25S6S2FjCpo7bQvLXc7V3SkFzQg",
            name: "Alex Kilkka",
            profile_id: 51,
            timestamp: "2022-01-07T18:22:18.311",
            username: "alex",
            verified: 1,
            wallet_address: "tz1dzGd9EmqGeZ4FUc2hig2KQWGHgZM2aTee",
          },
        ],
        name: "Alex Kilkka",
        nft_id: 23882193,
        parent_id: 103865,
        text: "@[0x26…Ee63](kmeister) I'm perplexed",
        username: "alex",
        verified: 1,
      },

      {
        added: "2022-01-07T18:24:26.763",
        address: "tz1dzGd9EmqGeZ4FUc2hig2KQWGHgZM2aTee",
        comment_id: 10386616,
        commenter_profile_id: 51,
        img_url:
          "https://lh3.googleusercontent.com/oxWrFL8uDDhnir_y6FAxRDfRvp_RyFWj-LIgtxL49J97RqICaF-Kg0K2yBy7dqvaZCxsUdaul25S6S2FjCpo7bQvLXc7V3SkFzQg",
        like_count: 0,
        likers: [
          {
            comment_id: 103865,
            img_url:
              "https://lh3.googleusercontent.com/oxWrFL8uDDhnir_y6FAxRDfRvp_RyFWj-LIgtxL49J97RqICaF-Kg0K2yBy7dqvaZCxsUdaul25S6S2FjCpo7bQvLXc7V3SkFzQg",
            name: "Alex Kilkka",
            profile_id: 51,
            timestamp: "2022-01-07T18:22:18.311",
            username: "alex",
            verified: 1,
            wallet_address: "tz1dzGd9EmqGeZ4FUc2hig2KQWGHgZM2aTee",
          },
        ],
        name: "Alex Kilkka",
        nft_id: 23882193,
        parent_id: 103865,
        text: "@[0x26…Ee63](kmeister) I'm perplexed",
        username: "alex",
        verified: 1,
      },

      {
        added: "2022-01-07T18:24:26.763",
        address: "tz1dzGd9EmqGeZ4FUc2hig2KQWGHgZM2aTee",
        comment_id: 10378616,
        commenter_profile_id: 51,
        img_url:
          "https://lh3.googleusercontent.com/oxWrFL8uDDhnir_y6FAxRDfRvp_RyFWj-LIgtxL49J97RqICaF-Kg0K2yBy7dqvaZCxsUdaul25S6S2FjCpo7bQvLXc7V3SkFzQg",
        like_count: 0,
        likers: [
          {
            comment_id: 103865,
            img_url:
              "https://lh3.googleusercontent.com/oxWrFL8uDDhnir_y6FAxRDfRvp_RyFWj-LIgtxL49J97RqICaF-Kg0K2yBy7dqvaZCxsUdaul25S6S2FjCpo7bQvLXc7V3SkFzQg",
            name: "Alex Kilkka",
            profile_id: 51,
            timestamp: "2022-01-07T18:22:18.311",
            username: "alex",
            verified: 1,
            wallet_address: "tz1dzGd9EmqGeZ4FUc2hig2KQWGHgZM2aTee",
          },
        ],
        name: "Alex Kilkka",
        nft_id: 23882193,
        parent_id: 103865,
        text: "@[0x26…Ee63](kmeister) I'm perplexed",
        username: "alex",
        verified: 1,
      },
    ],
    text: "Hard to say haha! @[Alex Kilkka](alex) ",
    username: "kmeister",
    verified: 0,
  },
];

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
  // const dataReversed = useMemo(() => comments, []);
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
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={5}
            contentContainerStyle={styles.container}
            onTouchMove={handleOnTouchMove}
          />
          {isAuthenticated && (
            <MessageBox
              ref={inputRef}
              submitting={isSubmitting}
              style={{
                marginBottom: Platform.OS === "android" ? keyboardHeight : 0,
                paddingHorizontal: 16,
              }}
              onSubmit={handleOnSubmitComment}
            />
          )}
        </>
      )}
    </View>
  );
  //#endregion
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
});
