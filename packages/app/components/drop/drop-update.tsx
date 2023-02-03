import { useState, useMemo, useEffect } from "react";
import { Platform } from "react-native";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@showtime-xyz/universal.button";
import { Fieldset } from "@showtime-xyz/universal.fieldset";
import { ErrorText } from "@showtime-xyz/universal.fieldset";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Screen } from "app/components/screen";
import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import { useUpdatePresaveReleaseDate } from "app/hooks/use-update-presave-release-date";
import { yup } from "app/lib/yup";

import { DateTimePicker } from "design-system/date-time-picker";

const dropValidationSchema = yup.object({
  releaseDate: yup
    .date()
    .required()
    .typeError("Please enter a release date")
    .min(new Date(), "Release date must be in the future"),
  spotifyUrl: yup
    .string()
    .url()
    .required()
    .typeError("Please enter a Spotify URL"),
});
export const DropUpdate = ({
  edition,
}: {
  edition?: CreatorEditionResponse;
}) => {
  const defaultValues = useMemo(() => {
    if (edition?.presave_release_date || edition?.spotify_track_url) {
      return {
        releaseDate: edition.presave_release_date
          ? new Date(edition.presave_release_date)
          : undefined,
        spotifyUrl: edition.spotify_track_url,
      };
    }
    return {};
  }, [edition?.presave_release_date, edition?.spotify_track_url]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm<any>({
    resolver: yupResolver(dropValidationSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const mutatePresaveReleaseDate = useUpdatePresaveReleaseDate(
    edition?.creator_airdrop_edition.contract_address
  );
  const router = useRouter();

  useEffect(() => {
    resetForm(defaultValues);
  }, [resetForm, defaultValues]);

  const onSubmit = async (values: typeof defaultValues) => {
    if (
      edition?.creator_airdrop_edition.contract_address &&
      values.releaseDate &&
      values.spotifyUrl
    ) {
      await mutatePresaveReleaseDate.trigger({
        editionAddress: edition?.creator_airdrop_edition.contract_address,
        releaseDate: values.releaseDate,
        spotifyUrl: values.spotifyUrl,
      });

      router.pop();
    }
  };

  return (
    <Screen>
      <View tw="mb-4 w-full max-w-[600px] flex-1 items-center rounded-lg bg-gray-50 p-4 dark:bg-black">
        <View tw="w-full">
          {Platform.OS === "web" ? (
            <>
              <Text tw="text-lg font-bold text-gray-900 dark:text-white">
                Update drop
              </Text>
              <View tw="h-8" />
            </>
          ) : null}

          <Controller
            control={control}
            name="spotifyUrl"
            render={({ field: { onChange, onBlur, value } }) => {
              return (
                <Fieldset
                  label="Spotify URL"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter the Spotify song link"
                  errorText={errors.spotifyUrl?.message}
                />
              );
            }}
          />

          <View tw="h-4" />

          <Controller
            key="releaseDate"
            control={control}
            name="releaseDate"
            render={({ field: { onChange, value } }) => {
              let dateValue =
                typeof value === "string"
                  ? new Date(value)
                  : value ?? new Date();

              return (
                <View tw="rounded-xl bg-gray-100 py-4 px-4 dark:bg-gray-900">
                  {Platform.OS !== "web" ? (
                    <Pressable
                      onPress={() => {
                        setShowDatePicker(!showDatePicker);
                      }}
                    >
                      <Text tw="font-bold text-gray-900 dark:text-white">
                        Pick a Release Date
                      </Text>
                      <Text tw="pt-4 text-base text-gray-900 dark:text-white">
                        {(dateValue as Date).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        })}
                      </Text>
                    </Pressable>
                  ) : (
                    <Text tw="font-bold text-gray-900 dark:text-white">
                      Enter a Release Date
                    </Text>
                  )}

                  <View tw="t-0 l-0 flex-row pt-2">
                    <DateTimePicker
                      onChange={(v) => {
                        onChange(v);
                        setShowDatePicker(false);
                      }}
                      minimumDate={new Date()}
                      value={dateValue}
                      type="datetime"
                      open={showDatePicker}
                    />
                  </View>
                  {errors.releaseDate?.message ? (
                    <ErrorText>{errors.releaseDate?.message}</ErrorText>
                  ) : null}
                </View>
              );
            }}
          />

          <View tw="h-4" />

          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={mutatePresaveReleaseDate.isMutating}
            tw={
              mutatePresaveReleaseDate.isMutating
                ? "z-[-1] opacity-50"
                : "z-[-1]"
            }
          >
            {mutatePresaveReleaseDate.isMutating ? "Submitting..." : "Submit"}
          </Button>
        </View>
      </View>
    </Screen>
  );
};
