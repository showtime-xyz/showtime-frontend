import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  useMemo,
  KeyboardEvent,
} from "react";
import { Platform, ViewStyle } from "react-native";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Send } from "@showtime-xyz/universal.icon";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import {
  TextInput,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "@showtime-xyz/universal.text-input";
import { View } from "@showtime-xyz/universal.view";

import { useAutoSizeInput } from "app/hooks/use-auto-size-input";

interface MessageBoxProps {
  submitting?: boolean;
  userAvatar?: string;
  style?: ViewStyle;
  onSubmit?: (text: string) => Promise<void>;
  onFocus?: () => void;
  onBlur?: () => void;
  handleShiftEnter?: boolean;
  placeholder: string;
  textInputProps?: TextInputProps;
  tw?: string;
  submitButton?: React.ReactNode;
  backgroundColor?: string | null;
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
      submitButton,
      handleShiftEnter = true,
      tw = "",
      backgroundColor,
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
      setValue("");
      // @ts-ignore
      inputRef?.current?.blur();
    }, [inputRef]);
    const handleFocus = useCallback(() => {
      // @ts-ignore
      inputRef.current.focus();
    }, []);
    const handleTextChange = useCallback((text: string) => {
      setValue(text);
    }, []);
    const handleSubmit = useCallback(async () => {
      if (value && value.trim().length > 0) {
        await onSubmit?.(value);
        if (Platform.OS === "web") {
          (inputRef.current as HTMLElement).style.height = "auto";
        }
      }
    }, [onSubmit, value]);

    const handleKeyDown = useCallback(
      (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        if (handleShiftEnter && Platform.OS === "web") {
          if (
            event.nativeEvent.key === "Enter" &&
            !(event as unknown as KeyboardEvent<HTMLInputElement>).shiftKey
          ) {
            event.preventDefault();
            handleSubmit();
          }
        }
      },
      [handleShiftEnter, handleSubmit]
    );
    //#endregion

    useImperativeHandle(
      ref,
      () => ({
        reset: handleReset,
        focus: handleFocus,
        setValue,
        value,
      }),
      [handleReset, handleFocus, value]
    );
    return (
      <View
        tw={["flex-row items-center py-2 pl-6 pr-4", tw].join(" ")}
        style={style}
      >
        <View
          tw="mr-2 min-h-[40px] flex-1 flex-row items-center rounded-[20px] bg-gray-100 p-2 pl-3 dark:bg-gray-700"
          style={{
            borderBottomLeftRadius: 0,
          }}
        >
          <View
            tw="absolute -left-2.5 bottom-0 h-5 w-2.5 bg-gray-100 dark:bg-gray-700"
            style={{
              borderBottomLeftRadius: 40,
            }}
          >
            <View
              tw="absolute bottom-0 h-5 w-2.5"
              style={{
                borderBottomRightRadius: 10,
                backgroundColor:
                  backgroundColor ?? (isDark ? colors.black : colors.white),
              }}
            >
              <View
                tw="absolute bottom-0 left-[5px] h-[1.5px] w-1 bg-gray-100 dark:bg-gray-700"
                style={{
                  borderTopStartRadius: 4,
                  borderBottomStartRadius: 4,
                }}
              />
            </View>
          </View>
          {userAvatar ? (
            <Avatar alt="Avatar" tw="mr-2" size={24} url={userAvatar} />
          ) : null}
          <TextInput
            ref={inputRef as any}
            value={value}
            placeholder={placeholder}
            placeholderTextColor={isDark ? colors.gray[300] : colors.gray[500]}
            multiline={true}
            tw="ios:pb-1 max-h-20 w-full flex-1 text-base text-black dark:text-white md:text-sm"
            onChangeText={handleTextChange}
            onFocus={onFocus}
            onBlur={onBlur}
            maxLength={500}
            onKeyPress={handleKeyDown}
            autoCapitalize="none"
            // @ts-ignore RNW >= v19 & RN >= 0.71 supports these props
            readOnly={submitting}
            rows={1}
            {...textInputProps}
          />
        </View>
        {submitButton ? (
          submitButton
        ) : (
          <Button
            size="regular"
            iconOnly={true}
            disabled={disable || submitting}
            onPress={handleSubmit}
            tw={disable ? "opacity-60" : ""}
            style={{
              width: 40,
              height: 40,
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
        )}
      </View>
    );
  }
);
