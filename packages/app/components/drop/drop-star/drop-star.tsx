import { useState, useRef, useEffect, useMemo } from "react";
import {
  useWindowDimensions,
  ScrollView as RNScrollView,
  Platform,
} from "react-native";

import { Controller } from "react-hook-form";
import Animated, {
  FadeIn,
  FadeOut,
  enableLayoutAnimations,
} from "react-native-reanimated";

import { Alert, useAlert } from "@showtime-xyz/universal.alert";
import { BottomSheetModalProvider } from "@showtime-xyz/universal.bottom-sheet";
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
import { useModalScreenContext } from "@showtime-xyz/universal.modal-screen";
import { ModalSheet } from "@showtime-xyz/universal.modal-sheet";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { ScrollView } from "@showtime-xyz/universal.scroll-view";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import Spinner from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { BottomSheetScrollView } from "app/components/bottom-sheet-scroll-view";
import { useOnboardingStatus } from "app/components/payouts/hooks/use-onboarding-status";
import { PayoutSettings } from "app/components/payouts/payout-settings";
import { payoutsRedirectOrigin } from "app/components/payouts/payouts-setup";
import { Preview } from "app/components/preview";
import { MAX_FILE_SIZE, UseDropNFT, useDropNFT } from "app/hooks/use-drop-nft";
import { usePersistForm } from "app/hooks/use-persist-form";
import { useWallet } from "app/hooks/use-wallet";
import { FilePickerResolveValue } from "app/lib/file-picker";
import {
  formatAddressShort,
  getCurrencyPrice,
  getCurrencySymbol,
  isNumber,
} from "app/utilities";

import { MediaPicker } from "../common/media-picker";
import { useStarDropForm } from "../common/star-drop-form-utils";
import { StepProps } from "../common/types";
import { usePaymentEditionPriceRange } from "../common/use-payment-edition-price-range";
import { CopySpotifyLinkTutorial } from "../copy-spotify-link-tutorial";
import { DropViewShare } from "../drop-view-share";
import { MUSIC_DROP_FORM_DATA_KEY } from "../utils";

type CreateDropStep =
  | "media"
  | "title"
  | "song-uri"
  | "more-options"
  | "select-drop";

export const DropStar = () => {
  const [step, setStep] = useState<CreateDropStep>("media");
  const modalContext = useModalScreenContext();
  const onboardinStatus = useOnboardingStatus();
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

  const editionPriceRangeState = usePaymentEditionPriceRange();
  const isDark = useIsDarkMode();

  const onSubmit = async (values: UseDropNFT) => {
    await dropNFT(
      {
        ...values,
        gatingType: "paid_nft",
        editionSize: isUnlimited ? 0 : values.editionSize,
        paidNFTCurrency: editionPriceRangeState.data?.currency,
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
            Unable to create Star Drop at this time. We need more time to
            approve your payment.{" "}
            <Text tw="font-bold">
              You will be notified when you’re approved.{" "}
            </Text>
            Usually 1-2 hours. In the meanwhile if you want to change your
            stripe details. Press below
          </Text>
          <PayoutSettings
            refreshUrl={`${payoutsRedirectOrigin}/drop/free?stripeRefresh=true&platform=${Platform.OS}`}
            returnUrl={`${payoutsRedirectOrigin}/drop/free?stripeReturn=true&platform=${Platform.OS}`}
          />
          <Button
            tw="w-full"
            onPress={() => {
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
        <BottomSheetModalProvider>
          <View style={{ rowGap: 16 }} tw="p-4">
            <Text tw="text-lg text-black dark:text-white">
              Setup cash payouts to create star drop
            </Text>
            <Button
              onPress={() => {
                router.push("/payouts/setup");
              }}
            >
              Setup Cash payout
            </Button>
          </View>
        </BottomSheetModalProvider>
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
          headerShown={false}
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
              if (Platform.OS === "web") {
                if (history?.length > 1) {
                  router.back();
                } else {
                  router.push("/");
                }
              } else {
                router.back();
              }
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
          Upload an image or video
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
    const res = await trigger(
      ["title", "description", "paidNFTUnlockableLink"],
      {
        shouldFocus: true,
      }
    );
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
            name="paidNFTUnlockableLink"
            render={({ field: { onChange, onBlur, value, ref } }) => {
              return (
                <Fieldset
                  ref={ref}
                  label="Exclusive collector link"
                  placeholder="https://dropbox.com/2308fyh28v2h"
                  onBlur={onBlur}
                  errorText={errors.paidNFTUnlockableLink?.message}
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
                  label="Title"
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
  const [showCustomPriceModal, setShowCustomPriceModal] = useState(false);
  const [showCopySpotifyLinkTutorial, setShowCopySpotifyLinkTutorial] =
    useState(false);
  const isDark = useIsDarkMode();
  const scrollViewRef = useRef<RNScrollView>(null);
  const { data: editionPriceRange, isLoading: editionPriceRangeLoading } =
    usePaymentEditionPriceRange();

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
  const defaultPrices = useMemo(
    () =>
      editionPriceRange
        ? [
            editionPriceRange.default_prices.first,
            editionPriceRange.default_prices.second,
            editionPriceRange.default_prices.third,
          ]
        : [],
    [editionPriceRange]
  );

  useEffect(() => {
    // Set initial default price
    if (typeof selectedPrice === "undefined") {
      if (defaultPrices.length > 0) {
        setPrice(defaultPrices[1]);
      }
    }
  }, [defaultPrices, selectedPrice, setPrice]);

  const isDefaultPrice = useMemo(() => {
    return defaultPrices.includes(selectedPrice);
  }, [defaultPrices, selectedPrice]);

  return (
    <BottomSheetModalProvider>
      <Layout
        onBackPress={props.handlePrevStep}
        title="New Drop"
        topRightComponent={
          <Button
            variant="primary"
            disabled={state.status === "loading"}
            tw={`md:hidden ${
              state.status === "loading" ? "opacity-[0.45]" : ""
            }`}
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
                Depends on your fan perks. For example, unreleased songs can be
                more affordable than discounts.
              </Text>
              <View tw="mt-4 flex-row justify-center rounded-3xl bg-white p-2 dark:bg-black">
                {editionPriceRangeLoading ? (
                  <View tw="flex-1 flex-row items-center justify-between">
                    <Skeleton width="30%" height={72} />
                    <Skeleton width="30%" height={72} />
                    <Skeleton width="30%" height={72} />
                  </View>
                ) : (
                  defaultPrices.map((price) => (
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
                        {getCurrencyPrice(editionPriceRange?.currency, price)}
                      </Text>
                      <Text tw="text-xs text-gray-700 dark:text-gray-100">
                        {editionPriceRange?.currency}
                      </Text>
                    </Pressable>
                  ))
                )}
              </View>
              {isDefaultPrice ? (
                <Pressable
                  tw="pt-4"
                  onPress={() => {
                    setShowCustomPriceModal(true);
                  }}
                >
                  <View tw="items-center">
                    <Text tw="font-semibold text-blue-700 dark:text-blue-500">
                      Enter custom price
                    </Text>
                    <Text tw="pt-1 text-gray-600 dark:text-gray-300">
                      From{" "}
                      {getCurrencyPrice(
                        editionPriceRange?.currency,
                        editionPriceRange?.min
                      )}
                      -
                      {getCurrencyPrice(
                        editionPriceRange?.currency,
                        editionPriceRange?.max
                      )}
                    </Text>
                  </View>
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => {
                    setPrice(defaultPrices[1]);
                  }}
                >
                  <View
                    tw="mt-4 flex-row items-center self-center rounded-full bg-yellow-300 px-4 py-2 dark:bg-yellow-700"
                    style={{ columnGap: 8 }}
                  >
                    <Text tw="text-gray-900 dark:text-gray-100">
                      Custom price:{" "}
                      <Text tw="font-bold">
                        {getCurrencyPrice(
                          editionPriceRange?.currency,
                          selectedPrice
                        )}
                      </Text>
                    </Text>
                    <View tw="rounded-full bg-gray-100 p-1">
                      <Close height={14} width={14} color={"black"} />
                    </View>
                  </View>
                </Pressable>
              )}
            </View>
          </View>
          <View tw="mt-4">
            <View tw="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
              <Text tw="font-bold text-gray-900 dark:text-gray-50">
                How long will drop be available?
              </Text>
              <Text tw="pt-1 text-gray-700 dark:text-gray-200">
                After duration expires, drop will not be purchasable on
                Showtime, but will continue to trade on OpenSea
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
              <View tw="ml-[-2px] flex-row flex-wrap" style={{ gap: 8 }}>
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
        <ModalSheet
          snapPoints={["100%"]}
          title="Set custom price"
          visible={showCustomPriceModal}
          close={() => setShowCustomPriceModal(false)}
          onClose={() => setShowCustomPriceModal(false)}
        >
          <View tw="p-4">
            <SetCustomPrice
              handleSubmit={(price: number) => {
                setPrice(price);
                setShowCustomPriceModal(false);
              }}
              maxValue={editionPriceRange?.max}
              minValue={editionPriceRange?.min}
              currency={editionPriceRange?.currency}
            />
          </View>
        </ModalSheet>
      </Layout>
    </BottomSheetModalProvider>
  );
};
const numberRegex = /^\s*-?(\d+(\.\d{1,2})?|\.\d{1,2})\s*$/;
const SetCustomPrice = ({
  handleSubmit,
  minValue,
  maxValue,
  currency,
}: {
  handleSubmit: (price: number) => void;
  minValue: number | null | undefined;
  maxValue: number | null | undefined;
  currency?: string;
}) => {
  const [price, setPrice] = useState("1");
  const [errorText, setErrorText] = useState("");

  const isDark = useIsDarkMode();
  return (
    <View>
      <Fieldset
        label="Price"
        placeholder="Set custom price"
        keyboardAppearance={isDark ? "dark" : "light"}
        value={price.toString()}
        errorText={errorText}
        leftElement={
          <Text tw="mr-1 text-lg font-bold text-black dark:text-white">
            {getCurrencySymbol(currency)}
          </Text>
        }
        keyboardType="numeric"
        helperText={`The price range must be between ${getCurrencyPrice(
          currency,
          minValue
        )} and ${getCurrencyPrice(currency, maxValue)}.`}
        onChangeText={(price) => {
          setPrice(price);
          if (numberRegex.test(price) || !price) {
            setErrorText("");
          } else if (price.substring(price.length - 1) != ".") {
            setErrorText(
              "Please enter the correct number. Prices only accept integers or numbers with 2 decimal places, for example ($3.00, $3.99, $3.10)."
            );
          }
        }}
      />
      <Button
        tw="mt-2"
        onPress={() => {
          if (isNumber(price) && maxValue && minValue) {
            const finalPrice = parseFloat(price);
            if (finalPrice > maxValue || finalPrice < minValue) {
              Alert.alert(
                `The price range must be between ${getCurrencyPrice(
                  currency,
                  minValue
                )} and ${getCurrencyPrice(currency, maxValue)}.`
              );
              return;
            }
            if (numberRegex.test(price)) {
              setErrorText("");
              handleSubmit(finalPrice);
            } else {
              Alert.alert(
                "Please enter the correct number. Prices only accept integers or numbers with 2 decimal places, for example ($3.00, $3.99, $3.10)."
              );
            }
          }
        }}
      >
        Set price
      </Button>
    </View>
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
const Layout = ({
  headerShown = true,
  ...rest
}: {
  title: string;
  onBackPress: () => void;
  children: any;
  closeIcon?: boolean;
  headerShown?: boolean;
  topRightComponent?: React.ReactNode;
}) => {
  const isDark = useIsDarkMode();
  const insets = useSafeAreaInsets();
  return (
    <View
      tw="flex-1"
      style={{ paddingBottom: headerShown ? Math.max(insets.bottom, 16) : 0 }}
    >
      {headerShown ? (
        <View tw="mx-4 my-8 flex-row items-center">
          <Pressable tw="absolute z-20" onPress={rest.onBackPress}>
            {rest.closeIcon ? (
              <Close
                color={isDark ? "white" : "black"}
                width={24}
                height={24}
              />
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
                {rest.title}
              </Text>
            </View>
            <View tw="absolute right-0">{rest.topRightComponent}</View>
          </View>
        </View>
      ) : null}
      {rest.children}
    </View>
  );
};
