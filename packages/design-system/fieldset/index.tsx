import { View } from "design-system/view";
import { Text } from "design-system/text";
import { TextInput, TextInputProps } from "design-system/text-input";
import { Label } from "design-system/label";
import { useId } from "../input";
import { Platform } from "react-native";

type FieldsetProps = {
  errorText?: string;
  helperText?: string;
  disabled?: boolean;
} & TextInputProps;

export function Fieldset(props: FieldsetProps) {
  const {
    errorText,
    accessibilityLabel,
    helperText,
    disabled,
    ...textInputProps
  } = props;
  let style = "";
  if (disabled) {
    style += "opacity-40";
  }

  const inputId = useId();
  const helperTextId = useId();
  const errorTextId = useId();

  return (
    <View tw={`p-4 rounded-4 ${style}`}>
      <Label
        htmlFor={inputId}
        tw="font-bold Lab-sm text-gray-900 dark:text-white"
      >
        Contact details
      </Label>
      <TextInput
        tw="mt-4 text-base w-full text-black dark:text-gray-300 focus:outline-none focus-visible:ring-1"
        {...textInputProps}
        editable={disabled}
        nativeID={inputId}
        accessibilityLabel={accessibilityLabel}
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
      {errorText ? (
        <Text
          nativeID={errorTextId}
          tw="mt-4 text-sm text-red-500 font-semibold"
        >
          {errorText}
        </Text>
      ) : null}
      {helperText ? (
        <>
          <View tw="mt-4 h-[1px] w-full bg-gray-200" />
          <Text nativeID={helperTextId} tw="mt-4 text-sm">
            This is a helper text
          </Text>
        </>
      ) : null}
    </View>
  );
}
