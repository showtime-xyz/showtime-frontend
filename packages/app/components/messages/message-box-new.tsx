import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  useMemo,
} from "react";
import { ViewStyle } from "react-native";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { Button } from "@showtime-xyz/universal.button";
import { Send } from "@showtime-xyz/universal.icon";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { tw } from "@showtime-xyz/universal.tailwind";
import { TextInput } from "@showtime-xyz/universal.text-input";
import { View } from "@showtime-xyz/universal.view";

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
    const inputRef = useRef<typeof TextInput>();
    const [value, setValue] = useState("");
    const disable = useMemo(() => !value || /^\s+$/.test(value), [value]);
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
              tw.style("text-gray-500 dark:text-gray-400").color as string
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
          <Avatar tw="absolute mt-1 ml-3" size={24} url={userAvatar} />
        </View>
        <Button
          size="regular"
          iconOnly={true}
          disabled={disable}
          onPress={handleSubmit}
        >
          {submitting ? <Spinner size="small" /> : <Send />}
        </Button>
      </View>
    );
  }
);
