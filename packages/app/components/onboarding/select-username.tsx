import React, { useEffect, useMemo, useContext, useRef } from "react";
import { Platform, TextInput } from "react-native";

import { yupResolver } from "@hookform/resolvers/yup";
import { MotiView } from "moti";
import { Controller, useForm } from "react-hook-form";
import { useSWRConfig } from "swr";

import { Button } from "@showtime-xyz/universal.button";
import { Fieldset } from "@showtime-xyz/universal.fieldset";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { USER_PROFILE_KEY } from "app/hooks/api-hooks";
import { useMatchMutate } from "app/hooks/use-match-mutate";
import { useValidateUsername } from "app/hooks/use-validate-username";
import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { yup } from "app/lib/yup";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";

import { Spinner } from "design-system/spinner";

import { OnboardingStepContext } from "./onboarding-context";
import { OnboardingStep } from "./onboarding-types";

const editProfileValidationSchema = yup.object({
  username: yup
    .string()
    .required()
    .typeError("Please enter a valid username")
    .label("Username")
    .min(2)
    .max(30)
    .matches(
      /^([0-9a-zA-Z_]{2,30})$/g,
      "Invalid username. Use only letters, numbers, and underscores (_)."
    ),
});

export const SelectUsername = () => {
  const usernameRef = useRef<TextInput | null>(null);
  const { user, setStep } = useContext(OnboardingStepContext);
  const { mutate } = useSWRConfig();
  const matchMutate = useMatchMutate();
  const {
    isValid: isValidUsername,
    validate,
    isLoading,
  } = useValidateUsername();

  const defaultValues = useMemo(() => {
    return {
      username: user?.data?.profile.username ?? "",
    };
  }, [user?.data?.profile]);

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting, isValid: isFormValid },
    reset,
  } = useForm<{ username: string }>({
    resolver: yupResolver(editProfileValidationSchema),
    mode: "all",
    reValidateMode: "onChange",
    shouldFocusError: true,
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  const handleSubmitForm = async (values: typeof defaultValues) => {
    if (!isFormValid || !isValidUsername || isLoading || isSubmitting) return;

    const newValues = {
      username: values.username?.trim() || null,
    };

    try {
      await axios({
        url: "/v1/editname",
        method: "POST",
        data: newValues,
      });

      setStep(OnboardingStep.Picture);

      // TODO: optimise to make fewer API calls!
      mutate(MY_INFO_ENDPOINT);
      matchMutate(
        (key) => typeof key === "string" && key.includes(USER_PROFILE_KEY)
      );
    } catch (e) {
      setError("username", { message: "Something went wrong" });
      Logger.error("Profile Username Onboarding failed ", e);
    }
  };

  return (
    <MotiView
      from={{
        opacity: 0,
        scale: 0.8,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      exit={() => {
        "worklet";
        return {
          opacity: 0,
          scale: 0.9,
        };
      }}
      exitTransition={{
        type: "timing",
        duration: 600,
      }}
      style={{ flex: 1 }}
    >
      <View tw="flex-1 px-4 text-center">
        <View tw="items-center">
          <View tw="h-4" />
          <Text tw="text-xl font-bold text-gray-900 dark:text-gray-100">
            First, create your profile
          </Text>
          <View tw="h-6" />
          <Text tw="text-center text-sm font-semibold text-gray-500 dark:text-gray-400">
            You can always change your username later.
          </Text>
        </View>
        <View tw="mt-8 flex flex-grow-0">
          <Controller
            control={control}
            name="username"
            render={({
              field: { onChange, onBlur, value, ref },
              fieldState: { error },
            }) => (
              <Fieldset
                ref={(innerRef: TextInput) => {
                  usernameRef.current = innerRef;
                  ref(innerRef);
                }}
                placeholder="your_username"
                value={value}
                textContentType="username"
                errorText={
                  !isValidUsername && !error
                    ? "Username taken. Please choose another."
                    : error?.message
                }
                onBlur={onBlur}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(v) => {
                  onChange(v);
                  validate(v);
                }}
                leftElement={
                  <Pressable onPress={() => usernameRef.current?.focus()}>
                    <Text
                      tw="text-gray-600 dark:text-gray-400"
                      style={{
                        fontSize: 16,
                        marginTop: Platform.select({
                          android: -8,
                          default: 0,
                        }),
                        marginRight: 1,
                      }}
                    >
                      showtime.xyz/
                      <Text tw="font-bold text-black dark:text-white">@</Text>
                    </Text>
                  </Pressable>
                }
              />
            )}
          />
        </View>
        <Button
          tw={[
            "mt-12 flex",
            !isFormValid || !isValidUsername || isLoading || isSubmitting
              ? "opacity-50"
              : "opacity-100",
          ]}
          size="regular"
          disabled={
            !isFormValid || !isValidUsername || isLoading || isSubmitting
          }
          onPress={handleSubmit(handleSubmitForm)}
        >
          Next
          {isLoading || isSubmitting ? (
            <View tw="absolute right-4 scale-75 justify-center">
              <Spinner size="small" color="darkgrey" />
            </View>
          ) : (
            <></>
          )}
        </Button>
      </View>
    </MotiView>
  );
};
