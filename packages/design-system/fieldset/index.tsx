import { View } from "design-system/view";
import { Text } from "design-system/text";
import { TextInput, TextInputProps } from "design-system/text-input";
import { Label } from "design-system/label";
import { useId } from "design-system/input";
import { Platform } from "react-native";
import { useIsDarkMode } from "design-system/hooks";
import { tw } from "design-system/tailwind";
import { SelectProps } from "design-system/select/types";
import { Select } from "design-system/select";

type FieldsetProps = {
  errorText?: string;
  label?: string;
  helperText?: string;
  disabled?: boolean;
  tw?: string;
  select?: SelectProps;
  selectOnly?: boolean;
  leftElement?: React.ReactNode;
} & TextInputProps;

export function Fieldset(props: FieldsetProps) {
  const {
    errorText,
    accessibilityLabel,
    helperText,
    label,
    disabled,
    select,
    tw: twProp = "",
    leftElement,
    selectOnly,
    ...textInputProps
  } = props;
  let style = "bg-gray-100 dark:bg-gray-900";
  if (disabled) {
    style += " opacity-40";
  }
  const isDark = useIsDarkMode();
  const inputId = useId();
  const helperTextId = useId();
  const errorTextId = useId();

  return (
    <View tw={`p-4 rounded-4 ${style} ${twProp}`}>
      <Label htmlFor={inputId} tw="font-bold text-gray-900 dark:text-white">
        {label}
      </Label>
      <View tw="mt-4 flex-row items-center">
        {leftElement}
        {!selectOnly ? (
          <TextInput
            tw="flex-1 text-black dark:text-gray-300 focus:outline-none focus-visible:ring-1"
            {...textInputProps}
            style={{
              fontSize: 16,
            }}
            editable={disabled}
            nativeID={inputId}
            accessibilityLabel={accessibilityLabel}
            placeholderTextColor={
              isDark ? tw.color("gray-400") : tw.color("gray-600")
            }
            selectionColor={
              isDark ? tw.color("gray-300") : tw.color("gray-700")
            }
            //@ts-ignore - web only
            accessibilityDescribedBy={Platform.select({
              web: helperText ? helperTextId : undefined,
              default: undefined,
            })}
            accessibilityErrorMessage={Platform.select({
              web: errorText ? errorTextId : undefined,
              default: undefined,
            })}
            accessibilityInvalid={Platform.select({
              web: errorText ? true : false,
              default: undefined,
            })}
          />
        ) : null}

        {select ? (
          <Select disabled={disabled} size="small" {...select} />
        ) : null}
      </View>
      {errorText ? (
        <ErrorText nativeID={errorTextId}>{errorText}</ErrorText>
      ) : null}
      {helperText ? (
        <>
          <View tw="mt-4 h-[1px] w-full bg-gray-200 dark:bg-gray-800" />
          <Text
            nativeID={helperTextId}
            tw="mt-4 text-sm dark:text-gray-300 text-gray-700"
          >
            {helperText}
          </Text>
        </>
      ) : null}
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
    <Text nativeID={nativeID} tw="mt-4 text-sm text-red-500 font-semibold">
      {children}
    </Text>
  );
};
