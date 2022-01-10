import React, { useCallback } from "react";
import { Button, ButtonLabel, Text, TextInput, View } from "design-system";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { yup } from "app/lib/yup";

const validationSchema = yup
  .object({
    // @ts-ignore
    contact: yup.string().or([yup.string().email(), yup.string().phone()]),
  })
  .required();

type FormData = {
  contact?: string;
};

interface LoginEmailFieldProps {
  onSubmitEmail: (value: string) => void;
  onSubmitPhoneNumber: (value: string) => void;
}

export function LoginContactDetailsField({
  onSubmitEmail,
  onSubmitPhoneNumber,
}: LoginEmailFieldProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const handleSubmitContact = useCallback(
    ({ contact }: FormData) => {
      console.log("contact", contact);
      if (contact.includes("@")) {
        onSubmitEmail(contact);
      } else {
        onSubmitPhoneNumber(contact);
      }
    },
    [onSubmitEmail, onSubmitPhoneNumber]
  );
  return (
    <>
      <View tw="p-[16px] mb-[16px] rounded-[16px] bg-gray-100 dark:bg-gray-900">
        <Text tw="mb-[8px] font-bold text-sm text-gray-900 dark:text-white">
          Contact details
        </Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              tw="w-full text-black dark:text-gray-300 rounded-lg focus:outline-none focus-visible:ring-1"
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              placeholder="Enter your email or phone number"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="go"
            />
          )}
          name="contact"
        />
        {errors.contact && (
          <Text tw="text-xs text-red-500 font-semibold mt-[8px]">
            Please enter a valid email address or phone number.
          </Text>
        )}
      </View>

      <Button
        onPress={handleSubmit(handleSubmitContact)}
        variant="tertiary"
        size="regular"
        tw="mb-[16px]"
      >
        <ButtonLabel tw="text-black dark:text-white">Sign in</ButtonLabel>
      </Button>
    </>
  );
}
