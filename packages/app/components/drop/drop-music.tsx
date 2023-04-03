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

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

import { Accordion, AnimateHeight } from "@showtime-xyz/universal.accordion";
import { Alert } from "@showtime-xyz/universal.alert";
import { Button } from "@showtime-xyz/universal.button";
import { Checkbox } from "@showtime-xyz/universal.checkbox";
import { ClientSideOnly } from "@showtime-xyz/universal.client-side-only";
import { DataPill } from "@showtime-xyz/universal.data-pill";
import { ErrorText, Fieldset } from "@showtime-xyz/universal.fieldset";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  FlipIcon,
  Image as ImageIcon,
  InformationCircle,
} from "@showtime-xyz/universal.icon";
import { Label } from "@showtime-xyz/universal.label";
import { useModalScreenContext } from "@showtime-xyz/universal.modal-screen";
import { ModalSheet } from "@showtime-xyz/universal.modal-sheet";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { PressableHover } from "@showtime-xyz/universal.pressable-hover";
import { useRouter } from "@showtime-xyz/universal.router";
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
import { QRCodeModal } from "app/components/qr-code";
import { MAX_FILE_SIZE, UseDropNFT, useDropNFT } from "app/hooks/use-drop-nft";
import { useModalScreenViewStyle } from "app/hooks/use-modal-screen-view-style";
import { usePersistForm } from "app/hooks/use-persist-form";
import { useRedirectToCreateDrop } from "app/hooks/use-redirect-to-create-drop";
import { useShare } from "app/hooks/use-share";
import { useUser } from "app/hooks/use-user";
import { DropFileZone } from "app/lib/drop-file-zone";
import { FilePickerResolveValue, useFilePicker } from "app/lib/file-picker";
import { useBottomTabBarHeight } from "app/lib/react-navigation/bottom-tabs";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { yup } from "app/lib/yup";
import { formatAddressShort } from "app/utilities";

import { DateTimePicker } from "design-system/date-time-picker";
import { Hidden } from "design-system/hidden";

import { CopySpotifyLinkTutorial } from "./copy-spotify-link-tutorial";
import { DropPreview } from "./drop-preview";
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
};

const durationOptions = [
  { label: "1 day", value: SECONDS_IN_A_DAY },
  { label: "1 week", value: SECONDS_IN_A_WEEK },
  { label: "1 month", value: SECONDS_IN_A_MONTH },
];
const getDefaultDate = () => {
  // Get a JavaScript date that represents the next occurrence of 12:00 AM (midnight)
  // that is at least 24 hours from the current time.
  const now = new Date();
  const targetDate = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 2,
      0,
      0,
      0
    )
  );
  return targetDate;
};

export const DropMusic = () => {
  const isDark = useIsDarkMode();
  const [isSaveDrop, setIsSaveDrop] = useState(false);
  const modalScreenContext = useModalScreenContext();

  const dropValidationSchema = useMemo(
    () =>
      yup.lazy((values) => {
        const baseSchema = yup.object({
          file: yup.mixed().required("Media is required"),
          title: yup.string().required("Title is a required field").max(255),
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
              "no-album-or-playlist",
              "Spotify Album and Playlist URLs are not allowed.",
              (value) => {
                if (!value) return true;
                return !/(album|playlist)/i.test(value);
              }
            ),
        });

        if (isSaveDrop) {
          return baseSchema.concat(
            yup.object({
              spotifyUrl: yup
                .string()
                .required("Spotify Song URL is required for saved drops."),
            })
          );
        } else {
          return baseSchema;
        }
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
    trigger,
    getValues,
  } = useForm<any>({
    resolver: yupResolver(dropValidationSchema),
    mode: "onBlur",
    shouldFocusError: true,
    reValidateMode: "onChange",
  });

  const insets = useSafeAreaInsets();
  const bottomBarHeight = useBottomTabBarHeight();
  // const [transactionId, setTransactionId] = useParam('transactionId')

  const { state, dropNFT, reset: resetDropState } = useDropNFT();
  const user = useUser({
    redirectTo: "/login",
    redirectIfProfileIncomplete: true,
  });

  const headerHeight = useHeaderHeight();
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

  // this effect should be triggered when the user changes the drop type
  // it will revalidate the form and show the errors if any
  const previousIsSaveDrop = useRef(isSaveDrop);
  useEffect(() => {
    if (isSaveDrop !== previousIsSaveDrop.current) trigger();
    previousIsSaveDrop.current = isSaveDrop;
  }, [isSaveDrop, trigger]);

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
          gatingType: isSaveDrop ? "spotify_save" : "music_presave",
          editionSize: isUnlimited ? 0 : values.editionSize,
          releaseDate: isSaveDrop
            ? undefined
            : values.releaseDate ?? getDefaultDate().toISOString(),
        },
        clearStorage
      );
    }
  };

  // useEffect(() => {
  //   if (transactionId) {
  //     pollTransaction(transactionId)
  //   }
  // }, [transactionId])

  // useEffect(() => {
  //   if (state.transactionId) {
  //     setTransactionId(transactionId)
  //   }
  // }, [state.transactionId])

  const pickFile = useFilePicker();
  const share = useShare();
  const router = useRouter();
  const modalScreenViewStyle = useModalScreenViewStyle({ mode: "margin" });
  const [showDatePicker, setShowDatePicker] = useState(false);

  // if (state.transactionHash) {
  //   return <View>
  //     <Text>Loading</Text>
  //   </View>
  // }

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
      <QRCodeModal
        dropCreated
        contractAddress={state.edition?.contract_address}
        renderPreviewComponent={({ width, height, borderRadius }) => (
          <Preview
            file={getValues("file")}
            width={width}
            height={height}
            style={{ borderRadius }}
          />
        )}
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
        "Oops, this file is too large (>50MB). Please upload a smaller file."
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
    <ClientSideOnly>
      <BottomSheetModalProvider>
        {Platform.OS === "ios" && <View style={{ height: headerHeight }} />}
        <BottomSheetScrollView
          ref={scrollViewRef}
          style={{ padding: 16 }}
          contentContainerStyle={{ paddingBottom: bottomBarHeight }}
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
                                      {errors?.file?.message}
                                    </Text>
                                  </View>
                                ) : null}

                                <View tw="mt-2 hidden md:flex">
                                  <Text tw="px-4 text-center text-gray-600 dark:text-gray-200">
                                    Tap to upload a JPG, PNG, GIF, WebM or MP4
                                    file.
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
                          tw={windowWidth <= 768 ? "flex-1" : ""}
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
                        render={({
                          field: { onChange, onBlur, value, ref },
                        }) => {
                          return (
                            <Fieldset
                              ref={ref}
                              tw="flex-1"
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
                              Spotify Release Date
                            </Text>
                            <Text tw="pt-4 text-base text-gray-900 dark:text-white">
                              {(dateValue as Date).toDateString()}
                            </Text>
                          </Pressable>
                        ) : (
                          <Text tw="font-bold text-gray-900 dark:text-white">
                            Spotify Release Date
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
                    accesibilityLabel="Live Now"
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
                          isSaveDrop
                            ? "Press the ⓘ button to learn how to get that link. Please note that providing an Album or Playlist link is not allowed."
                            : "Please note that Album or Playlist URI is not allowed. Track URI is optional: you can drop now and enter the song link once it's out on Spotify instead. To obtain your track URI, you may need to contact your distributor for assistance."
                        }
                        label={
                          <View tw="flex-row">
                            <Label tw="mr-1 font-bold text-gray-900 dark:text-white">
                              {isSaveDrop
                                ? "Spotify Song Link"
                                : "Spotify Track URI "}
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
                          "e.g. https://open.spotify.com/track/5bwNy8QQgRsfoMKDImHsx9"
                        }
                        errorText={errors.spotifyUrl?.message}
                      />
                    );
                  }}
                />
              </View>
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
                                accesibilityLabel="unlimited editions for drop"
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
                            accesibilityLabel="I agree to the terms and conditions"
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
              onEdit={() => setShowPreview(false)}
              file={getValues("file")}
              spotifyUrl={getValues("spotifyUrl")}
              releaseDate={isSaveDrop ? null : getValues("releaseDate")}
            />
          )}
        </BottomSheetScrollView>
        <AnimateHeight delay={0}>
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
    </ClientSideOnly>
  );
};
const previewBorderStyle = { borderRadius: 16 };
