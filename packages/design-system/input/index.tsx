import { forwardRef, useMemo } from "react";
import {
  Platform,
  StyleProp,
  StyleSheet,
  TextInputProps,
  TextStyle,
} from "react-native";

import { TextInput } from "dripsy";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import { useColorScheme, useIsDarkMode, useOnFocus } from "../hooks";
import { Label } from "../label";
import { Pressable, Props as PressableProps } from "../pressable-scale";
import { tw } from "../tailwind";
import { colors } from "../tailwind/colors";
import { Text } from "../text";
import { View } from "../view";

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
};

const borderColor = {
  dark: "#52525B",
  light: "#E4E4E7",
};

const boxShadow = {
  dark: borderColor.dark + " 0px 0px 0px 4px",
  light: borderColor.light + " 0px 0px 0px 4px",
};

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
  } = props;
  const { onFocus, onBlur, focused } = useOnFocus();
  const colorScheme = useColorScheme();
  const isDark = useIsDarkMode();

  const inputId = useId(props.id);
  const helperTextId = useId();
  const errorTextId = useId();

  const animatableStyle = useAnimatedStyle(() => {
    return {
      boxShadow:
        Platform.OS === "web" && focused.value
          ? boxShadow[colorScheme]
          : undefined,
      opacity: disabled ? 0.75 : 1,
    };
  }, [focused, disabled]);

  return (
    <View>
      {label ? (
        <Label
          variant="text-sm"
          htmlFor={inputId}
          tw="text-gray-900 dark:text-white"
          sx={{ marginBottom: 4, fontWeight: "700" }}
        >
          {label}
        </Label>
      ) : null}
      <Animated.View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 999,
            ...tw.style(
              `bg-gray-100 dark:bg-gray-900 ${
                isInvalid ? "border-red-500 border" : ""
              }`
            ),
          },
          // @ts-ignore
          animatableStyle,
        ]}
      >
        {leftElement}
        <TextInput
          sx={{
            flexGrow: 1,
            paddingY: 12,
            paddingLeft: leftElement ? 0 : 16,
            paddingRight: rightElement ? 0 : 16,
            fontWeight: "500",
            ...tw.style("text-gray-900 dark:text-white"),
          }}
          // @ts-ignore remove focus outline on web as we'll control the focus styling
          style={StyleSheet.flatten([
            Platform.select({
              web: {
                outline: "none",
              },
              default: undefined,
            }),
            props.inputStyle,
          ])}
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
        />
        {rightElement && (
          <View sx={{ marginLeft: "auto" }}>{rightElement}</View>
        )}
      </Animated.View>
      {helperText ? (
        <Text
          variant="text-sm"
          nativeID={helperTextId}
          tw="text-gray-600 dark:text-gray-400"
          sx={{ marginTop: 4, fontWeight: "600" }}
        >
          {helperText}
        </Text>
      ) : null}
      {errorText ? (
        <Text
          nativeID={errorTextId}
          variant="text-sm"
          tw="text-red-500"
          sx={{ marginTop: 4, fontWeight: "600" }}
        >
          {errorText}
        </Text>
      ) : null}
    </View>
  );
});

// This component adds appropriate padding to match our design system and increase the pressable area
// Usage - with rightElement and leftElement
export const InputPressable = (props: PressableProps) => {
  return <Pressable tw="p-2" {...props} />;
};
