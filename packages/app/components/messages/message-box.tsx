import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  useMemo,
} from "react";
import { Platform, ViewStyle } from "react-native";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Send } from "@showtime-xyz/universal.icon";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import { TextInput, TextInputProps } from "@showtime-xyz/universal.text-input";
import { View } from "@showtime-xyz/universal.view";

import { useAutoSizeInput } from "app/hooks/use-auto-size-input";

interface MessageBoxProps {
  submitting?: boolean;
  userAvatar?: string;
  style?: ViewStyle;
  onSubmit?: (text: string) => Promise<void>;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder: string;
  textInputProps?: TextInputProps;
  tw?: string;
}

export interface MessageBoxMethods {
  focus: () => void;
  reset: () => void;

  setValue: (value: string) => void;
}

export const MessageBox = forwardRef<MessageBoxMethods, MessageBoxProps>(
  function MessageBox(props, ref) {
    const {
      submitting,
      userAvatar,
      style,
      onSubmit,
      onFocus,
      onBlur,
      placeholder,
      textInputProps,
      tw = "",
    } = props;
    //#region variables
    const isDark = useIsDarkMode();
    const inputRef = useRef<typeof TextInput | HTMLElement>();
    useAutoSizeInput(inputRef);
    const [value, setValue] = useState("");
    const disable = useMemo(() => !value || /^\s+$/.test(value), [value]);
    //#endregion

    //#region callbacks
    const handleReset = useCallback(() => {
      // @ts-ignore
      inputRef?.current?.blur();
      setValue("");
    }, [inputRef, setValue]);
    const handleFocus = useCallback(() => {
      // @ts-ignore
      inputRef.current.focus();
    }, []);
    const handleTextChange = (text: string) => setValue(text);
    const handleSubmit = async function handleSubmit() {
      await onSubmit?.(value);
      if (Platform.OS === "web") {
        (inputRef.current as HTMLElement).style.height = "auto";
      }
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
        tw={["flex-row items-center px-4 py-2", tw].join(" ")}
        style={style}
      >
        <View tw="mr-2 min-h-[40px] flex-1 flex-row items-center rounded-[32px] bg-gray-100 p-2 pl-3 dark:bg-gray-700">
          {userAvatar ? (
            <Avatar alt="Avatar" tw="mr-2" size={24} url={userAvatar} />
          ) : null}
          <TextInput
            ref={inputRef as any}
            value={value}
            placeholder={placeholder}
            placeholderTextColor={isDark ? colors.gray[300] : colors.gray[500]}
            multiline={true}
            tw="ios:pb-1 max-h-20 w-full flex-1 text-sm text-black dark:text-white"
            onChangeText={handleTextChange}
            onFocus={onFocus}
            onBlur={onBlur}
            maxLength={500}
            // @ts-ignore RNW >= v19 & RN >= 0.71 supports these props
            readOnly={submitting}
            rows={1}
            {...textInputProps}
          />
        </View>
        <Button
          size="regular"
          iconOnly={true}
          disabled={disable}
          onPress={handleSubmit}
          style={{
            opacity: 1,
            width: 42,
            height: 42,
            backgroundColor: colors.gray[100],
          }}
        >
          {submitting ? (
            <Spinner
              size="small"
              color={colors.gray[500]}
              secondaryColor="transparent"
            />
          ) : (
            <Send width={20} height={20} />
          )}
        </Button>
      </View>
    );
  }
);
