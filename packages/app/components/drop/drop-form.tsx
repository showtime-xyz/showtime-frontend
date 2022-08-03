import React, { useRef } from "react";
import { Linking, Platform, ScrollView as RNScrollView } from "react-native";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@showtime-xyz/universal.button";
import { Checkbox } from "@showtime-xyz/universal.checkbox";
import { ErrorText, Fieldset } from "@showtime-xyz/universal.fieldset";
import { FlipIcon, Image as ImageIcon } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { ScrollView } from "@showtime-xyz/universal.scroll-view";
import { Switch } from "@showtime-xyz/universal.switch";
import { tw } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { MissingSignatureMessage } from "app/components/missing-signature-message";
import { PolygonScanButton } from "app/components/polygon-scan-button";
import { Preview } from "app/components/preview";
import { useMyInfo } from "app/hooks/api-hooks";
import { UseDropNFT, useDropNFT } from "app/hooks/use-drop-nft";
import { useShare } from "app/hooks/use-share";
import { useUser } from "app/hooks/use-user";
import { useWeb3 } from "app/hooks/use-web3";
import { track } from "app/lib/analytics";
import { useBottomTabBarHeight } from "app/lib/react-navigation/bottom-tabs";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { yup } from "app/lib/yup";
import { useNavigateToLogin } from "app/navigation/use-navigate-to";
import {
  getTwitterIntent,
  getTwitterIntentUsername,
  isMobileWeb,
  userHasIncompleteExternalLinks,
} from "app/utilities";

import { useFilePicker } from "design-system/file-picker";

const SECONDS_IN_A_DAY = 24 * 60 * 60;
const SECONDS_IN_A_WEEK = 7 * SECONDS_IN_A_DAY;
const SECONDS_IN_A_MONTH = 30 * SECONDS_IN_A_DAY;

const defaultValues = {
  royalty: 10,
  editionSize: 5000,
  duration: SECONDS_IN_A_WEEK,
  hasAcceptedTerms: false,
  notSafeForWork: false,
};

const durationOptions = [
  { label: "1 day", value: SECONDS_IN_A_DAY },
  { label: "1 week", value: SECONDS_IN_A_WEEK },
  { label: "1 month", value: SECONDS_IN_A_MONTH },
];

const dropValidationSchema = yup.object({
  file: yup.mixed().required("Media is required"),
  title: yup.string().required(),
  description: yup.string().required(),
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
});

// const { useParam } = createParam<{ transactionId: string }>()

export const DropForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(dropValidationSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues,
  });
  const bottomBarHeight = useBottomTabBarHeight();
  // const [transactionId, setTransactionId] = useParam('transactionId')

  const {
    state,
    dropNFT,
    shouldShowSignMessage,
    signMessageData,
    signTransaction,
  } = useDropNFT();
  const user = useUser();
  const { isAuthenticated } = useUser();
  const navigateToLogin = useNavigateToLogin();
  const { data: userProfile } = useMyInfo();
  const headerHeight = useHeaderHeight();
  const { isMagic } = useWeb3();
  const scrollViewRef = useRef<RNScrollView>(null);

  const isSignRequested = signMessageData.status === "sign_requested";

  const onSubmit = (values: UseDropNFT) => {
    dropNFT(values);
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
  const insets = useSafeAreaInsets();

  // if (state.transactionHash) {
  //   return <View>
  //     <Text>Loading</Text>
  //   </View>
  // }

  if (!isAuthenticated) {
    return (
      <View tw="p-4">
        <Button onPress={navigateToLogin}>Please login to continue</Button>
      </View>
    );
  }

  if (
    !userProfile?.data.profile.username ||
    userHasIncompleteExternalLinks(userProfile?.data.profile) ||
    !userProfile?.data.profile.bio ||
    !userProfile?.data.profile.img_url
  ) {
    return (
      <View tw="flex-1 items-center justify-center px-10 text-center">
        <Text tw="pb-4 text-2xl text-gray-900 dark:text-gray-100">
          Hold on!
        </Text>
        <Text style={{ fontSize: 100 }}>✏️</Text>
        <Text tw="py-4 text-center text-base text-gray-900 dark:text-gray-100">
          Please complete your profile before creating a drop
        </Text>
        <Button tw="my-4" onPress={() => router.push("/profile/edit")}>
          Complete your profile
        </Button>
      </View>
    );
  }

  if (state.status === "success") {
    const claimUrl = `https://showtime.xyz/t/${[
      process.env.NEXT_PUBLIC_CHAIN_ID,
    ]}/${state.edition?.contract_address}/0`;

    const isShareAPIAvailable = Platform.select({
      default: true,
      web: typeof window !== "undefined" && !!navigator.share && isMobileWeb(),
    });

    return (
      <View tw="items-center justify-center p-4">
        <Text tw="text-8xl">🎉</Text>
        <View>
          <View tw="h-8" />
          <Text tw="text-center text-4xl text-black dark:text-white">
            Congrats!
          </Text>
          <View tw="mt-8 mb-10">
            <Text tw="text-center text-2xl text-black dark:text-white">
              Now share your free NFT drop to the world!
            </Text>
          </View>

          <Button
            onPress={() => {
              track("Drop Shared", { type: "Twitter" });
              Linking.openURL(
                getTwitterIntent({
                  url: claimUrl,
                  message: `I just dropped a free NFT "${
                    state.edition?.name
                  }" by ${getTwitterIntentUsername(
                    user?.user?.data?.profile
                  )} on @Showtime_xyz! 🎁🔗\n\nClaim yours for free here:`,
                })
              );
            }}
            tw="bg-[#00ACEE]"
            variant="text"
          >
            <Text tw="text-white">Share on Twitter</Text>
          </Button>

          <View tw="h-4" />

          <Button
            onPress={async () => {
              const result = await share({
                url: claimUrl,
              });

              if (result.action === "sharedAction") {
                track(
                  "Drop Shared",
                  result.activityType
                    ? { type: result.activityType }
                    : undefined
                );
              }
            }}
          >
            {isShareAPIAvailable
              ? "Share NFT with your friends"
              : "Copy drop link 🔗"}
          </Button>
          <Button
            variant="tertiary"
            tw="mt-4"
            onPress={Platform.select({
              web: () => router.push(claimUrl),
              default: router.pop,
            })}
          >
            Skip for now
          </Button>
        </View>
      </View>
    );
  }

  return (
    <BottomSheetModalProvider>
      {Platform.OS === "ios" ? <View style={{ height: headerHeight }} /> : null}
      <ScrollView
        tw="p-4"
        ref={scrollViewRef}
        asKeyboardAwareScrollView
        extraScrollHeight={insets.bottom + (Platform.OS === "ios" ? 120 : 200)}
      >
        <View>
          <View tw="md:flex-column lg:flex-row">
            <View>
              <Controller
                control={control}
                name="file"
                render={({ field: { onChange, value } }) => {
                  return (
                    <View tw="z-1 items-center">
                      <Pressable
                        onPress={async () => {
                          const file = await pickFile({ mediaTypes: "all" });
                          onChange(file.file);
                        }}
                        tw="h-80 w-80 items-center justify-center rounded-lg"
                      >
                        {value ? (
                          <View>
                            <Preview file={value} tw="h-80 w-80 rounded-2xl" />
                            <View tw="absolute h-full w-full items-center justify-center">
                              <View tw="flex-row shadow-lg">
                                <FlipIcon
                                  width={20}
                                  height={20}
                                  color="white"
                                />
                                <Text tw=" ml-2 text-sm text-white">
                                  Replace media
                                </Text>
                              </View>
                            </View>
                          </View>
                        ) : (
                          <View tw="w-full flex-1 items-center justify-center rounded-2xl border-2 border-dashed border-gray-800 dark:border-gray-200">
                            <ImageIcon
                              color={
                                tw.style("bg-black dark:bg-white")
                                  ?.backgroundColor as string
                              }
                              width={40}
                              height={40}
                            />
                            <View tw="mt-4">
                              <Text tw="font-bold text-gray-600 dark:text-gray-200">
                                Upload a media file
                              </Text>
                            </View>
                            {errors.file?.message ? (
                              <View tw="mt-2">
                                <Text tw="text-sm text-red-500">
                                  {errors?.file?.message}
                                </Text>
                              </View>
                            ) : null}

                            <View tw="mt-2">
                              <Text tw="max-w-60 text-center text-gray-600 dark:text-gray-200">
                                Tap to upload a JPG, PNG, GIF, MOV or MP4 file.
                              </Text>
                            </View>
                          </View>
                        )}
                      </Pressable>
                    </View>
                  );
                }}
              />
            </View>
            <View>
              <View tw="lg:ml-4">
                {/* <Text>Import media</Text> */}
                <View tw="mt-4 flex-row lg:mt-[0px]">
                  <Controller
                    control={control}
                    name="title"
                    render={({ field: { onChange, onBlur, value } }) => {
                      return (
                        <Fieldset
                          tw="flex-1"
                          label="Title"
                          placeholder="How would you like to name your NFT?"
                          onBlur={onBlur}
                          errorText={errors.title?.message}
                          value={value}
                          onChangeText={onChange}
                        />
                      );
                    }}
                  />
                </View>
                <View tw="mt-4 flex-row">
                  <Controller
                    control={control}
                    name="description"
                    render={({ field: { onChange, onBlur, value } }) => {
                      return (
                        <Fieldset
                          tw="flex-1"
                          label="Description"
                          multiline
                          textAlignVertical="top"
                          placeholder="What is this NFT drop about?"
                          onBlur={onBlur}
                          helperText="You will not be able to edit this after the drop is created"
                          errorText={errors.description?.message}
                          value={value}
                          numberOfLines={7}
                          onChangeText={onChange}
                        />
                      );
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
          <View tw="justify-between lg:flex-row">
            <View tw="mt-4 flex-1 flex-row lg:mr-4">
              <Controller
                control={control}
                name="royalty"
                render={({ field: { onChange, onBlur, value } }) => {
                  return (
                    <Fieldset
                      tw="flex-1"
                      label="Your royalties (%)"
                      onBlur={onBlur}
                      helperText="How much you'll earn each time this NFT is sold"
                      errorText={errors.royalty?.message}
                      value={value?.toString()}
                      onChangeText={onChange}
                    />
                  );
                }}
              />
            </View>
            <View tw="mt-4 flex-1 flex-row">
              <Controller
                control={control}
                name="editionSize"
                render={({ field: { onChange, onBlur, value } }) => {
                  return (
                    <Fieldset
                      tw="flex-1"
                      label="Editions"
                      onBlur={onBlur}
                      helperText="How many editions will be available to claim"
                      errorText={errors.editionSize?.message}
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
              render={({ field: { onChange, onBlur, value } }) => {
                return (
                  <Fieldset
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
            <View>
              <Text tw="text-sm font-bold text-black dark:text-white">
                Explicit content
              </Text>
              <View tw="h-2" />
              <Text tw="text-gray-600 dark:text-gray-400">18+</Text>
            </View>
            <Controller
              control={control}
              name="notSafeForWork"
              render={({ field: { onChange, value } }) => (
                <Switch checked={value} onChange={onChange} />
              )}
            />
          </View>

          <View tw="mt-4 flex-1">
            <View tw="flex-1 flex-row">
              <Controller
                control={control}
                name="hasAcceptedTerms"
                render={({ field: { onChange, value } }) => (
                  <>
                    <View tw="flex-1 flex-row items-center">
                      <Checkbox
                        onChange={(v) => onChange(v)}
                        checked={value}
                        accesibilityLabel="I agree to the terms and conditions"
                      />

                      <Text
                        onPress={() => onChange(!value)}
                        tw="px-4 text-gray-600 dark:text-gray-400"
                      >
                        I have the rights to publish this artwork, and
                        understand it will be minted on the Polygon network.
                      </Text>
                    </View>
                  </>
                )}
              />
            </View>
            {errors.hasAcceptedTerms?.message ? (
              <ErrorText>{errors.hasAcceptedTerms?.message}</ErrorText>
            ) : null}
          </View>

          <View tw="mt-8">
            {shouldShowSignMessage ? (
              <View tw="px-2">
                {!isSignRequested ? (
                  <Text tw="text-center text-lg dark:text-gray-400">
                    We need a signature in order to complete the drop. This
                    won't cost any gas.
                  </Text>
                ) : null}
                <Button
                  tw={`mt-4 ${isSignRequested ? "opacity-60" : ""}`}
                  size="regular"
                  variant="primary"
                  disabled={isSignRequested}
                  onPress={() => {
                    // @ts-ignore
                    signTransaction(signMessageData.data);
                  }}
                >
                  {isSignRequested ? "Signing..." : "Sign Message"}
                </Button>
              </View>
            ) : (
              <Button
                variant="primary"
                size="regular"
                tw={state.status === "loading" ? "opacity-45" : ""}
                disabled={state.status === "loading"}
                onPress={handleSubmit(onSubmit)}
              >
                {state.status === "loading"
                  ? "Submitting..."
                  : state.status === "error"
                  ? "Failed. Retry!"
                  : "Drop Free NFT"}
              </Button>
            )}

            {state.transactionHash ? (
              <View tw="mt-4">
                <PolygonScanButton transactionHash={state.transactionHash} />
              </View>
            ) : null}

            {state.signaturePrompt && !isMagic ? (
              <MissingSignatureMessage
                onMount={() => {
                  scrollViewRef.current?.scrollToEnd();
                }}
              />
            ) : null}

            {state.error ? (
              <View tw="mt-4">
                <Text tw="text-red-500">{state.error}</Text>
              </View>
            ) : null}
          </View>

          <View style={{ height: bottomBarHeight + 60 }} />
        </View>
      </ScrollView>
    </BottomSheetModalProvider>
  );
};
