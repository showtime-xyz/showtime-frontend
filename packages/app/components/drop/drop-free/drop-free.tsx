import { useState, useRef, useEffect } from "react";
import {
  useWindowDimensions,
  ScrollView as RNScrollView,
  Platform,
  Linking,
} from "react-native";

import { Controller } from "react-hook-form";
import { useForm } from "react-hook-form";
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
  ArrowLeft,
  ChevronRight,
  Clock,
  Close,
} from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { useModalScreenContext } from "@showtime-xyz/universal.modal-screen";
import { ModalSheet } from "@showtime-xyz/universal.modal-sheet";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { ScrollView } from "@showtime-xyz/universal.scroll-view";
import Spinner from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { BottomSheetScrollView } from "app/components/bottom-sheet-scroll-view";
import { Preview } from "app/components/preview";
import { MAX_FILE_SIZE, UseDropNFT, useDropNFT } from "app/hooks/use-drop-nft";
import { usePersistForm } from "app/hooks/use-persist-form";
import { useWallet } from "app/hooks/use-wallet";
import { FilePickerResolveValue } from "app/lib/file-picker";
import { createParam } from "app/navigation/use-param";
import { formatAddressShort } from "app/utilities";

import { MediaPicker } from "../common/media-picker";
import { useStarDropForm } from "../common/star-drop-form-utils";
import { StepProps } from "../common/types";
import { useOnBoardCreator } from "../common/use-onboard-creator";
import { useOnboardingStatus } from "../common/use-onboarding-status";
import { CopySpotifyLinkTutorial } from "../copy-spotify-link-tutorial";
import { DropViewShare } from "../drop-view-share";
import { MUSIC_DROP_FORM_DATA_KEY } from "../utils";

type CreateDropStep =
  | "media"
  | "title"
  | "song-uri"
  | "more-options"
  | "select-drop";

type Query = {
  stripeReturn?: boolean;
  stripeRefresh?: string;
};

const { useParam } = createParam<Query>();

export const DropFree = () => {
  const [step, setStep] = useState<CreateDropStep>("media");
  const modalContext = useModalScreenContext();
  const onboardinStatus = useOnboardingStatus();
  const [stripeReturn, setStripeReturn] = useParam("stripeReturn", (g) => {
    return g === "true";
  });
  const {
    control,
    setValue,
    formState,
    setError,
    getValues,
    watch,
    clearErrors,
    trigger,
    defaultValues,
    handleSubmit,
    setIsUnlimited,
    isUnlimited,
  } = useStarDropForm();

  const Alert = useAlert();
  const title = getValues("title");
  const description = getValues("description");

  const isDark = useIsDarkMode();
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
    await dropNFT(
      {
        ...values,
        gatingType: "paid_nft",
        editionSize: isUnlimited ? 0 : values.editionSize,
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

  if (onboardinStatus.status === "loading") {
    return (
      <Layout
        onBackPress={() => modalContext?.pop()}
        closeIcon
        title="Complete payout info"
      >
        <View tw="items-center p-4">
          <Spinner />
        </View>
      </Layout>
    );
  }

  if (stripeReturn && onboardinStatus.status === "onboarded") {
    return (
      <Layout
        onBackPress={() => modalContext?.pop()}
        closeIcon
        title="You're approved"
      >
        <View tw="items-center p-4" style={{ rowGap: 24 }}>
          <Text tw="text-base text-gray-900 dark:text-gray-100">
            Your cash payout has been approved for creating Star Drops!
          </Text>
          <Button
            tw="w-full"
            size="regular"
            onPress={() => {
              setStripeReturn(undefined);
              setStep("media");
            }}
          >
            Create Star Drop
          </Button>
        </View>
      </Layout>
    );
  }

  if (onboardinStatus.status === "processing") {
    return (
      <Layout
        onBackPress={() => modalContext?.pop()}
        closeIcon
        title="Come back later"
      >
        <View tw="items-center p-4" style={{ rowGap: 24 }}>
          <Clock color={isDark ? "white" : "black"} width={54} height={54} />
          <Text tw="text-gray-900 dark:text-gray-100">
            Unable to purchase Star Drop at this time. We need more time to
            approve your payment.{" "}
            <Text tw="font-bold">
              You will be notified when you’re approved.{" "}
            </Text>
            Usually 1-2 hours.
          </Text>
          <Button
            tw="w-full"
            onPress={() => {
              setStripeReturn(undefined);
              modalContext?.pop();
            }}
          >
            Okay
          </Button>
        </View>
      </Layout>
    );
  }

  if (onboardinStatus.status === "not_onboarded") {
    return (
      <Layout
        onBackPress={() => router.pop()}
        closeIcon
        title="Payment processing details"
      >
        <CompleteStripeFlow />
      </Layout>
    );
  }

  if (state.status === "success") {
    return (
      <Animated.View
        style={{
          flex: 1,
        }}
        entering={FadeIn}
        exiting={FadeOut}
        key={step}
      >
        <Layout
          onBackPress={() => modalContext?.pop()}
          closeIcon
          title="Congrats! Now share it ✦"
        >
          <DropViewShare
            title={getValues("title")}
            description={getValues("description")}
            file={getValues("file")}
            contractAddress={state.edition?.contract_address}
            dropCreated
          />
        </Layout>
      </Animated.View>
    );
  }

  if (onboardinStatus.status !== "onboarded") return null;

  switch (step) {
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
            getValues={getValues}
            handleNextStep={() => setStep("title")}
            handleFileChange={handleFileChange}
            handlePrevStep={() => {
              router.pop();
            }}
            description={description}
            file={file}
            title={title}
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
          <SetPriceAndDuration
            control={control}
            getValues={getValues}
            isUnlimited={isUnlimited}
            errors={formState.errors}
            trigger={trigger}
            watch={watch}
            setPrice={(p: number) => setValue("paidNFTPrice", p)}
            setDays={(days: number) =>
              setValue("duration", Number(days) * 86400)
            }
            handleNextStep={handleSubmit(onSubmit)}
            handlePrevStep={() => setStep("title")}
            file={file}
            description={description}
            title={title}
            handleMoreOptions={() => setStep("more-options")}
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
            getValues={getValues}
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
    case "more-options":
      return (
        <Animated.View style={{ flex: 1 }} entering={FadeIn} exiting={FadeOut}>
          <CreateDropMoreOptions
            control={control}
            getValues={getValues}
            errors={formState.errors}
            trigger={trigger}
            handleNextStep={() => setStep("song-uri")}
            file={file}
            isUnlimited={isUnlimited}
            setIsUnlimited={setIsUnlimited}
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
  const { width: windowWidth } = useWindowDimensions();

  const mediaWidth = Math.min(300, windowWidth - 32);

  const onNextStep = async () => {
    const res = await trigger("file");
    if (res) {
      handleNextStep();
    }
  };

  return (
    <Layout
      onBackPress={handlePrevStep}
      title="New Drop"
      topRightComponent={
        <Button tw="md:hidden" onPress={onNextStep}>
          Next
        </Button>
      }
    >
      <View tw="px-4">
        <Text tw="px-8 text-center text-xl font-medium text-gray-900 dark:text-gray-50">
          Upload an image or video for your paid unlockable.
        </Text>
        <View tw="mt-8 self-center" style={{ maxWidth: mediaWidth }}>
          <Controller
            control={control}
            name="file"
            render={({ field: { value } }) => {
              return (
                <MediaPicker
                  onChange={handleFileChange}
                  value={value}
                  errorMessage={errors?.file?.message}
                  size={mediaWidth}
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
      <View tw="mt-4 hidden px-4 md:flex">
        <Button size="regular" tw="w-full self-center" onPress={onNextStep}>
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

  const onNextStep = async () => {
    const res = await trigger(["title", "description", "exclusiveLink"], {
      shouldFocus: true,
    });
    if (res) {
      handleNextStep();
    }
  };

  return (
    <Layout
      onBackPress={handlePrevStep}
      title="New Drop"
      topRightComponent={
        <Button tw="md:hidden" onPress={onNextStep}>
          Next
        </Button>
      }
    >
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
            name="exclusiveLink"
            render={({ field: { onChange, onBlur, value, ref } }) => {
              return (
                <Fieldset
                  ref={ref}
                  label="Exclusive collector link"
                  placeholder="https://dropbox.com/2308fyh28v2h"
                  onBlur={onBlur}
                  errorText={errors.exclusiveLink?.message}
                  value={value}
                  helperText="Drop an exclusive link to merchandise discount, unreleased music, unlisted YouTube video... in your collector channel."
                  onChangeText={onChange}
                  numberOfLines={1}
                />
              );
            }}
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
                  placeholder="Why should people collect this drop?"
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
        </View>
        <View>
          <Text tw="text-13 pt-4 text-gray-700 dark:text-gray-200">
            You can edit this up to 30 minutes after creating.
          </Text>
        </View>
      </ScrollView>
      <View tw="px-4">
        <Button
          size="regular"
          tw="mt-4 hidden w-full self-center md:flex"
          onPress={onNextStep}
        >
          Next
        </Button>
      </View>
    </Layout>
  );
};
const prices = [3, 8, 19];
const dropDurations = [3, 7, 30];

const SetPriceAndDuration = (
  props: StepProps & {
    handleMoreOptions: () => void;
    setPrice: (price: number) => void;
    setDays: (days: number) => void;
    watch: any;
    isUnlimited: boolean;
  }
) => {
  const {
    errors,
    control,
    handleNextStep,
    trigger,
    getValues,
    setDays,
    setPrice,
    watch,
    isUnlimited,
  } = props;
  const { state } = useDropNFT();
  const duration = watch("duration") / 86400;
  const selectedPrice = watch("paidNFTPrice");
  const wallet = useWallet();

  const [showCopySpotifyLinkTutorial, setShowCopySpotifyLinkTutorial] =
    useState(false);
  const isDark = useIsDarkMode();
  const scrollViewRef = useRef<RNScrollView>(null);
  const onNextStep = async () => {
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
  };

  return (
    <Layout
      onBackPress={props.handlePrevStep}
      title="New Drop"
      topRightComponent={
        <Button
          variant="primary"
          disabled={state.status === "loading"}
          tw={`md:hidden ${state.status === "loading" ? "opacity-[0.45]" : ""}`}
          onPress={onNextStep}
        >
          {state.status === "loading"
            ? "Creating..."
            : state.status === "error"
            ? "Failed. Retry!"
            : "Create"}
        </Button>
      }
    >
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
        <View tw="mt-4">
          <View tw="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
            <Text tw="font-bold text-gray-900 dark:text-gray-50">
              Price of drop
            </Text>
            <Text tw="pt-1 text-gray-700 dark:text-gray-200">
              We suggest lower price starting out and higher price for creators
              with 1,000 followers
            </Text>
            <View tw="mt-4 flex-row justify-center rounded-3xl bg-white p-2 dark:bg-black">
              {prices.map((price) => (
                <Pressable
                  key={price}
                  onPress={() => setPrice(price)}
                  tw={`flex-1 items-center rounded-2xl p-4 ${
                    selectedPrice === price
                      ? "bg-amber-200 dark:bg-yellow-800"
                      : ""
                  }`}
                  style={{ rowGap: 8 }}
                >
                  <Text
                    tw={`text-4xl text-gray-700
                    dark:text-gray-100`}
                  >
                    ${price}
                  </Text>
                  <Text tw="text-xs text-gray-700 dark:text-gray-100">USD</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
        <View tw="mt-4">
          <View tw="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
            <Text tw="font-bold text-gray-900 dark:text-gray-50">
              How long will drop be available?
            </Text>
            <Text tw="pt-1 text-gray-700 dark:text-gray-200">
              After duration expires, drop will not be purchasable on Showtime,
              but will continue to trade on OpenSea
            </Text>
            <View tw="mt-4 flex-row justify-center rounded-3xl bg-white p-2 dark:bg-black">
              {dropDurations.map((day) => (
                <Pressable
                  key={day}
                  onPress={() => setDays(day)}
                  tw={`flex-1 items-center rounded-2xl p-4 ${
                    duration === day ? "bg-amber-200 dark:bg-yellow-800" : ""
                  }`}
                  style={{ rowGap: 16 }}
                >
                  <Text tw={`text-4xl text-gray-700 dark:text-gray-100`}>
                    {day}
                  </Text>
                  <Text tw="text-xs text-gray-700 dark:text-gray-100">
                    Days
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable
            tw="mt-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-800"
            onPress={props.handleMoreOptions}
            style={{ rowGap: 8 }}
          >
            <View tw="flex-row items-center justify-between">
              <Text tw="text-sm font-semibold text-black dark:text-white">
                More options
              </Text>
              <ChevronRight
                color={isDark ? "white" : "black"}
                width={24}
                height={24}
              />
            </View>
            <View tw="ml-[-2px] flex-row flex-wrap" style={{ gap: 4 }}>
              <DataPill
                tw={isDark ? "bg-black" : "bg-white"}
                label={`${getValues("royalty")}% Royalties`}
                type="text"
              />
              <DataPill
                tw={isDark ? "bg-black" : "bg-white"}
                label={
                  isUnlimited
                    ? `Open Edition`
                    : `${watch("editionSize")} ${
                        watch("editionSize") == 1 ? "Edition" : "Editions"
                      }`
                }
                type="text"
              />
            </View>
            <Text tw="pt-1 text-xs text-gray-600 dark:text-gray-400">
              Your wallet{" "}
              <Text tw="font-bold">{formatAddressShort(wallet.address)}</Text>{" "}
              will be the collection owner.
            </Text>
          </Pressable>
        </View>

        <View tw="mt-4">
          <Text tw="text-xs text-gray-600 dark:text-gray-400">
            By clicking Create, you imply you have the rights to publish this
            content, and understand it will be minted on the Base network.
          </Text>
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
          tw={`hidden md:flex ${
            state.status === "loading" ? "opacity-[0.45]" : ""
          }`}
          onPress={onNextStep}
        >
          {state.status === "loading"
            ? "Creating..."
            : state.status === "error"
            ? "Failed. Please retry!"
            : "Create"}
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

const CreateDropMoreOptions = (
  props: StepProps & {
    isUnlimited: boolean;
    setIsUnlimited: (isUnlimited: boolean) => void;
  }
) => {
  const { control, errors, handlePrevStep, setIsUnlimited, isUnlimited } =
    props;

  return (
    <Layout
      onBackPress={handlePrevStep}
      title="More options"
      topRightComponent={
        <Button tw="md:hidden" onPress={handlePrevStep}>
          Save
        </Button>
      }
    >
      <BottomSheetScrollView style={{ paddingHorizontal: 16 }}>
        <View tw="mt-4">
          <Controller
            control={control}
            name="editionSize"
            render={({ field: { onChange, onBlur, value, ref } }) => {
              return (
                <Fieldset
                  ref={ref}
                  tw={isUnlimited ? "flex-1 opacity-40" : "flex-1 opacity-100"}
                  label="Edition size"
                  placeholder="Enter a number"
                  onBlur={onBlur}
                  helperText="How many editions will be available to collect"
                  errorText={errors.editionSize?.message}
                  disabled={isUnlimited}
                  value={value?.toString()}
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
        {/* <View tw="mt-4">
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
        </View> */}
        <View tw="my-4 flex-1">
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
        <Button
          size="regular"
          tw="hidden w-full self-center md:flex"
          onPress={handlePrevStep}
        >
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
  topRightComponent?: React.ReactNode;
}) => {
  const isDark = useIsDarkMode();
  const insets = useSafeAreaInsets();
  return (
    <View tw="flex-1" style={{ paddingBottom: Math.max(insets.bottom, 8) }}>
      <View tw="mx-4 my-8 flex-row items-center">
        <Pressable tw="absolute z-20" onPress={props.onBackPress}>
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
        <View tw="w-full flex-row items-center justify-center">
          <View>
            <Text tw="text-base font-bold text-black dark:text-white">
              {props.title}
            </Text>
          </View>
          <View tw="absolute right-0">{props.topRightComponent}</View>
        </View>
      </View>
      {props.children}
    </View>
  );
};

// const DropSuccess = (props: { contractAddress?: string }) => {
//   const contractAddress = props.contractAddress;
//   const isDark = useIsDarkMode();
//   const { data: edition } = useCreatorCollectionDetail(contractAddress);
//   const router = useRouter();
//   const { data } = useNFTDetailByTokenId({
//     chainName: process.env.NEXT_PUBLIC_CHAIN_ID,
//     tokenId: "0",
//     contractAddress: edition?.creator_airdrop_edition.contract_address,
//   });
//   const nft = dummyNFT ?? data?.data.item;
//   const qrCodeUrl = useMemo(() => {
//     if (!nft) return "";
//     const url = new URL(getNFTURL(nft));
//     if (edition && edition.password) {
//       url.searchParams.set("password", edition?.password);
//     }
//     return url;
//   }, [edition, nft]);

//   const shareWithTwitterIntent = useCallback(() => {
//     Linking.openURL(
//       getTwitterIntent({
//         url: qrCodeUrl.toString(),
//         message: `Just dropped "${nft?.token_name}" on @Showtime_xyz ✦🔗\n\nCollect it for free here:`,
//       })
//     );
//   }, [nft?.token_name, qrCodeUrl]);

//   const onCopyLink = useCallback(async () => {
//     await Clipboard.setStringAsync(qrCodeUrl.toString());
//     toast.success("Copied!");
//   }, [qrCodeUrl]);

//   return (
//     <BottomSheetScrollView>
//       <View tw="items-center justify-center p-4 px-8">
//         <View
//           style={{ borderWidth: 1 }}
//           tw="mt-4 w-full overflow-hidden rounded-xl border-gray-500"
//         >
//           <Media
//             item={nft}
//             resizeMode="cover"
//             numColumns={1}
//             sizeStyle={{
//               height: 220,
//             }}
//             theme="dark"
//           />
//           <View tw="px-4">
//             <Creator nft={nft} shouldShowDateCreated={false} />
//             <View tw="mt-[-4px] pb-4">
//               <Text tw="font-semibold text-gray-800 dark:text-gray-100">
//                 {nft?.token_name}
//               </Text>
//               <Text tw="text-gray-800 dark:text-gray-100">
//                 {nft?.token_description}
//               </Text>
//             </View>
//           </View>
//         </View>
//         <View tw="mt-4 w-full items-center" style={{ rowGap: 16 }}>
//           <Button
//             tw="w-full"
//             size="regular"
//             onPress={shareWithTwitterIntent}
//             style={{
//               backgroundColor: "#4A99E9",
//             }}
//           >
//             <Twitter color="white" width={20} height={20} />
//             <Text
//               tw="ml-1 text-sm font-semibold"
//               style={{
//                 color: "white",
//               }}
//             >
//               Tweet
//             </Text>
//           </Button>
//           <Button
//             variant="primary"
//             tw="w-full"
//             size="regular"
//             onPress={onCopyLink}
//           >
//             <View tw="mr-1">
//               <InstagramColorful width={20} height={20} />
//             </View>
//             Share Instagram
//           </Button>
//           <Button
//             variant="outlined"
//             tw="w-full"
//             size="regular"
//             onPress={onCopyLink}
//           >
//             <View tw="mr-1">
//               <Link color={isDark ? "white" : "black"} width={20} height={20} />
//             </View>
//             Copy Link
//           </Button>
//           <Button
//             variant="outlined"
//             tw="mt-8 w-full"
//             size="regular"
//             onPress={() => {
//               if (!nft) return;

//               if (Platform.OS !== "web") {
//                 router.pop();
//                 router.push(`${getNFTSlug(nft)}`);
//               } else {
//                 router.replace(`${getNFTSlug(nft)}`);
//               }
//             }}
//           >
//             View Drop
//           </Button>
//         </View>
//       </View>
//     </BottomSheetScrollView>
//   );
// };

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

const countries = [
  {
    label: "United States",
    value: "US",
  },
];

const businessType = [
  {
    label: "Individual",
    value: "individual",
  },
  {
    label: "Company",
    value: "company",
  },
];

const CompleteStripeFlow = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    defaultValues: {
      businessType: "individual",
    } as any,
  });

  const onboardingCreator = useOnBoardCreator();
  const websiteUrl = `${
    __DEV__
      ? "http://localhost:3000"
      : `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}`
  }`;

  const onSubmit = async (data: any) => {
    const res = await onboardingCreator.trigger({
      email: data.email,
      country_code: data.countryCode,
      refresh_url: `${websiteUrl}/drop/free?stripeRefresh=true`,
      return_url: `${websiteUrl}/drop/free?stripeReturn=true`,
      business_type: data.businessType,
    });
    if (Platform.OS === "web") {
      window.location.href = res.url;
    } else {
      Linking.openURL(res.url);
    }
  };

  return (
    <View tw="p-4" style={{ rowGap: 16 }}>
      <Text tw="text-gray-700 dark:text-gray-200">
        The following is required in order to take payments. You’ll be
        redirected to create an account with Stripe who will hold and payout
        your drop sales.
      </Text>
      <Controller
        control={control}
        {...register("email", {
          required: "Please enter an email",
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: "Please enter a valid email",
          },
        })}
        render={({ field: { onChange, onBlur, value, ref } }) => {
          return (
            <Fieldset
              tw="flex-1"
              ref={ref}
              label="Email"
              placeholder="Enter an email"
              onBlur={onBlur}
              errorText={errors.email?.message}
              value={value}
              onChangeText={onChange}
            />
          );
        }}
      />

      <View tw="flex-row" style={{ columnGap: 16 }}>
        <Controller
          control={control}
          name="countryCode"
          rules={{
            required: {
              value: true,
              message: "Please select a country",
            },
          }}
          render={({ field: { onChange, onBlur, value, ref } }) => {
            return (
              <Fieldset
                ref={ref}
                tw="flex-1"
                label="Country"
                onBlur={onBlur}
                errorText={errors.countryCode?.message}
                selectOnly
                select={{
                  options: countries,
                  placeholder: "Country",
                  value: value,
                  onChange,
                  tw: "flex-1",
                }}
              />
            );
          }}
        />

        <Controller
          control={control}
          name="businessType"
          rules={{
            required: {
              value: true,
              message: "Please select a business type",
            },
          }}
          render={({ field: { onChange, onBlur, value, ref } }) => {
            console.log("valuee ", value);
            return (
              <Fieldset
                ref={ref}
                tw="flex-1"
                label="Business type"
                onBlur={onBlur}
                errorText={errors.countryCode?.message}
                selectOnly
                select={{
                  options: businessType,
                  placeholder: "Business type",
                  value: value,
                  onChange,
                  tw: "flex-1",
                }}
              />
            );
          }}
        />
      </View>
      <Button
        onPress={handleSubmit(onSubmit)}
        tw={onboardingCreator.isMutating ? `opacity-30` : ""}
        size="regular"
      >
        <View tw="flex-row items-center" style={{ columnGap: 4 }}>
          <Image source={require("./stripe-logo.png")} height={20} width={20} />
          <Text tw="font-semibold text-white dark:text-black">
            {onboardingCreator.isMutating
              ? "Please wait..."
              : "Setup cash payout"}
          </Text>
        </View>
      </Button>
    </View>
  );
};
