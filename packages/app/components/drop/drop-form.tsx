import React, { useRef, useState } from "react";
import {
  Linking,
  Platform,
  ScrollView as RNScrollView,
  TextInput,
  useWindowDimensions,
} from "react-native";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

import { Accordion } from "@showtime-xyz/universal.accordion";
import { Button } from "@showtime-xyz/universal.button";
import { Checkbox } from "@showtime-xyz/universal.checkbox";
import { DataPill } from "@showtime-xyz/universal.data-pill";
import { ErrorText, Fieldset } from "@showtime-xyz/universal.fieldset";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { FlipIcon, Image as ImageIcon } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { ScrollView } from "@showtime-xyz/universal.scroll-view";
import { Switch } from "@showtime-xyz/universal.switch";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { AddWalletOrSetPrimary } from "app/components/add-wallet-or-set-primary";
import { CompleteProfileModalContent } from "app/components/complete-profile-modal-content";
import { MissingSignatureMessage } from "app/components/missing-signature-message";
import { PolygonScanButton } from "app/components/polygon-scan-button";
import { Preview } from "app/components/preview";
import { QRCode } from "app/components/qr-code";
import { UseDropNFT, useDropNFT } from "app/hooks/use-drop-nft";
import { useModalScreenViewStyle } from "app/hooks/use-modal-screen-view-style";
import { useRedirectToCreateDrop } from "app/hooks/use-redirect-to-create-drop";
import { useShare } from "app/hooks/use-share";
import { useUser } from "app/hooks/use-user";
import { useWeb3 } from "app/hooks/use-web3";
import { DropFileZone } from "app/lib/drop-file-zone";
import { useBottomTabBarHeight } from "app/lib/react-navigation/bottom-tabs";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { useRudder } from "app/lib/rudderstack";
import { yup } from "app/lib/yup";
import {
  formatAddressShort,
  getTwitterIntent,
  getTwitterIntentUsername,
  isMobileWeb,
} from "app/utilities";

import { useFilePicker } from "design-system/file-picker";

const SECONDS_IN_A_DAY = 24 * 60 * 60;
const SECONDS_IN_A_WEEK = 7 * SECONDS_IN_A_DAY;
const SECONDS_IN_A_MONTH = 30 * SECONDS_IN_A_DAY;

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

const dropValidationSchema = yup.object({
  file: yup.mixed().required("Media is required"),
  title: yup.string().required(),
  description: yup.string().max(280).required(),
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
});

// const { useParam } = createParam<{ transactionId: string }>()
const ScrollComponent =
  Platform.OS === "android" ? (BottomSheetScrollView as any) : ScrollView;
export const DropForm = () => {
  const isDark = useIsDarkMode();
  const { rudder } = useRudder();
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
    watch,
    setValue,
    reset: resetForm,
  } = useForm<any>({
    resolver: yupResolver(dropValidationSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues,
  });

  const gatingType = watch("gatingType");
  const bottomBarHeight = useBottomTabBarHeight();
  // const [transactionId, setTransactionId] = useParam('transactionId')
  const spotifyTextInputRef = React.useRef<TextInput | null>(null);

  const { state, dropNFT, onReconnectWallet, reset } = useDropNFT();
  const user = useUser();

  const headerHeight = useHeaderHeight();
  const redirectToCreateDrop = useRedirectToCreateDrop();
  const { isMagic } = useWeb3();
  const scrollViewRef = useRef<RNScrollView>(null);
  const windowWidth = useWindowDimensions().width;

  const [accordionValue, setAccordionValue] = useState("");
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
  const modalScreenViewStyle = useModalScreenViewStyle({ mode: "margin" });

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
    return (
      <CompleteProfileModalContent
        title="Just one more step"
        description="You need complete your profile to create drops. It only takes about 1 min"
        cta="Complete Profile"
      />
    );
  }

  if (state.status === "success") {
    const claimPath = `/t/${[process.env.NEXT_PUBLIC_CHAIN_ID]}/${
      state.edition?.contract_address
    }/0`;
    const claimUrl = `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}${claimPath}`;

    const isShareAPIAvailable = Platform.select({
      default: true,
      web: typeof window !== "undefined" && !!navigator.share && isMobileWeb(),
    });

    return (
      <View
        tw="items-center justify-center px-4 pt-8"
        style={modalScreenViewStyle}
      >
        <Text tw="text-8xl">🎉</Text>
        <View>
          <View tw="h-8" />
          <Text tw="text-center text-4xl text-black dark:text-white">
            Congrats!
          </Text>
          <View tw="mt-8 mb-10">
            <Text tw="text-center text-2xl text-black dark:text-white">
              Now share your drop with the world!
            </Text>
          </View>

          <Button
            onPress={() => {
              rudder?.track("Drop Shared", { type: "Twitter" });
              Linking.openURL(
                getTwitterIntent({
                  url: claimUrl,
                  message: `I just created a drop "${
                    state.edition?.name
                  }" by ${getTwitterIntentUsername(
                    user?.user?.data?.profile
                  )} on @Showtime_xyz! 🎁🔗\n\nCollect it for free here:`,
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
                rudder?.track(
                  "Drop Shared",
                  result.activityType
                    ? { type: result.activityType }
                    : undefined
                );
              }
            }}
          >
            {isShareAPIAvailable
              ? "Share the drop with your friends"
              : "Copy drop link 🔗"}
          </Button>
          <Button
            variant="tertiary"
            tw="mt-4"
            onPress={Platform.select({
              web: () => router.push(claimUrl),
              default: () => {
                if (router.pathname === "/") {
                  router.push(claimPath);
                  resetForm();
                  reset();
                } else {
                  router.pop();
                }
              },
            })}
          >
            Skip for now
          </Button>
        </View>
        <View tw="mt-4">
          <QRCode
            size={windowWidth >= 768 ? 400 : windowWidth >= 400 ? 250 : 300}
            text={claimUrl}
          />
        </View>
      </View>
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

  const handleFileChange = (file: string | File) => {
    let extension;
    // On Native file is a string uri
    if (typeof file === "string") {
      extension = file.split(".").pop();
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
      {Platform.OS === "ios" && <View style={{ height: headerHeight }} />}
      <ScrollComponent ref={scrollViewRef} style={{ padding: 16 }}>
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
                          handleFileChange(file.file);
                        }}
                        tw="h-[120px] w-[120px] items-center justify-center rounded-lg md:h-64 md:w-64"
                      >
                        {value ? (
                          <View>
                            <Preview
                              file={value}
                              width={windowWidth >= 768 ? 256 : 120}
                              height={windowWidth >= 768 ? 256 : 120}
                              style={{ borderRadius: 16 }}
                            />
                            <View tw="absolute h-full w-full items-center justify-center">
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
                              color={isDark ? "#FFF" : "#000"}
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
                                Tap to upload a JPG, PNG, GIF, WebM or MP4 file.
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
              {/* <Text>Import media</Text> */}
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, onBlur, value } }) => {
                  return (
                    <Fieldset
                      tw={windowWidth <= 768 ? "flex-1" : ""}
                      label="Title"
                      placeholder="Sweet"
                      onBlur={onBlur}
                      errorText={errors.title?.message}
                      value={value}
                      onChangeText={onChange}
                    />
                  );
                }}
              />
              <View tw="mt-4 hidden flex-1 flex-row md:flex">
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
                        placeholder="What is this drop about?"
                        onBlur={onBlur}
                        helperText="You cannot edit this after the drop is created"
                        errorText={errors.description?.message}
                        value={value}
                        numberOfLines={3}
                        onChangeText={onChange}
                      />
                    );
                  }}
                />
              </View>
            </View>
          </View>

          <Text tw="mt-4 text-gray-600 dark:text-gray-200 md:hidden">
            JPG, PNG, GIF, WebM or MP4 file
          </Text>

          <View tw="mt-4 md:hidden">
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
                    placeholder="What is this drop about?"
                    onBlur={onBlur}
                    helperText="You cannot edit this after the drop is created"
                    errorText={errors.description?.message}
                    value={value}
                    numberOfLines={3}
                    onChangeText={onChange}
                  />
                );
              }}
            />
          </View>
          <View
            tw={[
              `z-10 mt-4 flex-row`,
              gatingType !== "spotify_save" ? "h-12" : "",
            ]}
          >
            <Controller
              control={control}
              name="spotifyUrl"
              render={({ field: { onChange, onBlur, value } }) => {
                return (
                  <Fieldset
                    tw="flex-1"
                    label="Make it a Music Drop?"
                    onBlur={onBlur}
                    ref={spotifyTextInputRef}
                    onChangeText={onChange}
                    style={{
                      display:
                        gatingType === "spotify_save" ? undefined : "none",
                    }}
                    value={value}
                    placeholder="Enter the Spotify song link"
                    errorText={errors.spotifyUrl?.message}
                  />
                );
              }}
            />
            <View style={{ position: "absolute", right: 12, top: 8 }}>
              {user.user?.data.profile.spotify_artist_id ? (
                <Switch
                  checked={gatingType === "spotify_save"}
                  onChange={(v) => {
                    setValue("gatingType", v ? "spotify_save" : undefined);
                    if (!v) {
                      setValue("spotifyUrl", undefined);
                      spotifyTextInputRef.current?.clear();
                    } else {
                      setTimeout(() => {
                        spotifyTextInputRef.current?.focus();
                      }, 100);
                    }
                  }}
                />
              ) : (
                <Button
                  onPress={() => {
                    Linking.openURL(
                      "https://showtimexyz.typeform.com/to/pXQVhkZo"
                    );
                  }}
                >
                  Request
                </Button>
              )}
            </View>
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
                      <Accordion.Label>Drop Details</Accordion.Label>
                      <Accordion.Chevron />
                    </View>
                    <ScrollView tw="flex-row justify-between" horizontal={true}>
                      <DataPill
                        label={`Royalties ${watch("royalty")}%`}
                        type="text"
                      />
                      <DataPill
                        tw={
                          gatingType !== "spotify_save"
                            ? "ml-1 md:ml-4"
                            : "mx-1 md:mx-4"
                        }
                        label={`Editions ${watch("editionSize")}`}
                        type="text"
                      />
                      <DataPill
                        tw={gatingType !== "spotify_save" ? "mx-1 md:mx-4" : ""}
                        label={`Duration ${selectedDurationLabel}`}
                        type="text"
                      />
                      {gatingType !== "spotify_save" ? (
                        <DataPill
                          label={`Password ${
                            watch("password") === ""
                              ? "None"
                              : watch("password")
                          }`}
                          type="text"
                        />
                      ) : null}
                      {gatingType !== "spotify_save" ? (
                        <DataPill
                          label={`Location ${
                            watch("location") === "" || !watch("location")
                              ? "None"
                              : watch("location")
                          }`}
                          type="text"
                        />
                      ) : null}
                    </ScrollView>
                  </View>
                </Accordion.Trigger>
                <Accordion.Content tw="pt-0">
                  <View tw="justify-between lg:flex-row">
                    <View tw="flex-1 flex-row lg:mr-4">
                      <Controller
                        control={control}
                        name="royalty"
                        render={({ field: { onChange, onBlur, value } }) => {
                          return (
                            <Fieldset
                              tw="flex-1"
                              label="Your royalties (%)"
                              onBlur={onBlur}
                              helperText="How much you'll earn each time an edition of this drop is sold"
                              errorText={errors.royalty?.message}
                              value={value?.toString()}
                              onChangeText={onChange}
                            />
                          );
                        }}
                      />
                    </View>
                    <View tw="mt-4 flex-1 flex-row md:mt-0">
                      <Controller
                        control={control}
                        name="editionSize"
                        render={({ field: { onChange, onBlur, value } }) => {
                          return (
                            <Fieldset
                              tw="flex-1"
                              label="Editions"
                              onBlur={onBlur}
                              helperText="How many editions will be available to collect"
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
                  {gatingType !== "spotify_save" ? (
                    <View tw="mt-4 flex-1 flex-row">
                      <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, onBlur, value } }) => {
                          return (
                            <Fieldset
                              tw="flex-1"
                              label="Password (optional)"
                              onBlur={onBlur}
                              helperText="The password required to collect the drop"
                              errorText={errors.password?.message}
                              value={value?.toString()}
                              onChangeText={onChange}
                              placeholder="Enter a password"
                            />
                          );
                        }}
                      />
                    </View>
                  ) : null}
                  {gatingType !== "spotify_save" ? (
                    <View tw="mt-4 flex-1 flex-row">
                      <Controller
                        control={control}
                        name="googleMapsUrl"
                        render={({ field: { onChange, onBlur, value } }) => {
                          return (
                            <Fieldset
                              tw="flex-1"
                              label="Location (optional)"
                              onBlur={onBlur}
                              helperText="The location where people can collect the drop from"
                              errorText={errors.googleMapsUrl?.message}
                              value={value?.toString()}
                              onChangeText={onChange}
                              placeholder="Enter the Google Maps link of the location"
                            />
                          );
                        }}
                      />
                    </View>
                  ) : null}
                  {gatingType !== "spotify_save" ? (
                    <View tw="mt-4 flex-1 flex-row">
                      <Controller
                        control={control}
                        name="radius"
                        render={({ field: { onChange, onBlur, value } }) => {
                          return (
                            <Fieldset
                              tw="flex-1"
                              label="Radius (optional)"
                              onBlur={onBlur}
                              helperText="The location radius (in kilometers)"
                              errorText={errors.radius?.message}
                              value={value?.toString()}
                              onChangeText={onChange}
                              placeholder="1"
                            />
                          );
                        }}
                      />
                    </View>
                  ) : null}
                  <View tw="mt-4 flex-row justify-between">
                    <Controller
                      control={control}
                      name="notSafeForWork"
                      render={({ field: { onChange, value } }) => (
                        <Fieldset
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
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
            {/* <AnimateHeight hide={!accordionValue}>
              <View tw="h-0 md:h-2" />
            </AnimateHeight> */}
            {/* <Text
              onPress={() => setAccordionValue("open")}
              tw="text-gray-600 dark:text-gray-400"
            >
              By default, you will drop 100 editions with 10% royalties for a
              week.
            </Text> */}
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

          <View tw="mt-8">
            <Button
              variant="primary"
              size="regular"
              tw={state.status === "loading" ? "opacity-[0.45]" : ""}
              disabled={state.status === "loading"}
              onPress={handleSubmit(onSubmit)}
            >
              {state.status === "loading"
                ? "Creating... it should take about 10 seconds"
                : state.status === "error"
                ? "Failed. Please retry!"
                : "Drop now"}
            </Button>

            {state.transactionHash ? (
              <View tw="mt-4">
                <PolygonScanButton transactionHash={state.transactionHash} />
              </View>
            ) : null}

            {state.error ? (
              <View tw="mt-4">
                <Text tw="text-red-500">{state.error}</Text>
              </View>
            ) : null}

            {state.signaturePrompt && !isMagic ? (
              <MissingSignatureMessage
                onReconnectWallet={onReconnectWallet}
                onMount={() => {
                  scrollViewRef.current?.scrollToEnd();
                }}
              />
            ) : null}
          </View>

          <View style={{ height: bottomBarHeight + 60 }} />
        </View>
      </ScrollComponent>
    </BottomSheetModalProvider>
  );
};
