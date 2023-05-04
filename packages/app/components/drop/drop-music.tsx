import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import {
  Platform,
  ScrollView as RNScrollView,
  TextInput,
  useWindowDimensions,
} from "react-native";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

import { Accordion, AnimateHeight } from "@showtime-xyz/universal.accordion";
import { Alert } from "@showtime-xyz/universal.alert";
import { BottomSheetModalProvider } from "@showtime-xyz/universal.bottom-sheet";
import { Button } from "@showtime-xyz/universal.button";
import { Checkbox } from "@showtime-xyz/universal.checkbox";
import { DataPill } from "@showtime-xyz/universal.data-pill";
import {
  ErrorText,
  Fieldset,
  FieldsetCheckbox,
} from "@showtime-xyz/universal.fieldset";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  AppleMusic,
  FlipIcon,
  Image as ImageIcon,
  InformationCircle,
  Raffle,
  Spotify,
} from "@showtime-xyz/universal.icon";
import { Label } from "@showtime-xyz/universal.label";
import { useModalScreenContext } from "@showtime-xyz/universal.modal-screen";
import { ModalSheet } from "@showtime-xyz/universal.modal-sheet";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { PressableHover } from "@showtime-xyz/universal.pressable-hover";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { ScrollView } from "@showtime-xyz/universal.scroll-view";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { AddWalletOrSetPrimary } from "app/components/add-wallet-or-set-primary";
import { BottomSheetScrollView } from "app/components/bottom-sheet-scroll-view";
import { PolygonScanButton } from "app/components/polygon-scan-button";
import { Preview } from "app/components/preview";
import { MAX_FILE_SIZE, UseDropNFT, useDropNFT } from "app/hooks/use-drop-nft";
import { usePersistForm } from "app/hooks/use-persist-form";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useRedirectToCreateDrop } from "app/hooks/use-redirect-to-create-drop";
import { useUser } from "app/hooks/use-user";
import { DropFileZone } from "app/lib/drop-file-zone";
import { FilePickerResolveValue, useFilePicker } from "app/lib/file-picker";
import { yup } from "app/lib/yup";
import { formatAddressShort } from "app/utilities";

import { DateTimePicker } from "design-system/date-time-picker";
import { Hidden } from "design-system/hidden";

import { CopySpotifyLinkTutorial } from "./copy-spotify-link-tutorial";
import { DropPreview } from "./drop-preview";
import { DropViewShare } from "./drop-view-share";
import { MUSIC_DROP_FORM_DATA_KEY } from "./utils";

const SECONDS_IN_A_DAY = 24 * 60 * 60;
const SECONDS_IN_A_WEEK = 7 * SECONDS_IN_A_DAY;
const SECONDS_IN_A_MONTH = 30 * SECONDS_IN_A_DAY;
// user.user?.data.profile.spotify_artist_id
const defaultValues = {
  royalty: 10,
  editionSize: 100,
  duration: SECONDS_IN_A_WEEK,
  password: "",
  googleMapsUrl: "",
  radius: 1, // In kilometers
  hasAcceptedTerms: false,
  notSafeForWork: false,
  raffle: false,
};

const durationOptions = [
  { label: "1 day", value: SECONDS_IN_A_DAY },
  { label: "1 week", value: SECONDS_IN_A_WEEK },
  { label: "1 month", value: SECONDS_IN_A_MONTH },
];
const getDefaultDate = () => {
  const now = new Date();
  const day = now.getDay();
  // Local time 12:00AM the upcoming Friday is ideal.
  const minus = 5 - day;

  if (day <= 4) {
    const thisWeek = new Date(
      new Date(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1,
        0,
        0,
        0
      )
    );
    const thisWeekFriday = thisWeek.setDate(thisWeek.getDate() + minus);
    return new Date(thisWeekFriday);
  }
  // If not, fallback to 12:00AM local time the next week
  const nextweek = new Date(
    new Date(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0,
      0,
      0
    )
  );
  const nextFriday = nextweek.setDate(nextweek.getDate() + minus + 7);
  return new Date(nextFriday);
};

export const DropMusic = () => {
  const isDark = useIsDarkMode();
  const [isSaveDrop, setIsSaveDrop] = useState(false);
  const modalScreenContext = useModalScreenContext();

  const dropValidationSchema = useMemo(
    () =>
      yup.lazy(() => {
        const baseSchema = yup
          .object({
            file: yup.mixed().required("Media is required"),
            title: yup
              .string()
              .label("Title")
              .required("Title is a required field")
              .max(55),
            description: yup
              .string()
              .max(280)
              .required("Description is a required field"),
            editionSize: yup
              .number()
              .required()
              .typeError("Please enter a valid number")
              .min(1)
              .max(100000)
              .default(defaultValues.editionSize),
            royalty: yup
              .number()
              .required()
              .typeError("Please enter a valid number")
              .max(69)
              .default(defaultValues.royalty),
            hasAcceptedTerms: yup
              .boolean()
              .default(defaultValues.hasAcceptedTerms)
              .required()
              .isTrue("You must accept the terms and conditions."),
            notSafeForWork: yup.boolean().default(defaultValues.notSafeForWork),
            googleMapsUrl: yup.string().url(),
            radius: yup.number().min(0.01).max(10),
            ...(isSaveDrop
              ? {}
              : {
                  releaseDate: yup
                    .date()
                    .min(
                      getDefaultDate(),
                      "The date you entered is invalid. Please enter a date that is at least 24 hours from now and after the next occurrence of 12:00 AM (midnight)"
                    ),
                }),
            spotifyUrl: yup
              .string()
              .test(
                "no-playlist",
                "Please only enter Track URI. You can fill this later.",
                (value) => {
                  if (!value) return true;
                  return !/(playlist)/i.test(value);
                }
              ),
            appleMusicTrackUrl: yup.string(),
          })
          .test({
            name: "apple-music-or-spotify",
            message: "Please enter either an Apple Music or Spotify URL.",
            test: (value) => {
              if (!isSaveDrop) return true;
              return Boolean(value.spotifyUrl || value.appleMusicTrackUrl);
            },
          });

        return baseSchema;
      }),
    [isSaveDrop]
  );

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<any>({
    resolver: yupResolver(dropValidationSchema as any),
    mode: "onBlur",
    shouldFocusError: true,
    reValidateMode: "onChange",
  });

  const insets = useSafeAreaInsets();
  const bottomBarHeight = usePlatformBottomHeight();

  // const [transactionId, setTransactionId] = useParam('transactionId')

  const { state, dropNFT, reset: resetDropState } = useDropNFT();
  const user = useUser({
    redirectTo: "/login",
    redirectIfProfileIncomplete: true,
  });

  const redirectToCreateDrop = useRedirectToCreateDrop();
  const scrollViewRef = useRef<RNScrollView>(null);
  const windowWidth = useWindowDimensions().width;

  const [accordionValue, setAccordionValue] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const [isUnlimited, setIsUnlimited] = useState(true);
  const [showCopySpotifyLinkTutorial, setShowCopySpotifyLinkTutorial] =
    useState(false);

  const { clearStorage } = usePersistForm(MUSIC_DROP_FORM_DATA_KEY, {
    watch,
    setValue,
    defaultValues,
  });
  const descPlaceholder = isSaveDrop
    ? "What is this drop about?"
    : "Why should people collect this drop?";
  const descHelperText = isSaveDrop
    ? "You cannot edit this after the drop is created."
    : "Tell your fans what the reward is. You cannot edit this after the drop is created";

  useEffect(() => {
    resetDropState();
  }, [resetDropState]);

  // We change the title when user returns from checkout flow and they have credits
  useEffect(() => {
    return () => {
      modalScreenContext?.setTitle("Music Drop: Pre-Save on Spotify");
    };
  }, [modalScreenContext]);

  const scrollToErrorField = useCallback(() => {
    if (errors.file) {
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      return;
    }
    if (errors.hasAcceptedTerms) {
      // just some high number, it will scroll to the bottom and we dont need to measure the offset
      scrollViewRef.current?.scrollTo({ x: 0, y: 10000, animated: true });
      return;
    }
  }, [errors]);

  // this scrolls to the first error field when the form is submitted
  useEffect(() => {
    if (errors) {
      scrollToErrorField();

      if (
        (errors.editionSize?.message ||
          errors.royalty?.message ||
          errors.duration?.message) &&
        accordionValue !== "open"
      ) {
        setAccordionValue("open");
        requestAnimationFrame(() => {
          scrollToErrorField();
        });
      }
    }
  }, [errors, scrollToErrorField, accordionValue]);

  const onSubmit = async (values: UseDropNFT) => {
    if (Platform.OS !== "web") {
      TextInput.State.blurTextInput(TextInput.State.currentlyFocusedInput());
    }
    if (!showPreview) {
      setShowPreview(!showPreview);
    } else {
      await dropNFT(
        {
          ...values,
          gatingType: isSaveDrop
            ? "multi_provider_music_save"
            : "spotify_presave",
          editionSize: isUnlimited ? 0 : values.editionSize,
          releaseDate: isSaveDrop
            ? undefined
            : values.releaseDate ?? getDefaultDate().toISOString(),
          appleMusicTrackUrl: isSaveDrop
            ? values.appleMusicTrackUrl
            : undefined,
        },
        clearStorage
      );
    }
  };
  const pickFile = useFilePicker();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const selectedDuration = watch("duration");

  const selectedDurationLabel = React.useMemo(
    () => durationOptions.find((d) => d.value === selectedDuration)?.label,
    [selectedDuration]
  );

  if (user.isIncompletedProfile) {
    return null;
  }

  if (state.status === "success") {
    return (
      <DropViewShare
        title={getValues("title")}
        description={getValues("description")}
        file={getValues("file")}
        contractAddress={state.edition?.contract_address}
      />
    );
  }

  const primaryWallet = user.user?.data.profile.primary_wallet;

  if (!primaryWallet) {
    return (
      <AddWalletOrSetPrimary
        onPrimaryWalletSetCallback={redirectToCreateDrop}
        title="Choose a primary wallet to create your drop"
        description="Please choose which wallet will receive your drop. You only have to do this once!"
      />
    );
  }

  const handleFileChange = (fileObj: FilePickerResolveValue) => {
    const { file, size } = fileObj;
    let extension;
    // On Native file is a string uri
    if (typeof file === "string") {
      extension = file.split(".").pop();
    }
    if (size && size > MAX_FILE_SIZE) {
      Alert.alert(
        "Oops, this file is too large (>30MB). Please upload a smaller file."
      );
      setError("file", {
        type: "custom",
        message: "Please retry!",
      });
      setValue("file", undefined);

      return;
    }
    if (
      extension === "mov" ||
      (typeof file === "object" && file.type === "video/quicktime")
    ) {
      setError("file", { type: "custom", message: "File type not supported" });
      setValue("file", undefined);
    } else {
      clearErrors("file");
      setValue("file", file);
    }
  };

  return (
    <BottomSheetModalProvider>
      <BottomSheetScrollView
        ref={scrollViewRef}
        style={{ paddingHorizontal: 16 }}
        contentContainerStyle={{
          paddingBottom: Math.max(bottomBarHeight, 16),
        }}
      >
        {!showPreview ? (
          <View>
            <View tw="flex-row">
              <Controller
                control={control}
                name="file"
                render={({ field: { value } }) => {
                  return (
                    <DropFileZone onChange={handleFileChange}>
                      <View tw="z-1">
                        <Pressable
                          onPress={async () => {
                            const file = await pickFile({
                              mediaTypes: "all",
                            });

                            handleFileChange(file);
                          }}
                          tw="h-[120px] w-[120px] items-center justify-center overflow-hidden rounded-lg md:h-64 md:w-64"
                        >
                          {value ? (
                            <View>
                              <Preview
                                file={value}
                                width={windowWidth >= 768 ? 256 : 120}
                                height={windowWidth >= 768 ? 256 : 120}
                                style={previewBorderStyle}
                              />
                              <View
                                tw="absolute h-full w-full items-center justify-center rounded-lg"
                                style={{
                                  backgroundColor: "rgba(0,0,0,.35)",
                                }}
                              >
                                <View tw="flex-row items-center shadow-lg">
                                  <FlipIcon
                                    width={20}
                                    height={20}
                                    color="white"
                                  />
                                  <Text tw="ml-2 text-sm text-white">
                                    Replace
                                  </Text>
                                </View>
                              </View>
                            </View>
                          ) : (
                            <View tw="w-full flex-1 items-center justify-center rounded-2xl border-2 border-dashed border-gray-800 dark:border-gray-200">
                              <ImageIcon
                                color={
                                  errors.file?.message
                                    ? "red"
                                    : isDark
                                    ? "#FFF"
                                    : "#000"
                                }
                                width={40}
                                height={40}
                              />
                              <View tw="mt-2">
                                <Text tw="font-bold text-gray-600 dark:text-gray-200">
                                  Upload
                                </Text>
                              </View>
                              {errors.file?.message ? (
                                <View tw="mt-2">
                                  <Text tw="text-center text-sm text-red-500">
                                    {errors?.file?.message as string}
                                  </Text>
                                </View>
                              ) : null}

                              <View tw="mt-2 hidden md:flex">
                                <Text tw="px-4 text-center text-gray-600 dark:text-gray-200">
                                  {`Tap to upload a JPG, PNG, GIF, WebM or MP4 file.\nMax file size: 30MB`}
                                </Text>
                              </View>
                            </View>
                          )}
                        </Pressable>
                      </View>
                    </DropFileZone>
                  );
                }}
              />

              <View tw="ml-4 flex-1">
                <Controller
                  control={control}
                  name="title"
                  render={({ field: { onChange, onBlur, value, ref } }) => {
                    return (
                      <Fieldset
                        ref={ref}
                        label="Title"
                        placeholder="Sweet"
                        onBlur={onBlur}
                        errorText={errors.title?.message}
                        value={value}
                        onChangeText={onChange}
                        numberOfLines={2}
                        multiline
                      />
                    );
                  }}
                />
                <Hidden until="md">
                  <View tw="mt-4 flex-1 flex-row">
                    <Controller
                      control={control}
                      name="description"
                      render={({ field: { onChange, onBlur, value, ref } }) => {
                        return (
                          <Fieldset
                            ref={ref}
                            tw="flex-1"
                            label="Description"
                            multiline
                            textAlignVertical="top"
                            placeholder={descPlaceholder}
                            onBlur={onBlur}
                            helperText={descHelperText}
                            errorText={errors.description?.message}
                            value={value}
                            numberOfLines={3}
                            onChangeText={onChange}
                          />
                        );
                      }}
                    />
                  </View>
                </Hidden>
              </View>
            </View>

            <Text tw="mt-4 text-gray-600 dark:text-gray-200 md:hidden">
              JPG, PNG, GIF, WebM or MP4 file
            </Text>
            <Hidden from="md">
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value, ref } }) => {
                  return (
                    <Fieldset
                      ref={ref}
                      tw="mt-4"
                      label="Description"
                      multiline
                      textAlignVertical="top"
                      placeholder="What is this drop about?"
                      onBlur={onBlur}
                      helperText="You cannot edit this after the drop is created."
                      errorText={errors.description?.message}
                      value={value}
                      numberOfLines={3}
                      onChangeText={onChange}
                    />
                  );
                }}
              />
            </Hidden>
            <View tw="mt-4">
              <Controller
                key="raffle"
                control={control}
                name="raffle"
                render={({ field: { onChange, value } }) => {
                  return (
                    <FieldsetCheckbox
                      onChange={onChange}
                      value={value}
                      Icon={
                        <Raffle
                          color={isDark ? colors.white : colors.gray[900]}
                        />
                      }
                      helperText={
                        isSaveDrop
                          ? "Automatically selects a winner once the duration of your drop is over."
                          : "Automatically selects a winner once your song is live."
                      }
                      title="Make it a Raffle"
                    />
                  );
                }}
              />
            </View>
            <View tw="z-10 mt-4 flex-row">
              <Controller
                key="releaseDate"
                control={control}
                defaultValue={getDefaultDate()}
                name="releaseDate"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => {
                  const dateValue =
                    typeof value === "string"
                      ? new Date(value)
                      : value ?? getDefaultDate();

                  return (
                    <View
                      tw={`flex-1 rounded-xl bg-gray-100 px-4 py-4 dark:bg-gray-800 ${
                        isSaveDrop ? "opacity-40" : ""
                      }`}
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
                            {(dateValue as Date).toDateString()}
                          </Text>
                        </Pressable>
                      ) : (
                        <Text tw="font-bold text-gray-900 dark:text-white">
                          Streaming Services Release Date
                        </Text>
                      )}

                      <View tw="t-0 l-0 w-full flex-row pt-2">
                        <DateTimePicker
                          disabled={isSaveDrop}
                          onChange={(v) => {
                            onChange(v);
                            setShowDatePicker(false);
                          }}
                          minimumDate={getDefaultDate()}
                          value={dateValue}
                          type="datetime"
                          open={showDatePicker}
                        />
                      </View>
                      {error && !isSaveDrop ? (
                        <Text tw="pt-3 font-bold leading-5 text-red-500">
                          {error.message}
                        </Text>
                      ) : null}
                    </View>
                  );
                }}
              />
              <View tw="absolute right-4 top-[50%] ml-4 translate-y-[-50%] flex-row items-center">
                <Checkbox
                  checked={isSaveDrop}
                  onChange={() => {
                    setIsSaveDrop(!isSaveDrop);
                  }}
                  aria-label="Live Now"
                />
                <Text
                  tw="ml-2 font-bold text-black dark:text-white"
                  onPress={() => {
                    setIsSaveDrop(!isSaveDrop);
                  }}
                >
                  Live Now
                </Text>
              </View>
            </View>

            <View tw="mt-4">
              <Controller
                control={control}
                name="spotifyUrl"
                render={({ field: { onChange, onBlur, value, ref } }) => {
                  return (
                    <Fieldset
                      ref={ref}
                      helperText={
                        isSaveDrop ? (
                          "Press the ⓘ button to learn how to get that link. Please note that providing a Playlist link is not allowed."
                        ) : (
                          <Text tw="text-sm leading-6 text-gray-700 dark:text-gray-300">
                            <Text tw="text-sm font-bold leading-6 text-gray-700 dark:text-gray-300">
                              {`Go to Spotify for Artists → Music → Upcoming. `}
                            </Text>
                            Click "Copy URI" and paste it here. Track URI also
                            allowed.
                          </Text>
                        )
                      }
                      label={
                        <View tw="flex-row gap-1">
                          <Spotify
                            height={22}
                            width={22}
                            color={isDark ? "white" : "black"}
                          />
                          <Label tw="font-bold text-gray-900 dark:text-white">
                            {isSaveDrop ? "Spotify Song Link" : "Spotify URI "}
                            {isSaveDrop ? (
                              <Text tw="text-red-600">*</Text>
                            ) : (
                              <Text tw="text-xs font-normal">
                                {"\n"}(Optional, you can drop without and fill
                                it later)
                              </Text>
                            )}
                          </Label>
                          {isSaveDrop ? (
                            <PressableHover
                              onPress={() => {
                                setShowCopySpotifyLinkTutorial(true);
                              }}
                            >
                              <InformationCircle
                                height={18}
                                width={18}
                                color={
                                  isDark ? colors.gray[400] : colors.gray[600]
                                }
                              />
                            </PressableHover>
                          ) : null}
                        </View>
                      }
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder={
                        isSaveDrop
                          ? "https://open.spotify.com/track/5bwNy8QQgRsfoMKDImHsx9"
                          : "spotify:album:27ftYHLeunzcSzb33Wk1hf"
                      }
                      errorText={
                        errors.spotifyUrl?.message || errors[""]?.message
                      }
                    />
                  );
                }}
              />
            </View>
            {isSaveDrop && user.user?.data.profile.apple_music_artist_id ? (
              <View tw="mt-4">
                <Controller
                  control={control}
                  name="appleMusicTrackUrl"
                  render={({ field: { onChange, onBlur, value, ref } }) => {
                    return (
                      <Fieldset
                        ref={ref}
                        label={
                          <View tw="flex-row items-center gap-1">
                            <AppleMusic
                              height={20}
                              width={20}
                              color={isDark ? "white" : "black"}
                            />
                            <Label tw="mr-1 font-bold text-gray-900 dark:text-white">
                              Apple Music Song Link
                              <Text tw="text-red-600">*</Text>
                            </Label>
                          </View>
                        }
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder={
                          "https://music.apple.com/album/i-feel-it-coming-feat-daft-punk/1440870373?i=1440870397"
                        }
                        errorText={
                          errors.appleMusicTrackUrl?.message ||
                          errors[""]?.message
                        }
                      />
                    );
                  }}
                />
              </View>
            ) : null}

            <View>
              <Accordion.Root
                value={accordionValue}
                onValueChange={setAccordionValue}
              >
                <Accordion.Item tw="-mx-4" value="open">
                  <Accordion.Trigger>
                    <View tw="flex-1">
                      <View tw="mb-4 flex-1 flex-row justify-between">
                        <Accordion.Label
                          tw={
                            errors.editionSize?.message ||
                            errors.royalty?.message ||
                            errors.duration?.message
                              ? "text-red-500"
                              : ""
                          }
                        >
                          Drop Details
                        </Accordion.Label>
                        <Accordion.Chevron />
                      </View>
                      <ScrollView tw="flex-row" horizontal={true}>
                        <DataPill
                          label={
                            isUnlimited
                              ? `Open Edition`
                              : `${watch("editionSize")} ${
                                  watch("editionSize") == 1
                                    ? "Edition"
                                    : "Editions"
                                }`
                          }
                          type="text"
                        />
                        <DataPill
                          label={`${watch("royalty")}% Royalties`}
                          type="text"
                          tw="mx-1 md:mx-4"
                        />
                        <DataPill
                          label={`Duration: ${selectedDurationLabel}`}
                          type="text"
                        />
                      </ScrollView>
                    </View>
                  </Accordion.Trigger>
                  <Accordion.Content tw="pt-0">
                    <>
                      <View tw="justify-between lg:flex-row">
                        <View tw="flex-1 flex-row">
                          <Controller
                            control={control}
                            name="editionSize"
                            render={({
                              field: { onChange, onBlur, value, ref },
                            }) => {
                              return (
                                <Fieldset
                                  ref={ref}
                                  tw={
                                    isUnlimited
                                      ? "flex-1 opacity-40"
                                      : "flex-1 opacity-100"
                                  }
                                  label="Edition size"
                                  placeholder="Enter number"
                                  onBlur={onBlur}
                                  helperText="How many editions will be available to collect"
                                  errorText={errors.editionSize?.message}
                                  value={value?.toString()}
                                  disabled={isUnlimited}
                                  onChangeText={onChange}
                                />
                              );
                            }}
                          />
                          <Pressable
                            onPress={() =>
                              setIsUnlimited((isUnlimited) => !isUnlimited)
                            }
                            tw="absolute right-4 top-10 flex-row items-center"
                            style={{ opacity: 1 }}
                          >
                            <Text tw="mr-2 text-base font-medium text-gray-600 dark:text-gray-400">
                              Unlimited
                            </Text>
                            <Checkbox
                              onChange={() =>
                                setIsUnlimited((isUnlimited) => !isUnlimited)
                              }
                              checked={isUnlimited}
                              aria-label="unlimited editions for drop"
                            />
                          </Pressable>
                        </View>
                        <View tw="mt-4 flex-1 flex-row md:mt-0 lg:ml-4">
                          <Controller
                            control={control}
                            name="royalty"
                            render={({
                              field: { onChange, onBlur, value, ref },
                            }) => {
                              return (
                                <Fieldset
                                  ref={ref}
                                  tw="flex-1"
                                  label="Your royalties (%)"
                                  onBlur={onBlur}
                                  placeholder="Enter number"
                                  helperText="How much you'll earn each time an edition of this drop is sold"
                                  errorText={errors.royalty?.message}
                                  value={value?.toString()}
                                  onChangeText={onChange}
                                />
                              );
                            }}
                          />
                        </View>
                      </View>
                      <View tw="z-10 mt-4 flex-row">
                        <Controller
                          control={control}
                          name="duration"
                          render={({
                            field: { onChange, onBlur, value, ref },
                          }) => {
                            return (
                              <Fieldset
                                ref={ref}
                                tw="flex-1"
                                label="Duration"
                                onBlur={onBlur}
                                helperText="How long the drop will be available to claim"
                                errorText={errors.duration?.message}
                                selectOnly
                                select={{
                                  options: durationOptions,
                                  placeholder: "Duration",
                                  value: value,
                                  onChange,
                                  tw: "flex-1",
                                }}
                              />
                            );
                          }}
                        />
                      </View>

                      <View tw="mt-4 flex-row justify-between">
                        <Controller
                          control={control}
                          name="notSafeForWork"
                          render={({ field: { onChange, value, ref } }) => (
                            <Fieldset
                              ref={ref}
                              tw="flex-1"
                              label="Explicit content (18+)"
                              switchOnly
                              switchProps={{
                                checked: value,
                                onChange,
                              }}
                            />
                          )}
                        />
                      </View>
                    </>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion.Root>
            </View>

            <View tw="mb-4 flex-row">
              <Text tw="pb-2 text-sm text-gray-600 dark:text-gray-200">
                This drop will be owned by you{" "}
                {primaryWallet.nickname ? (
                  <Text tw="font-bold">{primaryWallet.nickname + " "}</Text>
                ) : null}
                {"(" + formatAddressShort(primaryWallet.address) + ")"}
              </Text>
            </View>

            <View tw="mt-4 flex-1">
              <View tw="flex-1 flex-row">
                <Controller
                  control={control}
                  name="hasAcceptedTerms"
                  render={({ field: { onChange, value } }) => (
                    <>
                      <Pressable
                        onPress={() => onChange(!value)}
                        tw="flex-1 flex-row items-center rounded-xl bg-gray-100 p-4 dark:bg-gray-900"
                      >
                        <Checkbox
                          onChange={(v) => onChange(v)}
                          checked={value}
                          aria-label="I agree to the terms and conditions"
                        />

                        <Text tw="px-4 text-gray-600 dark:text-gray-400">
                          I have the rights to publish this content, and
                          understand it will be minted on the Polygon network.
                        </Text>
                      </Pressable>
                    </>
                  )}
                />
              </View>
              {errors.hasAcceptedTerms?.message ? (
                <ErrorText>{errors.hasAcceptedTerms?.message}</ErrorText>
              ) : null}
            </View>
          </View>
        ) : (
          <DropPreview
            title={getValues("title")}
            description={getValues("description")}
            onPressCTA={() => setShowPreview(false)}
            ctaCopy="Edit Drop"
            file={getValues("file")}
            spotifyUrl={getValues("spotifyUrl")}
            appleMusicTrackUrl={getValues("appleMusicTrackUrl")}
            releaseDate={isSaveDrop ? null : getValues("releaseDate")}
          />
        )}
      </BottomSheetScrollView>
      <AnimateHeight>
        <View tw="px-4">
          <Button
            variant="primary"
            size="regular"
            tw={state.status === "loading" ? "opacity-[0.45]" : ""}
            disabled={state.status === "loading"}
            onPress={handleSubmit(onSubmit)}
          >
            {state.status === "loading" ? (
              <View tw="items-center justify-center">
                <Spinner size="small" />
              </View>
            ) : state.status === "error" ? (
              "Failed. Please retry!"
            ) : showPreview ? (
              "Drop now"
            ) : (
              "Continue"
            )}
          </Button>

          {state.transactionHash && !showPreview ? (
            <View tw="mt-4">
              <PolygonScanButton transactionHash={state.transactionHash} />
            </View>
          ) : null}

          {state.error ? (
            <View tw="animate-fade-in-250 mb-1 mt-4 items-center justify-center">
              <Text tw="text-red-500">{state.error}</Text>
            </View>
          ) : null}
        </View>
      </AnimateHeight>

      <View style={{ height: insets.bottom }} />
      <ModalSheet
        snapPoints={["100%"]}
        title="Spotify Song Link"
        visible={showCopySpotifyLinkTutorial}
        close={() => setShowCopySpotifyLinkTutorial(false)}
        onClose={() => setShowCopySpotifyLinkTutorial(false)}
      >
        <CopySpotifyLinkTutorial />
      </ModalSheet>
    </BottomSheetModalProvider>
  );
};
const previewBorderStyle = { borderRadius: 16 };
