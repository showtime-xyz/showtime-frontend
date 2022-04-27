import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ViewStyle } from "react-native";

import { useBottomSheetInternal } from "@gorhom/bottom-sheet";

import { CommentType } from "app/hooks/api/use-comments";
import { useUser } from "app/hooks/use-user";
import { useSafeAreaInsets } from "app/lib/safe-area";
import { formatAddressShort } from "app/utilities";

import { Button, Text, View } from "design-system";
import { useAlert } from "design-system/alert";
import { Close } from "design-system/icon";
import {
  MessageBox,
  MessageBoxMethods,
} from "design-system/messages/message-box-new";

interface CommentInputBoxProps {
  submitting?: boolean;
  style?: ViewStyle;
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
>(function CommentInputBox({ submitting, submit }, ref) {
  //#region variables
  const Alert = useAlert();
  const inputRef = useRef<MessageBoxMethods>(null);
  const [selectedComment, setSelectedComment] = useState<CommentType | null>(
    null
  );
  const { bottom } = useSafeAreaInsets();
  const context = useBottomSheetInternal(true);
  const { user } = useUser();
  //#endregion

  //#region callbacks
  const handleOnSubmitComment = useCallback(
    async function handleOnSubmitComment(text: string) {
      const _newComment = async () => {
        try {
          await submit(text, selectedComment?.comment_id);
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

      setSelectedComment(null);
    },
    [submit, selectedComment]
  );

  const handleOnBlur = useCallback(() => {
    if (context) {
      context.shouldHandleKeyboardEvents.value = false;
    }
  }, [context]);

  const handleOnFocus = useCallback(() => {
    if (context) {
      context.shouldHandleKeyboardEvents.value = true;
    }
  }, [context]);

  const handleOnClearPress = useCallback(() => {
    setSelectedComment(null);
    inputRef.current?.setValue("");
  }, []);

  const handleReply = (comment: CommentType) => {
    setSelectedComment(comment);
    inputRef.current?.setValue(`@${getUsername(comment)} `);
    inputRef.current?.focus();
  };
  //#endregion

  useImperativeHandle(ref, () => ({
    reply: handleReply,
  }));

  return (
    <>
      {selectedComment && (
        <View tw="bg-gray-900 dark:bg-white flex-row justify-between items-center px-4">
          <Text variant="text-xs" tw="font-bold py-2">{`Reply to @${getUsername(
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
        ref={inputRef}
        submitting={submitting}
        style={{
          paddingHorizontal: 16,
          marginBottom: Math.max(0, bottom - 16),
          paddingBottom: 0,
        }}
        onSubmit={handleOnSubmitComment}
        onBlur={context ? handleOnBlur : undefined}
        onFocus={context ? handleOnFocus : undefined}
        userAvatar={user?.data.profile.img_url}
      />
    </>
  );
});
