import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ViewStyle } from "react-native";

import { Button, TextInput, View } from "design-system";
import { Avatar } from "design-system/avatar";
import { useIsDarkMode } from "design-system/hooks";
import { Send } from "design-system/icon";
import { Spinner } from "design-system/spinner";
import { colors } from "design-system/tailwind/colors";

interface MessageBoxProps {
  submitting?: boolean;
  userAvatar?: string;
  style?: ViewStyle;
  onSubmit?: (text: string) => Promise<void>;
  onFocus?: () => void;
  onBlur?: () => void;
}

export interface MessageBoxMethods {
  focus: () => void;
  reset: () => void;

  setValue: (value: string) => void;
}

export const MessageBox = forwardRef<MessageBoxMethods, MessageBoxProps>(
  function MessageBox(
    { submitting, userAvatar, style, onSubmit, onFocus, onBlur },
    ref
  ) {
    //#region variables
    const isDark = useIsDarkMode();
    const inputRef = useRef<typeof TextInput>();
    const [value, setValue] = useState("");
    //#endregion

    //#region callbacks
    const handleReset = useCallback(() => {
      setValue("");
      // @ts-ignore
      inputRef.current.blur();
    }, [inputRef, setValue]);
    const handleFocus = useCallback(() => {
      // @ts-ignore
      inputRef.current.focus();
    }, []);
    const handleTextChange = (text: string) => setValue(text);
    const handleSubmit = async function handleSubmit() {
      await onSubmit?.(value);
    };
    //#endregion

    useImperativeHandle(
      ref,
      () => ({
        reset: handleReset,
        focus: handleFocus,
        setValue,
      }),
      [handleReset, handleFocus]
    );

    return (
      <View
        pointerEvents={submitting ? "none" : "auto"}
        tw="flex-row items-center bg-white py-4 dark:bg-black"
        style={style}
      >
        <View tw="mr-2 flex-1">
          <TextInput
            //@ts-ignore
            ref={inputRef}
            value={value}
            placeholder="Add a comment..."
            placeholderTextColor={
              isDark ? colors.gray["400"] : colors.gray["500"]
            }
            multiline={true}
            keyboardType="twitter"
            returnKeyType="send"
            tw="rounded-[32px] bg-gray-100 py-3 pr-3 pl-[44px] text-base text-black dark:bg-gray-900 dark:text-white"
            onChangeText={handleTextChange}
            onSubmitEditing={handleSubmit}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          <Avatar tw="absolute mt-3 ml-3" size={24} url={userAvatar} />
        </View>
        <Button size="regular" iconOnly={true} onPress={handleSubmit}>
          {submitting ? <Spinner size="small" /> : <Send />}
        </Button>
      </View>
    );
  }
);
