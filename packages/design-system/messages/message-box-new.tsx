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
import { Send } from "design-system/icon";
import { tw } from "design-system/tailwind";

import { Spinner } from "../spinner";

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
  // eslint-disable-next-line no-unused-vars
  setValue: (value: string) => void;
}

export const MessageBox = forwardRef<MessageBoxMethods, MessageBoxProps>(
  function MessageBox(
    { submitting, userAvatar, style, onSubmit, onFocus, onBlur },
    ref
  ) {
    //#region variables
    const inputRef = useRef<typeof TextInput>();
    const [value, setValue] = useState("");
    //#endregion

    //#region callbacks
    const handleReset = () => {
      setValue("");
      // @ts-ignore
      inputRef.current.blur();
    };
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
        tw="flex-row py-4 items-center bg-white dark:bg-black"
        style={style}
      >
        <View tw="flex-1 mr-2">
          <TextInput
            //@ts-ignore
            ref={inputRef}
            value={value}
            placeholder="Add a comment..."
            placeholderTextColor={
              tw.style("text-gray-500 dark:text-gray-400").color as string
            }
            multiline={true}
            keyboardType="twitter"
            returnKeyType="send"
            tw="py-3 pr-3 pl-[44px] rounded-[32px] text-base text-black dark:text-white bg-gray-100 dark:bg-gray-900"
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
