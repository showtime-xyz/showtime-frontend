import React from "react";
import { Button, ButtonLabel, Text, TextInput, View } from "design-system";
import { useForm, Controller } from "react-hook-form";

export interface LoginPhoneNumberFieldValues {
  phoneNumber: string;
}

interface LoginPhoneNumberFieldProps {
  onSubmit: (value: LoginPhoneNumberFieldValues) => void;
}

export function LoginPhoneNumberField({
  onSubmit,
}: LoginPhoneNumberFieldProps) {
  const { control, handleSubmit, setError } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  return (
    <>
      <Text tw="mb-[16px] font-medium text-gray-900 dark:text-white text-center">
        Enter your phone number to receive a sign in link
      </Text>
      <View tw="p-[16px] mb-[16px] rounded-[16px] bg-gray-100 dark:bg-gray-900">
        <Text tw="mb-[8px] font-bold text-sm text-gray-900 dark:text-white">
          Phone number
        </Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              tw="w-full text-black dark:text-gray-300 rounded-lg focus:outline-none focus-visible:ring-1"
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              placeholder="Enter your phone number"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="telephoneNumber"
              keyboardType="phone-pad"
            />
          )}
          name="phoneNumber"
          rules={{ required: true }}
        />
      </View>
      {/* {errors.phoneNumber && <Text sx={{ fontSize: 12, textAlign: 'center' }}>This is required.</Text>} */}

      <Button
        onPress={handleSubmit(onSubmit)}
        variant="tertiary"
        size="regular"
        tw="mb-[16px]"
      >
        <ButtonLabel tw="text-black dark:text-white">
          Sign in with SMS
        </ButtonLabel>
      </Button>
    </>
  );
}
