import React, { useCallback } from "react";
import { TextInputProps } from "react-native";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

import { Button } from "@showtime-xyz/universal.button";
import { Fieldset } from "@showtime-xyz/universal.fieldset";

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
  textInputRef?: any;
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
  textInputRef,
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
  //#endregion

  //#region callbacks
  const handleSubmitData = useCallback(
    ({ data }: FormData) => {
      onSubmit(data ?? "");
    },
    [onSubmit]
  );

  //#endregion
  return (
    <>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Fieldset
            label={label}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder={placeholder}
            //@ts-ignore
            ref={textInputRef}
            value={value}
            errorText={errors.data?.message}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType={keyboardType}
            textContentType={textContentType}
            leftElement={leftElement}
            returnKeyType="go"
            onSubmitEditing={handleSubmit(handleSubmitData)}
          />
        )}
        name={INPUT_NAME}
      />

      <Button
        onPress={handleSubmit(handleSubmitData)}
        variant="primary"
        size="regular"
        tw={`mt-6 ${!inputValue ? "opacity-60" : null}`}
        disabled={!inputValue}
      >
        {signInButtonLabel}
      </Button>
    </>
  );
}
