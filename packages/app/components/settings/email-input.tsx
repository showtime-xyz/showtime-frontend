import { useCallback, useEffect, useMemo, useRef } from "react";
import { TextInputProps } from "react-native";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

import { BottomSheetTextInput } from "@showtime-xyz/universal.bottom-sheet";
import { Button } from "@showtime-xyz/universal.button";
import { Fieldset } from "@showtime-xyz/universal.fieldset";
import { Text } from "@showtime-xyz/universal.text";

import { yup } from "app/lib/yup";

type FormData = {
  data?: string;
};

interface EmailInputProps
  extends Pick<TextInputProps, "keyboardType" | "textContentType"> {
  label: string;
  placeholder: string;
  submitButtonLabel: string;
  onSubmit: (value: string) => void;
}

export const EmailInput = (props: EmailInputProps) => {
  const label = props.label;
  const onSubmit = props.onSubmit;
  const placeholder = props.placeholder;
  const keyboardType = props.keyboardType;
  const submitButtonLabel = props.submitButtonLabel;
  const textContentType = props.textContentType;

  const ref = useRef<typeof BottomSheetTextInput>();

  const emailValidationSchema = useMemo(
    () =>
      yup
        .object({
          data: yup
            .string()
            .email("Please enter a valid email address.")
            .required("Please enter a valid email address."),
        })
        .required(),
    []
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(emailValidationSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const handleSubmitData = useCallback(
    ({ data }: FormData) => {
      onSubmit(data ?? "");
    },
    [onSubmit]
  );

  useEffect(() => {
    //@ts-ignore
    ref.current?.focus();
  }, []);

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
            componentRef={ref}
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
        <Text tw="text-black dark:text-white">{submitButtonLabel}</Text>
      </Button>
    </>
  );
};
