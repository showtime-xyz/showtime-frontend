import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  useWindowDimensions,
  Platform,
  Linking,
  ScrollView as RNScrollView,
} from "react-native";

import * as Clipboard from "expo-clipboard";
import { Controller } from "react-hook-form";
import Animated, {
  FadeIn,
  FadeOut,
  enableLayoutAnimations,
} from "react-native-reanimated";

import { useAlert } from "@showtime-xyz/universal.alert";
import { Button } from "@showtime-xyz/universal.button";
import { Checkbox } from "@showtime-xyz/universal.checkbox";
import { DataPill } from "@showtime-xyz/universal.data-pill";
import { ErrorText, Fieldset } from "@showtime-xyz/universal.fieldset";
import {
  useIsDarkMode,
  useIsomorphicLayoutEffect,
} from "@showtime-xyz/universal.hooks";
import {
  AppleMusic,
  ArrowLeft,
  ChevronRight,
  InformationCircle,
  Close,
  Raffle,
  Spotify,
  Twitter,
  Link,
} from "@showtime-xyz/universal.icon";
import { Label } from "@showtime-xyz/universal.label";
import { useModalScreenContext } from "@showtime-xyz/universal.modal-screen";
import { ModalSheet } from "@showtime-xyz/universal.modal-sheet";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { PressableHover } from "@showtime-xyz/universal.pressable-hover";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { ScrollView } from "@showtime-xyz/universal.scroll-view";
import Spinner from "@showtime-xyz/universal.spinner";
import { Switch } from "@showtime-xyz/universal.switch";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { BottomSheetScrollView } from "app/components/bottom-sheet-scroll-view";
import { Creator } from "app/components/card/rows/elements/creator";
import { Media } from "app/components/media";
import { Preview } from "app/components/preview";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { MAX_FILE_SIZE, UseDropNFT, useDropNFT } from "app/hooks/use-drop-nft";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { usePersistForm } from "app/hooks/use-persist-form";
import { getNFTSlug, getNFTURL } from "app/hooks/use-share-nft";
import { useUser } from "app/hooks/use-user";
import { FilePickerResolveValue } from "app/lib/file-picker";
import { getTwitterIntent } from "app/utilities";

import { DateTimePicker } from "design-system/date-time-picker";
import { toast } from "design-system/toast";

import { CopySpotifyLinkTutorial } from "../copy-spotify-link-tutorial";
import { MUSIC_DROP_FORM_DATA_KEY } from "../utils";
import { MediaPicker } from "./media-picker";
import { getDefaultDate, useMusicDropForm } from "./music-drop-form-utils";
import { SelectDropType } from "./select-drop-type";
import { StepProps } from "./types";

type CreateDropStep =
  | "media"
  | "title"
  | "song-uri"
  | "more-options"
  | "select-drop";

export const CreateDropSteps = () => {
  const [step, setStep] = useState<CreateDropStep>("select-drop");
  const modalContext = useModalScreenContext();
  const {
    control,
    setValue,
    formState,
    setError,
    getValues,
    watch,
    clearErrors,
    trigger,
    handleSubmit,
    defaultValues,
    setIsSaveDrop,
    isSaveDrop,
    isUnlimited,
    setIsUnlimited,
  } = useMusicDropForm();

  const Alert = useAlert();
  const title = getValues("title");
  const description = getValues("description");
  const file = getValues("file");
  const { state, dropNFT, reset: resetDropState } = useDropNFT();
  const router = useRouter();

  const { clearStorage } = usePersistForm(MUSIC_DROP_FORM_DATA_KEY, {
    watch,
    setValue,
    defaultValues,
  });

  useEffect(() => {
    resetDropState();
  }, [resetDropState]);

  useIsomorphicLayoutEffect(() => {
    // TODO: remove this when we have new cell renderer in flashlist
    enableLayoutAnimations(true);
    return () => {
      enableLayoutAnimations(false);
    };
  }, []);

  const onSubmit = async (values: UseDropNFT) => {
    console.log("submitting");
    await dropNFT(
      {
        ...values,
        gatingType: isSaveDrop
          ? "multi_provider_music_save"
          : "multi_provider_music_presave",
        editionSize: isUnlimited ? 0 : values.editionSize,
        releaseDate: isSaveDrop
          ? undefined
          : values.releaseDate ?? getDefaultDate().toISOString(),
        appleMusicTrackUrl: values.appleMusicTrackUrl,
      },
      clearStorage
    );
  };

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

  if (state.status === "success") {
    return (
      <Animated.View
        style={{ flex: 1 }}
        entering={FadeIn}
        exiting={FadeOut}
        key={step}
      >
        <Layout
          closeIcon
          onBackPress={() => modalContext?.pop()}
          title="Success"
        >
          <DropSuccess contractAddress={state.edition?.contract_address} />
        </Layout>
      </Animated.View>
    );
  }

  switch (step) {
    case "select-drop":
      return (
        <SelectDropTypeStep
          errors={formState.errors}
          trigger={trigger}
          control={control}
          handleNextStep={() => {
            modalContext?.snapToIndex(1);
            setStep("media");
          }}
          handlePrevStep={() => {
            modalContext?.snapToIndex(0);
            modalContext?.pop();
          }}
          title={title}
          description={description}
          file={file}
        />
      );
    case "media":
      return (
        <Animated.View
          key={step}
          style={{ flex: 1 }}
          entering={FadeIn}
          exiting={FadeOut}
        >
          <CreateDropStepMedia
            trigger={trigger}
            control={control}
            errors={formState.errors}
            handleNextStep={() => setStep("title")}
            handleFileChange={handleFileChange}
            handlePrevStep={() => {
              modalContext?.snapToIndex(0);
              setStep("select-drop");
            }}
            description={description}
            file={file}
            title={title}
          />
        </Animated.View>
      );
    case "title":
      return (
        <Animated.View
          key={step}
          style={{ flex: 1 }}
          entering={FadeIn}
          exiting={FadeOut}
        >
          <CreateDropStepTitle
            control={control}
            errors={formState.errors}
            trigger={trigger}
            handleNextStep={() => setStep("song-uri")}
            handlePrevStep={() => setStep("media")}
            file={file}
            title={title}
            description={description}
          />
        </Animated.View>
      );
    case "song-uri":
      return (
        <Animated.View
          key={step}
          style={{ flex: 1 }}
          entering={FadeIn}
          exiting={FadeOut}
        >
          <CreateDropStepSongURI
            control={control}
            isSaveDrop={isSaveDrop}
            setIsSaveDrop={setIsSaveDrop}
            errors={formState.errors}
            trigger={trigger}
            handleNextStep={handleSubmit(onSubmit)}
            handlePrevStep={() => setStep("title")}
            file={file}
            description={description}
            title={title}
            handleMoreOptions={() => setStep("more-options")}
          />
        </Animated.View>
      );
    case "more-options":
      return (
        <Animated.View style={{ flex: 1 }} entering={FadeIn} exiting={FadeOut}>
          <CreateDropMoreOptions
            control={control}
            isUnlimited={isUnlimited}
            setIsUnlimited={setIsUnlimited}
            errors={formState.errors}
            trigger={trigger}
            handleNextStep={() => setStep("song-uri")}
            file={file}
            handlePrevStep={() => setStep("song-uri")}
            title={title}
            description={description}
          />
        </Animated.View>
      );
    default:
      return null;
  }
};

const SelectDropTypeStep = (props: StepProps) => {
  return (
    <Layout onBackPress={props.handlePrevStep} title="Create" closeIcon>
      <SelectDropType handleNextStep={props.handleNextStep} />
    </Layout>
  );
};

const CreateDropStepMedia = (
  props: StepProps & {
    handleFileChange: (file: FilePickerResolveValue) => void;
  }
) => {
  const {
    control,
    errors,
    handleFileChange,
    handlePrevStep,
    trigger,
    handleNextStep,
  } = props;
  return (
    <Layout onBackPress={handlePrevStep} title="Create">
      <View tw="px-4">
        <Text tw="text-center text-xl text-gray-900 dark:text-gray-50">
          Upload an image or video for your paid unlockable.
        </Text>
        <View tw="mt-8 items-center">
          <Controller
            control={control}
            name="file"
            render={({ field: { value } }) => {
              return (
                <MediaPicker
                  onChange={handleFileChange}
                  value={value}
                  errorMessage={errors?.file?.message}
                />
              );
            }}
          />
          <Text tw="py-4 text-sm text-gray-700 dark:text-gray-300">
            This could be an alternative album cover, unreleased content, or a
            short video snippet promoting your upcoming release.
          </Text>
        </View>
      </View>
      <View tw="mt-4 px-4">
        <Button
          size="regular"
          tw="w-full self-center"
          onPress={async () => {
            const res = await trigger("file");
            if (res) {
              handleNextStep();
            }
          }}
        >
          Next
        </Button>
      </View>
    </Layout>
  );
};

const CreateDropStepTitle = (props: StepProps) => {
  const { width: windowWidth } = useWindowDimensions();
  const { control, errors, handlePrevStep, handleNextStep, trigger } = props;
  const mediaDimension = Math.min(200, windowWidth - 32);

  return (
    <Layout onBackPress={handlePrevStep} title="Create">
      <ScrollView tw="px-4">
        <View tw="items-center">
          <Preview
            file={props.file}
            width={mediaDimension}
            height={mediaDimension}
            style={{ borderRadius: 16 }}
          />
        </View>
        <View tw="mt-4">
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value, ref } }) => {
              return (
                <Fieldset
                  ref={ref}
                  label="Song Title"
                  placeholder="Give your drop a title"
                  onBlur={onBlur}
                  errorText={errors.title?.message}
                  value={value}
                  onChangeText={onChange}
                  numberOfLines={1}
                  multiline
                />
              );
            }}
          />
        </View>
        <View tw="mt-4 flex-1">
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value, ref } }) => {
              return (
                <Fieldset
                  ref={ref}
                  label="Description"
                  tw="flex-1"
                  placeholder="Why should people collect this drop? Raffle Automatically selects a winner once your song is live."
                  multiline
                  textAlignVertical="top"
                  numberOfLines={3}
                  onBlur={onBlur}
                  errorText={errors.description?.message}
                  value={value}
                  onChangeText={onChange}
                />
              );
            }}
          />
          <View tw="absolute right-3 top-3 flex-row items-center">
            <Controller
              key="raffle"
              control={control}
              name="raffle"
              render={({ field: { onChange, value } }) => {
                return (
                  <>
                    <Raffle color="black" width={18} height={18} />
                    <Text tw="mx-1 text-xs font-bold text-gray-800 dark:text-gray-200">
                      Raffle
                    </Text>
                    <Switch checked={value} onChange={onChange} size="small" />
                  </>
                );
              }}
            />
          </View>
        </View>
        <View>
          <Text tw="mt-4 text-gray-900 dark:text-gray-100">
            Promote a collectible, raffle or allow-list to attract more
            collectors. You can edit up to 30 minutes after creating.
          </Text>
        </View>
      </ScrollView>
      <View tw="p-4">
        <Button
          size="regular"
          tw="mt-4 w-full self-center"
          onPress={async () => {
            const res = await trigger(["title", "description"], {
              shouldFocus: true,
            });
            if (res) {
              handleNextStep();
            }
          }}
        >
          Next
        </Button>
      </View>
    </Layout>
  );
};

const CreateDropStepSongURI = (
  props: StepProps & {
    handleMoreOptions: () => void;
    setIsSaveDrop: (isSaveDrop: boolean) => void;
    isSaveDrop: boolean;
  }
) => {
  const {
    errors,
    control,
    handleNextStep,
    trigger,
    setIsSaveDrop,
    isSaveDrop,
  } = props;
  const { state } = useDropNFT();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const user = useUser();
  const [showCopySpotifyLinkTutorial, setShowCopySpotifyLinkTutorial] =
    useState(false);
  const isDark = useIsDarkMode();
  const scrollViewRef = useRef<RNScrollView>(null);

  return (
    <Layout onBackPress={props.handlePrevStep} title="Create">
      <BottomSheetScrollView
        ref={scrollViewRef}
        style={{ paddingHorizontal: 16 }}
      >
        <View tw="flex-row items-center">
          <Preview
            width={40}
            height={40}
            resizeMode="cover"
            style={{ borderRadius: 4 }}
            file={props.file}
          />
          <Text tw="ml-2 text-base font-semibold text-gray-600 dark:text-gray-200">
            {props.title}
          </Text>
        </View>
        <View tw="mt-6">
          <Text tw="text-sm font-semibold text-gray-900 dark:text-gray-50">
            Music Details
          </Text>
          <Text tw="pt-1 text-gray-600 dark:text-gray-400">
            Promote an unreleased or live song to Spotify and Apple Music by
            pasting URLs below
          </Text>
          <View tw="z-10 mt-4 flex-row">
            <Controller
              key="releaseDate"
              control={control}
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
                      <View tw="flex-row items-center gap-1">
                        <Spotify
                          height={22}
                          width={22}
                          color={isDark ? "white" : "black"}
                        />
                        <Label tw="font-bold text-gray-900 dark:text-white">
                          {isSaveDrop ? "Spotify Song Link" : "Spotify URI "}
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
          {user.user?.data.profile.apple_music_artist_id ? (
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

          <View tw="mt-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
            <Pressable
              tw="flex-row items-center justify-between"
              onPress={props.handleMoreOptions}
            >
              <Text tw="text-sm font-semibold text-black dark:text-white">
                More options
              </Text>
              <ChevronRight
                color={isDark ? "white" : "black"}
                width={24}
                height={24}
              />
            </Pressable>
            <View tw="items-start">
              <View tw="mt-2 flex-row flex-wrap" style={{ gap: 4 }}>
                <DataPill tw="bg-white" label="Open Edition" type="text" />
                <DataPill tw="bg-white" label="10% Royalties" type="text" />
                <DataPill tw="bg-white" label="Duration: 1 month" type="text" />
              </View>
            </View>
          </View>
        </View>
        <Text tw="pt-4 text-sm text-gray-600 dark:text-gray-200">
          This drop will be owned by you
        </Text>
        <View tw="mt-4 flex-1 flex-row">
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
                    I have the rights to publish this content, and understand it
                    will be minted on the Polygon network.
                  </Text>
                </Pressable>
              </>
            )}
          />
        </View>
        {errors.hasAcceptedTerms?.message ? (
          <ErrorText>{errors.hasAcceptedTerms?.message}</ErrorText>
        ) : null}
      </BottomSheetScrollView>

      <View tw="mx-4 mt-4">
        <Button
          variant="primary"
          size="regular"
          disabled={state.status === "loading"}
          tw={state.status === "loading" ? "opacity-[0.45]" : ""}
          onPress={async () => {
            const res = await trigger(
              ["releaseDate", "spotifyUrl", "appleMusicTrackUrl"],
              {
                shouldFocus: true,
              }
            );
            if (res) {
              const hasAcceptedTerms = await trigger("hasAcceptedTerms");
              if (hasAcceptedTerms) {
                handleNextStep();
              } else {
                scrollViewRef.current?.scrollTo({ y: 10000, animated: true });
              }
            }
          }}
        >
          {state.status === "loading" ? (
            <View tw="items-center justify-center">
              <Spinner size="small" />
            </View>
          ) : state.status === "error" ? (
            "Failed. Please retry!"
          ) : (
            "Drop now"
          )}
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
    </Layout>
  );
};

const SECONDS_IN_A_DAY = 24 * 60 * 60;
const SECONDS_IN_A_WEEK = 7 * SECONDS_IN_A_DAY;
const SECONDS_IN_A_MONTH = 30 * SECONDS_IN_A_DAY;
const durationOptions = [
  { label: "1 day", value: SECONDS_IN_A_DAY },
  { label: "1 week", value: SECONDS_IN_A_WEEK },
  { label: "1 month", value: SECONDS_IN_A_MONTH },
];
const CreateDropMoreOptions = (
  props: StepProps & {
    isUnlimited: boolean;
    setIsUnlimited: (isUnlimited: boolean) => void;
  }
) => {
  const { control, errors, handlePrevStep, isUnlimited, setIsUnlimited } =
    props;

  return (
    <Layout onBackPress={handlePrevStep} title="More options">
      <BottomSheetScrollView style={{ paddingHorizontal: 16 }}>
        <View tw="flex-1 flex-row">
          <Controller
            control={control}
            name="editionSize"
            render={({ field: { onChange, onBlur, value, ref } }) => {
              return (
                <Fieldset
                  ref={ref}
                  tw={isUnlimited ? "flex-1 opacity-40" : "flex-1 opacity-100"}
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
            onPress={() => setIsUnlimited(!isUnlimited)}
            tw="absolute right-4 top-10 flex-row items-center"
            style={{ opacity: 1 }}
          >
            <Text tw="mr-2 text-base font-medium text-gray-600 dark:text-gray-400">
              Unlimited
            </Text>
            <Checkbox
              onChange={() => setIsUnlimited(!isUnlimited)}
              checked={isUnlimited}
              aria-label="unlimited editions for drop"
            />
          </Pressable>
        </View>
        <View tw="mt-4">
          <Controller
            control={control}
            name="royalty"
            render={({ field: { onChange, onBlur, value, ref } }) => {
              return (
                <Fieldset
                  ref={ref}
                  tw="flex-1"
                  label="Your royalties (%)"
                  onBlur={onBlur}
                  placeholder="Enter number"
                  helperText="Earn royalties each time an edition is sold."
                  errorText={errors.royalty?.message}
                  value={value?.toString()}
                  onChangeText={onChange}
                />
              );
            }}
          />
        </View>
        <View tw="mt-4">
          <Controller
            control={control}
            name="duration"
            render={({ field: { onChange, onBlur, value, ref } }) => {
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
        <View tw="my-4">
          <Controller
            control={control}
            name="notSafeForWork"
            render={({ field: { onChange, value, ref } }) => (
              <Fieldset
                ref={ref}
                tw="flex-1"
                label={
                  <View tw="mr-5 flex">
                    <Text tw="font-semibold dark:text-white">
                      Explicit visual (18+)
                    </Text>
                    <Text tw="max-w-[100%] pt-1 text-xs dark:text-white">
                      Do not check if your song lyrics are explicit.
                    </Text>
                  </View>
                }
                switchOnly
                switchProps={{
                  checked: value,
                  onChange,
                }}
              />
            )}
          />
        </View>
      </BottomSheetScrollView>
      <View tw="px-4">
        <Button size="regular" tw="w-full self-center" onPress={handlePrevStep}>
          Save
        </Button>
      </View>
    </Layout>
  );
};

const Layout = (props: {
  title: string;
  onBackPress: () => void;
  children: any;
  closeIcon?: boolean;
}) => {
  const isDark = useIsDarkMode();
  const insets = useSafeAreaInsets();
  return (
    <View tw="flex-1" style={{ paddingBottom: insets.bottom }}>
      <View tw="mx-4 my-8 flex-row items-center">
        <Pressable tw="absolute" onPress={props.onBackPress}>
          {props.closeIcon ? (
            <Close color={isDark ? "white" : "black"} width={24} height={24} />
          ) : (
            <ArrowLeft
              color={isDark ? "white" : "black"}
              width={24}
              height={24}
            />
          )}
        </Pressable>
        <View tw="mx-auto">
          <Text tw="text-lg text-black dark:text-white">{props.title}</Text>
        </View>
      </View>
      {props.children}
    </View>
  );
};

const DropSuccess = (props: { contractAddress?: string }) => {
  const contractAddress = props.contractAddress;
  const isDark = useIsDarkMode();
  const { data: edition } = useCreatorCollectionDetail(contractAddress);
  const router = useRouter();
  const { data } = useNFTDetailByTokenId({
    chainName: process.env.NEXT_PUBLIC_CHAIN_ID,
    tokenId: "0",
    contractAddress: edition?.creator_airdrop_edition.contract_address,
  });
  const nft = data?.data.item;
  const qrCodeUrl = useMemo(() => {
    if (!nft) return "";
    const url = new URL(getNFTURL(nft));
    if (edition && edition.password) {
      url.searchParams.set("password", edition?.password);
    }
    return url;
  }, [edition, nft]);

  const shareWithTwitterIntent = useCallback(() => {
    Linking.openURL(
      getTwitterIntent({
        url: qrCodeUrl.toString(),
        message: `Just dropped "${nft?.token_name}" on @Showtime_xyz ✦🔗\n\nCollect it for free here:`,
      })
    );
  }, [nft?.token_name, qrCodeUrl]);

  const onCopyLink = useCallback(async () => {
    await Clipboard.setStringAsync(qrCodeUrl.toString());
    toast.success("Copied!");
  }, [qrCodeUrl]);

  return (
    <BottomSheetScrollView>
      <View tw="items-center justify-center p-4 px-8">
        <View
          style={{ borderWidth: 1 }}
          tw="mt-4 w-full overflow-hidden rounded-xl border-gray-500"
        >
          <Media
            item={nft}
            resizeMode="cover"
            numColumns={1}
            sizeStyle={{
              height: 220,
            }}
            theme="dark"
          />
          <View tw="px-4">
            <Creator nft={nft} shouldShowDateCreated={false} />
            <View tw="mt-[-4px] pb-4">
              <Text tw="font-semibold text-gray-800 dark:text-gray-100">
                {nft?.token_name}
              </Text>
              <Text tw="text-gray-800 dark:text-gray-100">
                {nft?.token_description}
              </Text>
            </View>
          </View>
        </View>
        <View tw="mt-4 w-full items-center" style={{ rowGap: 16 }}>
          <Button
            tw="w-full"
            size="regular"
            onPress={shareWithTwitterIntent}
            style={{
              backgroundColor: "#4A99E9",
            }}
          >
            <Twitter color="white" width={20} height={20} />
            <Text
              tw="ml-1 text-sm font-semibold"
              style={{
                color: "white",
              }}
            >
              Tweet
            </Text>
          </Button>
          {/* <Button
            variant="primary"
            tw="w-full"
            size="regular"
            onPress={onCopyLink}
          >
            <View tw="mr-1">
              <InstagramColorful width={20} height={20} />
            </View>
            Share Instagram
          </Button> */}
          <Button
            variant="outlined"
            tw="w-full"
            size="regular"
            onPress={onCopyLink}
          >
            <View tw="mr-1">
              <Link color={isDark ? "white" : "black"} width={20} height={20} />
            </View>
            Copy Link
          </Button>
          <Button
            variant="outlined"
            tw="mt-8 w-full"
            size="regular"
            onPress={() => {
              if (!nft) return;

              if (Platform.OS !== "web") {
                router.pop();
                router.push(`${getNFTSlug(nft)}`);
              } else {
                router.replace(`${getNFTSlug(nft)}`);
              }
            }}
          >
            View Drop
          </Button>
        </View>
      </View>
    </BottomSheetScrollView>
  );
};

// const dummyNFT = {
//   multiple_owners_list: [
//     {
//       quantity: 1,
//       profile_id: 3366447,
//       name: "Nishan Bende",
//       img_url:
//         "https://lh3.googleusercontent.com/AEnH2_JXVpF55uZc0WWhws48yF2TXccF5HbCrz7BXfmPgQQFMr_gDBsQHY6Y5zXT7T_OLz6pQpdr9BML3oIGfUqzI989xPrr3AN4",
//       username: "nishanbende",
//       verified: true,
//       address: "0x38515E6c8561c9A3e1186E2c1fa274Cc7e3aa7c6",
//       wallet_address: "0x38515E6c8561c9A3e1186E2c1fa274Cc7e3aa7c6",
//     },
//   ],
//   like_count: 0,
//   comment_count: 0,
//   nft_id: 283274803,
//   contract_address: "0x7EF25B27D5168f52481e342E40570591fAD6CE71",
//   token_id: "0",
//   token_name: "Moon drop",
//   token_description: "Moon drop",
//   token_img_url: null,
//   token_img_original_url: null,
//   token_has_video: false,
//   token_animation_url: null,
//   animation_preview_url: null,
//   blurhash: null,
//   token_background_color: null,
//   token_aspect_ratio: 1.966189856957087,
//   token_hidden: false,
//   creator_id: 3366447,
//   creator_name: "Nishan Bende",
//   creator_address: "0x38515E6c8561c9A3e1186E2c1fa274Cc7e3aa7c6",
//   creator_address_nonens: "0x38515E6c8561c9A3e1186E2c1fa274Cc7e3aa7c6",
//   creator_img_url:
//     "https://lh3.googleusercontent.com/AEnH2_JXVpF55uZc0WWhws48yF2TXccF5HbCrz7BXfmPgQQFMr_gDBsQHY6Y5zXT7T_OLz6pQpdr9BML3oIGfUqzI989xPrr3AN4",
//   creator_followers_count: 651,
//   multiple_owners: false,
//   token_creator_followers_only: false,
//   creator_username: "nishanbende",
//   creator_verified: true,
//   nsfw: false,
//   owner_id: null,
//   owner_name: null,
//   owner_address: null,
//   owner_address_nonens: null,
//   owner_username: null,
//   owner_verified: false,
//   owner_count: null,
//   owner_img_url: null,
//   token_count: null,
//   token_ko_edition: null,
//   token_edition_identifier: null,
//   source_url: "ipfs://QmYpX8J7vsaGYaFyVAsHveGZtRZ8hURfyEgSqCP1cx2KqE",
//   still_preview_url: null,
//   mime_type: "image/webp",
//   chain_identifier: "80001",
//   chain_name: "mumbai",
//   token_listing_identifier: null,
//   collection_name: null,
//   collection_slug: null,
//   collection_img_url: null,
//   contract_is_creator: false,
//   creator_airdrop_edition_address: "0x7EF25B27D5168f52481e342E40570591fAD6CE71",
//   creator_airdrop_edition_contract_version: 2,
//   token_created: "2023-06-30T09:15:36.676Z",
//   is_user_owner: null,
//   slug: "moon-drop-1688116536",
//   video_urls: null,
//   image_path: "46f0b6f0-6a40-4435-b0b9-b4aae9777d58.png",
//   image_url:
//     "https://media-stage.showtime.xyz/46f0b6f0-6a40-4435-b0b9-b4aae9777d58.png",
//   cloudinary_video_url: null,
//   cloudinary_thumbnail_url: null,
// };
