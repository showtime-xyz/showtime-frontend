import React, { useCallback } from "react";
import { TextInputProps } from "react-native";

import { useBottomSheetInternal } from "@gorhom/bottom-sheet";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

import { Button } from "@showtime-xyz/universal.button";
import { Fieldset } from "@showtime-xyz/universal.fieldset";
import { Text } from "@showtime-xyz/universal.text";

import { yup } from "app/lib/yup";

type FormData = {
  data?: string;
};

interface LoginInputFieldProps
  extends Pick<TextInputProps, "keyboardType" | "textContentType"> {
  label?: string;
  placeholder?: string;
  signInButtonLabel?: string;
  validationSchema?: yup.AnyObjectSchema;
  leftElement?: React.ReactNode;
  onSubmit: (value: string) => void;
}

const INPUT_NAME = "data";

export function LoginInputField({
  label = "Input Field",
  placeholder = "Enter here",
  signInButtonLabel = "Sign in",
  keyboardType = "default",
  textContentType = "none",
  validationSchema,
  leftElement,
  onSubmit,
}: LoginInputFieldProps) {
  //#region hooks
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: validationSchema ? yupResolver(validationSchema) : undefined,
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const inputValue = watch(INPUT_NAME);
  const bottomSheetContext = useBottomSheetInternal(true);
  //#endregion

  //#region callbacks
  const handleSubmitData = useCallback(
    ({ data }: FormData) => {
      onSubmit(data ?? "");
    },
    [onSubmit]
  );
  const handleOnBlur = useCallback(
    (onBlur) => {
      if (bottomSheetContext) {
        bottomSheetContext.shouldHandleKeyboardEvents.value = false;
      }
      onBlur();
    },
    [bottomSheetContext]
  );
  const handleOnFocus = useCallback(() => {
    if (bottomSheetContext) {
      bottomSheetContext.shouldHandleKeyboardEvents.value = true;
    }
  }, [bottomSheetContext]);
  //#endregion
  return (
    <>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Fieldset
            label={label}
            onChangeText={onChange}
            onBlur={() => handleOnBlur(onBlur)}
            onFocus={handleOnFocus}
            placeholder={placeholder}
            value={value}
            errorText={errors.data?.message}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType={keyboardType}
            textContentType={textContentType}
            leftElement={leftElement}
            returnKeyType="go"
          />
        )}
        name={INPUT_NAME}
      />

      <Button
        onPress={handleSubmit(handleSubmitData)}
        variant="primary"
        size="regular"
        tw="mt-6"
        disabled={!inputValue}
      >
        <Text tw="text-black dark:text-white">{signInButtonLabel}</Text>
      </Button>
    </>
  );
}
