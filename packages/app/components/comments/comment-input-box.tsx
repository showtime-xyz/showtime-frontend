import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { ViewStyle } from "react-native";

import { MessageBox } from "app/components/messages/message-box";
import { CommentType } from "app/hooks/api/use-comments";
import { useUser } from "app/hooks/use-user";
import { formatAddressShort } from "app/utilities";

import { useAlert } from "design-system/alert";
import { Button } from "design-system/button";
import { Close } from "design-system/icon";
import { Text } from "design-system/text";
import { View } from "design-system/view";

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
  const [selectedComment, setSelectedComment] = useState<CommentType | null>(
    null
  );
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
            tw="mr-4"
            onPress={handleOnClearPress}
          >
            <Close color={"black"} width={16} height={16} />
          </Button>
        </View>
      )}
      <MessageBox
        ref={commentInputRef}
        submitting={submitting}
        onSubmit={handleOnSubmitComment}
        userAvatar={user?.data.profile.img_url}
      />
    </>
  );
});
