import React, { useCallback } from "react";
import { Button, ButtonLabel, Fieldset } from "design-system";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { yup } from "app/lib/yup";
import { TextInputProps } from "react-native";

type FormData = {
  data?: string;
};

interface LoginInputFieldProps
  extends Pick<TextInputProps, "keyboardType" | "textContentType"> {
  label?: string;
  placeholder?: string;
  signInButtonLabel?: string;
  validationSchema: yup.AnyObjectSchema;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (value: string) => void;
}

export function LoginInputField({
  label = "Input Field",
  placeholder = "Enter here",
  signInButtonLabel = "Sign in",
  keyboardType = "default",
  textContentType = "none",
  validationSchema,
  onSubmit,
}: LoginInputFieldProps) {
  //#region hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });
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
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            value={value}
            errorText={errors.data?.message}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType={keyboardType}
            textContentType={textContentType}
            returnKeyType="go"
          />
        )}
        name="data"
      />

      <Button
        onPress={handleSubmit(handleSubmitData)}
        variant="tertiary"
        size="regular"
        tw="mt-6"
      >
        <ButtonLabel tw="text-black dark:text-white">
          {signInButtonLabel}
        </ButtonLabel>
      </Button>
    </>
  );
}
