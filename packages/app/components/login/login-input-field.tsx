import React, { useCallback } from "react";
import { Button, ButtonLabel, Text, TextInput, View } from "design-system";
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
      <View tw="p-[16px] mb-[16px] rounded-[16px] bg-gray-100 dark:bg-gray-900">
        <Text tw="mb-[8px] font-bold text-sm text-gray-900 dark:text-white">
          {label}
        </Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              tw="w-full text-black dark:text-gray-300 rounded-lg focus:outline-none focus-visible:ring-1"
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              placeholder={placeholder}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType={keyboardType}
              textContentType={textContentType}
              returnKeyType="go"
            />
          )}
          name="data"
        />
        {errors.data && (
          <Text tw="text-xs text-red-500 font-semibold mt-[8px]">
            {errors.data.message}
          </Text>
        )}
      </View>

      <Button
        onPress={handleSubmit(handleSubmitData)}
        variant="tertiary"
        size="regular"
        tw="mb-[16px]"
      >
        <ButtonLabel tw="text-black dark:text-white">
          {signInButtonLabel}
        </ButtonLabel>
      </Button>
    </>
  );
}
