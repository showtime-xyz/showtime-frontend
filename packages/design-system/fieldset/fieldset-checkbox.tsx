import { isValidElement, memo, Fragment } from "react";
import { Platform } from "react-native";

import { AnimateHeight } from "@showtime-xyz/universal.accordion";
import { Checkbox, CheckboxProps } from "@showtime-xyz/universal.checkbox";
import { useId } from "@showtime-xyz/universal.input";
import { Label } from "@showtime-xyz/universal.label";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { ErrorText } from "./fieldset";

export type FieldsetCheckboxProps = Omit<CheckboxProps, "checked"> & {
  value: boolean;
  Icon?: JSX.Element | React.ReactNode;
  title?: string;
  errorText?: string;
  helperText?: string;
};

const PlatformAnimateHeight =
  Platform.OS === "web" || Platform.OS === "android" ? Fragment : AnimateHeight;
function FieldsetCheckboxImpl({
  onChange,
  value,
  Icon,
  errorText,
  helperText,
  ...rest
}: FieldsetCheckboxProps) {
  const helperTextId = useId();
  const errorTextId = useId();
  return (
    <View tw="rounded-2xl bg-gray-100 p-4 dark:bg-gray-900">
      <Pressable
        tw="flex-row justify-between "
        onPress={() => onChange?.(!value)}
      >
        <View tw="flex-row items-center">
          {isValidElement(Icon) && Icon}
          <Label tw="ml-2 font-bold text-gray-900 dark:text-white">
            Make it a Raffle
          </Label>
        </View>
        <Checkbox {...rest} checked={value} onChange={onChange} />
      </Pressable>
      <PlatformAnimateHeight>
        {errorText ? <ErrorText id={errorTextId}>{errorText}</ErrorText> : null}
      </PlatformAnimateHeight>
      <PlatformAnimateHeight>
        {helperText ? (
          <>
            <View tw="mt-4 h-[1px] w-full bg-gray-200 dark:bg-gray-800" />
            <View tw="h-4" />
            <Text
              id={helperTextId}
              tw="text-sm leading-6 text-gray-700 dark:text-gray-300"
            >
              {helperText}
            </Text>
          </>
        ) : null}
      </PlatformAnimateHeight>
    </View>
  );
}
export const FieldsetCheckbox = memo(FieldsetCheckboxImpl);
