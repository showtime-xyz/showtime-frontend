import { forwardRef, useMemo } from "react";
import { Platform, StyleProp, TextInputProps, TextStyle } from "react-native";

import { useOnFocus, useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Label } from "@showtime-xyz/universal.label";
import {
  PressableScale,
  Props as PressableProps,
} from "@showtime-xyz/universal.pressable-scale";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { TextInput } from "@showtime-xyz/universal.text-input";
import { View } from "@showtime-xyz/universal.view";

type InputProps = {
  leftElement?: JSX.Element;
  rightElement?: JSX.Element;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  value?: string;
  isInvalid?: boolean;
  id?: string;
  disabled?: boolean;
  type?: TextInputProps["keyboardType"];
  label?: string;
  errorText?: string;
  helperText?: string;
  accessibilityLabel?: string;
  autoFocus?: boolean;
  inputStyle?: StyleProp<TextStyle>;
  autocomplete?: "on" | "off";
};

const BOX_SHADOW_LIGNT = "#E4E4E7 0px 0px 0px 4px";
const BOX_SHADOW_DARK = "#52525B 0px 0px 0px 4px";

let idCounter = 0;
// Replace this with useId from React 18. Currently we're doing client side rendering, so probably this is safe!
export const useId = (id?: string) => {
  const newId = useMemo(() => {
    if (id) {
      return id;
    } else {
      idCounter++;
      return idCounter.toString();
    }
  }, [id]);

  return newId;
};

export const Input = forwardRef((props: InputProps, ref: any) => {
  const {
    leftElement,
    rightElement,
    placeholder,
    onChangeText,
    value,
    label,
    helperText,
    errorText,
    disabled,
    type,
    isInvalid,
    accessibilityLabel,
    autoFocus,
    autocomplete,
  } = props;
  const { onFocus, onBlur, focused } = useOnFocus();
  const isDark = useIsDarkMode();
  const inputId = useId(props.id);
  const helperTextId = useId();
  const errorTextId = useId();

  return (
    <View>
      {label ? (
        <>
          <Label
            htmlFor={inputId}
            tw="text-sm font-bold text-gray-900 dark:text-white"
          >
            {label}
          </Label>
          <View tw="h-2" />
        </>
      ) : null}

      <View
        tw={[
          "transition-all duration-300",
          focused.value ? "dark:shadow-dark shadow-light" : "",
        ]}
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 9999,
            backgroundColor: isDark ? colors.gray[900] : colors.gray[100],
            borderColor: isInvalid ? colors.red[500] : undefined,
            borderWidth: isInvalid ? 1 : undefined,
            opacity: disabled ? 0.75 : 1,
          },
        ]}
      >
        {leftElement}
        <TextInput
          tw="text-gray-900 dark:text-white"
          style={[
            // @ts-ignore remove focus outline on web as we'll control the focus styling
            Platform.select({
              web: {
                outline: "none",
              },
              default: undefined,
            }),
            {
              flexGrow: 1,
              paddingTop: Platform.select({
                ios: 16,
                default: 12,
              }),
              paddingBottom: Platform.select({
                ios: 16,
                default: 12,
              }),
              paddingLeft: leftElement ? 0 : 16,
              paddingRight: rightElement ? 0 : 16,
              fontWeight: "500",
            },
            props.inputStyle,
          ]}
          placeholderTextColor={
            isDark ? colors.gray["400"] : colors.gray["500"]
          }
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          editable={!disabled}
          onFocus={onFocus}
          onBlur={onBlur}
          nativeID={inputId}
          selectionColor={isDark ? colors.gray["300"] : colors.gray["700"]}
          keyboardType={type}
          disabled={disabled}
          autoFocus={autoFocus}
          accessibilityLabel={accessibilityLabel}
          accessibilityDescribedBy={Platform.select({
            web: helperText ? helperTextId : undefined,
            default: undefined,
          })}
          accessibilityErrorMessage={Platform.select({
            web: errorText ? errorTextId : undefined,
            default: undefined,
          })}
          accessibilityInvalid={Platform.select({
            web: isInvalid,
            default: undefined,
          })}
          ref={ref}
          autocomplete={autocomplete}
        />
        {rightElement && (
          <View style={{ marginLeft: "auto" }}>{rightElement}</View>
        )}
      </View>
      {helperText ? (
        <Text
          nativeID={helperTextId}
          tw="text-sm text-gray-600 dark:text-gray-400"
          style={{ marginTop: 4, fontWeight: "600" }}
        >
          {helperText}
        </Text>
      ) : null}
      {errorText ? (
        <Text
          nativeID={errorTextId}
          tw="text-sm text-red-500"
          style={{ marginTop: 4, fontWeight: "600" }}
        >
          {errorText}
        </Text>
      ) : null}
    </View>
  );
});

Input.displayName = "Input";

// This component adds appropriate padding to match our design system and increase the pressable area
// Usage - with rightElement and leftElement
export const InputPressable = (props: PressableProps) => {
  return <PressableScale style={{ padding: 8 }} {...props} />;
};
