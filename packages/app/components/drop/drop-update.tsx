import { useState, useMemo, useEffect } from "react";
import { Platform } from "react-native";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@showtime-xyz/universal.button";
import { Checkbox } from "@showtime-xyz/universal.checkbox";
import { Fieldset } from "@showtime-xyz/universal.fieldset";
import { ErrorText } from "@showtime-xyz/universal.fieldset";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { InformationCircle } from "@showtime-xyz/universal.icon";
import { Label } from "@showtime-xyz/universal.label";
import { ModalSheet } from "@showtime-xyz/universal.modal-sheet";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { PressableHover } from "@showtime-xyz/universal.pressable-hover";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Screen } from "app/components/screen";
import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import { useUpdatePresaveReleaseDate } from "app/hooks/use-update-presave-release-date";
import { yup } from "app/lib/yup";

import { DateTimePicker } from "design-system/date-time-picker";

import { CopySpotifyLinkTutorial } from "./copy-spotify-link-tutorial";

const dropValidationSchema = yup.object({
  spotifyUrl: yup
    .string()
    .url(
      "Please enter a valid URI. e.g. https://open.spotify.com/track/0DiWol3AO6WpXZgp0goxAV"
    )
    .required()
    .typeError("Please enter a Spotify URL"),
});
export const DropUpdate = ({
  edition,
}: {
  edition?: CreatorEditionResponse;
}) => {
  const isDark = useIsDarkMode();

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
  const [showCopySpotifyLinkTutorial, setShowCopySpotifyLinkTutorial] =
    useState(false);
  const [isLive, setIsLive] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm<any>({
    resolver: yupResolver(dropValidationSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    shouldFocusError: true,
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
        releaseDate: isLive ? new Date() : values.releaseDate,
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
            <Text tw="py-8 text-3xl font-bold text-gray-900 dark:text-white">
              Update Spotify Link
            </Text>
          ) : null}
          <Controller
            control={control}
            name="spotifyUrl"
            render={({ field: { onChange, onBlur, value, ref } }) => {
              return (
                <Fieldset
                  ref={ref}
                  label={
                    <View tw="flex-row">
                      <Label tw="mr-1 font-bold text-gray-900 dark:text-white">
                        Spotify Song Link{" "}
                      </Label>
                      <PressableHover
                        onPress={() => {
                          setShowCopySpotifyLinkTutorial(true);
                        }}
                      >
                        <InformationCircle
                          height={18}
                          width={18}
                          color={isDark ? colors.gray[400] : colors.gray[600]}
                        />
                      </PressableHover>
                    </View>
                  }
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
          <View>
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
                  <View
                    tw="mb-4 rounded-xl bg-gray-100 px-4 py-4 dark:bg-gray-900"
                    style={{
                      opacity: isLive ? 0.3 : 1,
                    }}
                  >
                    {Platform.OS !== "web" ? (
                      <Pressable
                        onPress={() => {
                          setShowDatePicker(!showDatePicker);
                        }}
                      >
                        <Text tw="font-bold text-gray-900 dark:text-white">
                          Streaming Services Release Date
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
                        Streaming Services Release Date
                      </Text>
                    )}

                    <View tw="t-0 l-0 flex-row pt-2">
                      <DateTimePicker
                        disabled={isLive}
                        onChange={(v) => {
                          onChange(v);
                          setShowDatePicker(false);
                        }}
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

            <View tw="absolute right-4 top-[50%] ml-4 translate-y-[-50%] flex-row items-center">
              <Checkbox
                checked={isLive}
                onChange={() => {
                  setIsLive(!isLive);
                }}
                aria-label="Live Now"
              />
              <Text
                tw="ml-2 font-bold text-black dark:text-white"
                onPress={() => {
                  setIsLive(!isLive);
                }}
              >
                Live Now
              </Text>
            </View>
          </View>

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
        <ModalSheet
          snapPoints={["100%"]}
          title="Spotify Song Link"
          visible={showCopySpotifyLinkTutorial}
          close={() => setShowCopySpotifyLinkTutorial(false)}
          onClose={() => setShowCopySpotifyLinkTutorial(false)}
        >
          <CopySpotifyLinkTutorial />
        </ModalSheet>
      </View>
    </Screen>
  );
};
