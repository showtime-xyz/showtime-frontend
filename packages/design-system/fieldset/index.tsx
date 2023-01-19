import {
  MutableRefObject,
  ComponentType,
  forwardRef,
  Fragment,
  isValidElement,
} from "react";
import { Platform, StyleProp, ViewStyle } from "react-native";

import { AnimateHeight } from "@showtime-xyz/universal.accordion";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useId } from "@showtime-xyz/universal.input";
import { Label } from "@showtime-xyz/universal.label";
import { Select } from "@showtime-xyz/universal.select";
import type { SelectProps } from "@showtime-xyz/universal.select";
import { Switch } from "@showtime-xyz/universal.switch";
import type { SwitchProps } from "@showtime-xyz/universal.switch";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { TextInput } from "@showtime-xyz/universal.text-input";
import type { TextInputProps } from "@showtime-xyz/universal.text-input";
import { View } from "@showtime-xyz/universal.view";

const PlatformAnimateHeight = Platform.OS === "web" ? Fragment : AnimateHeight;

export type FieldsetProps = {
  errorText?: string;
  label?: string | JSX.Element;
  helperText?: string;
  disabled?: boolean;
  tw?: string;
  select?: SelectProps;
  switchProps?: SwitchProps;
  selectOnly?: boolean;
  switchOnly?: boolean;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  Component?: ComponentType;
  required?: boolean;
  componentRef?: MutableRefObject<ComponentType | undefined>;
  containerStyle?: StyleProp<ViewStyle>;
} & TextInputProps;

function FieldsetImpl(props: FieldsetProps, ref: any) {
  const {
    errorText,
    accessibilityLabel,
    helperText,
    label,
    disabled,
    select,
    switchProps,
    tw: twProp = "",
    leftElement,
    rightElement,
    selectOnly,
    switchOnly,
    required,
    componentRef,
    Component = TextInput,
    containerStyle,
    ...textInputProps
  } = props;
  const isDark = useIsDarkMode();
  const inputId = useId();
  const helperTextId = useId();
  const errorTextId = useId();

  return (
    <View
      tw={[
        "rounded-2xl bg-gray-100 p-4 dark:bg-gray-900",
        disabled ? "opacity-40" : "",
        switchOnly ? "flex-1 flex-row items-center justify-between" : "",
        twProp,
      ]}
      style={containerStyle}
    >
      <View tw="flex-row">
        {isValidElement(label) ? (
          label
        ) : (
          <Label htmlFor={inputId} tw="font-bold text-gray-900 dark:text-white">
            {label}
          </Label>
        )}

        {required ? <Text tw="ml-1 text-red-500">*</Text> : null}
      </View>

      <View tw="ml-auto">
        {switchProps ? <Switch {...switchProps} /> : null}
      </View>
      {!switchProps ? (
        <View tw="mt-4 flex-row items-center">
          {leftElement}
          {!selectOnly ? (
            <Component
              tw="flex-1 text-base text-black focus-visible:ring-1 dark:text-white"
              //@ts-ignore - web only
              style={Platform.select({
                web: { outline: "none" },
                default: undefined,
              })}
              ref={ref}
              editable={!disabled}
              nativeID={inputId}
              accessibilityLabel={accessibilityLabel}
              multiline={textInputProps.multiline}
              numberOfLines={textInputProps.numberOfLines ?? 1}
              blurOnSubmit={textInputProps.blurOnSubmit}
              textAlignVertical="bottom"
              placeholderTextColor={
                isDark ? colors.gray[400] : colors.gray[600]
              }
              selectionColor={isDark ? colors.gray[300] : colors.gray[700]}
              //@ts-ignore - web only
              accessibilityDescribedBy={Platform.select({
                web: helperText ? helperTextId : undefined,
                default: undefined,
              })}
              accessibilityErrorMessage={Platform.select({
                web: errorText ? errorTextId : undefined,
                default: undefined,
              })}
              accessibilityRequired={required}
              accessibilityInvalid={Platform.select({
                web: errorText ? true : false,
                default: undefined,
              })}
              {...textInputProps}
            />
          ) : null}

          {select ? (
            <Select disabled={disabled} size="small" {...select} />
          ) : null}
          {rightElement}
        </View>
      ) : null}

      <PlatformAnimateHeight>
        {errorText ? (
          <ErrorText nativeID={errorTextId}>{errorText}</ErrorText>
        ) : null}
      </PlatformAnimateHeight>
      <PlatformAnimateHeight>
        {helperText ? (
          <>
            <View tw="mt-4 h-[1px] w-full bg-gray-200 dark:bg-gray-800" />
            <View tw="h-4" />
            <Text
              nativeID={helperTextId}
              tw="text-sm text-gray-700 dark:text-gray-300"
            >
              {helperText}
            </Text>
          </>
        ) : null}
      </PlatformAnimateHeight>
    </View>
  );
}

export const ErrorText = ({
  children,
  nativeID,
}: {
  children: string;
  nativeID?: string;
}) => {
  return (
    <>
      <View tw="h-4" />
      <Text nativeID={nativeID} tw="text-sm font-semibold text-red-500">
        {children}
      </Text>
    </>
  );
};

export const Fieldset = forwardRef(FieldsetImpl);
