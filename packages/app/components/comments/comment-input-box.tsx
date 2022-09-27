import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { ViewStyle } from "react-native";

import { useAlert } from "@showtime-xyz/universal.alert";
import { Button } from "@showtime-xyz/universal.button";
import { Close } from "@showtime-xyz/universal.icon";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { MessageBox } from "app/components/messages/message-box";
import { CommentType } from "app/hooks/api/use-comments";
import { useKeyboardVisible } from "app/hooks/use-keyboard-visible";
import { useUser } from "app/hooks/use-user";
import { formatAddressShort } from "app/utilities";

interface CommentInputBoxProps {
  submitting?: boolean;
  style?: ViewStyle;
  commentInputRef?: any;
  submit: (message: string, parentId?: number | null) => Promise<void>;
}

export interface CommentInputBoxMethods {
  reply: (comment: CommentType) => void;
}

const getUsername = (comment?: CommentType) =>
  comment?.username ?? formatAddressShort(comment?.address) ?? "";

export const CommentInputBox = forwardRef<
  CommentInputBoxMethods,
  CommentInputBoxProps
>(function CommentInputBox({ submitting, submit, commentInputRef }, ref) {
  //#region variables
  const Alert = useAlert();
  const { visible } = useKeyboardVisible();

  const [selectedComment, setSelectedComment] = useState<CommentType | null>(
    null
  );
  const { bottom } = useSafeAreaInsets();
  const { user } = useUser();
  //#endregion

  //#region callbacks
  const handleOnSubmitComment = useCallback(
    async function handleOnSubmitComment(text: string) {
      const _newComment = async () => {
        try {
          await submit(text, selectedComment?.comment_id);
          commentInputRef?.current?.reset();
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

      setSelectedComment(null);
    },
    [Alert, submit, selectedComment, commentInputRef]
  );

  const handleOnClearPress = useCallback(() => {
    setSelectedComment(null);
    commentInputRef.current?.setValue("");
  }, [commentInputRef]);

  const handleReply = (comment: CommentType) => {
    setSelectedComment(comment);
    commentInputRef.current?.setValue(`@${getUsername(comment)} `);
    commentInputRef.current?.focus();
  };
  //#endregion

  useImperativeHandle(ref, () => ({
    reply: handleReply,
  }));
  return (
    <>
      {selectedComment && (
        <View tw="flex-row items-center justify-between bg-gray-100 px-4 dark:bg-white">
          <Text tw="py-2 text-xs font-bold">{`Reply to @${getUsername(
            selectedComment
          )}`}</Text>
          <Button
            variant="text"
            size="small"
            tw="mr--4"
            onPress={handleOnClearPress}
          >
            <Close color={"black"} width={16} height={16} />
          </Button>
        </View>
      )}
      <MessageBox
        ref={commentInputRef}
        submitting={submitting}
        style={{
          paddingHorizontal: 16,
          marginBottom: Math.max(0, bottom - (visible ? 8 : 0)),
          paddingBottom: 0,
        }}
        onSubmit={handleOnSubmitComment}
        userAvatar={user?.data.profile.img_url}
      />
    </>
  );
});
