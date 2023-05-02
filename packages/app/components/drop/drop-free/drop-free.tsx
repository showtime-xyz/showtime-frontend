import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { ScrollView as RNScrollView, useWindowDimensions } from "react-native";

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
  FlipIcon,
  Image as ImageIcon,
  Raffle,
} from "@showtime-xyz/universal.icon";
import { useModalScreenContext } from "@showtime-xyz/universal.modal-screen";
import { Pressable } from "@showtime-xyz/universal.pressable";
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
import { MAX_FILE_SIZE, UseDropNFT, useDropNFT } from "app/hooks/use-drop-nft";
import { usePersistForm } from "app/hooks/use-persist-form";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useRedirectToCreateDrop } from "app/hooks/use-redirect-to-create-drop";
import { useUser } from "app/hooks/use-user";
import { DropFileZone } from "app/lib/drop-file-zone";
import { FilePickerResolveValue, useFilePicker } from "app/lib/file-picker";
import { yup } from "app/lib/yup";
import { createParam } from "app/navigation/use-param";
import { formatAddressShort } from "app/utilities";

import { Hidden } from "design-system/hidden";

import { DropPreview } from "../drop-preview";
import { DropViewShare } from "../drop-view-share";
import { DROP_FORM_DATA_KEY } from "../utils";

const SECONDS_IN_A_DAY = 24 * 60 * 60;
const SECONDS_IN_A_WEEK = 7 * SECONDS_IN_A_DAY;
const SECONDS_IN_A_MONTH = 30 * SECONDS_IN_A_DAY;

const durationOptions = [
  { label: "1 day", value: SECONDS_IN_A_DAY },
  { label: "1 week", value: SECONDS_IN_A_WEEK },
  { label: "1 month", value: SECONDS_IN_A_MONTH },
];

const defaultValues = {
  royalty: 10,
  editionSize: 15,
  duration: SECONDS_IN_A_WEEK,
  radius: 1, // In kilometers
  hasAcceptedTerms: false,
  notSafeForWork: false,
  raffle: false,
};

const { useParam } = createParam<{
  checkoutSuccess?: boolean;
}>();

const excludedPersistFields = ["editionSize"];
export const DropFree = () => {
  const isDark = useIsDarkMode();
  const { user: userProfile } = useUser();
  const [checkoutSuccess] = useParam("checkoutSuccess", {
    parse: (value) => value === "true",
    initial: false,
  });
  // we initialize form's edition size to user's available edition size credits or 0 if user has no credits
  const editionSizeCredit =
    userProfile?.data.paid_drop_credits?.[0]?.edition_size ?? 0;

  const maxEditionSize = userProfile?.data?.profile.verified
    ? 350
    : editionSizeCredit;

  const dropValidationSchema = useMemo(() => {
    const validationObject = {
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
      editionSize: yup.number(),
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
    };

    // for non verified users we don't let users edit editionSize, so it doesn't make much sense to put validation for them
    if (userProfile?.data.profile.verified) {
      validationObject.editionSize = yup
        .number()
        .required()
        .typeError("Please enter a valid number")
        .min(1)
        .max(maxEditionSize, `You can drop ${maxEditionSize} editions at most`);
    }

    return yup.object(validationObject);
  }, [userProfile?.data.profile.verified, maxEditionSize]);

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
    resolver: yupResolver(dropValidationSchema),
    mode: "onBlur",
    shouldFocusError: true,
    reValidateMode: "onChange",
  });

  const shouldProceedToCheckout = watch("editionSize") === 0;

  const bottomBarHeight = usePlatformBottomHeight();
  // const [transactionId, setTransactionId] = useParam('transactionId')

  const { state, dropNFT, reset: resetDropState } = useDropNFT();
  const insets = useSafeAreaInsets();
  // const [transactionId, setTransactionId] = useParam('transactionId')

  const user = useUser({
    redirectTo: "/login",
    redirectIfProfileIncomplete: true,
  });
  const modalScreenContext = useModalScreenContext();

  const redirectToCreateDrop = useRedirectToCreateDrop();
  const scrollViewRef = useRef<RNScrollView>(null);
  const windowWidth = useWindowDimensions().width;
  const router = useRouter();

  const [accordionValue, setAccordionValue] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const onSubmit = (values: UseDropNFT) => {
    if (shouldProceedToCheckout) {
      router.push(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            checkoutModal: true,
          },
        },
        router.asPath
      );
    } else if (!showPreview) {
      setShowPreview(!showPreview);
    } else {
      dropNFT(values, clearStorage);
    }
  };
  const { clearStorage, restoringFiles } = usePersistForm(DROP_FORM_DATA_KEY, {
    watch,
    setValue,
    defaultValues,
    exclude: excludedPersistFields,
  });
  const descPlaceholder = "Why should people collect this drop?";
  useEffect(() => {
    resetDropState();
  }, [resetDropState]);

  // We change the title when user returns from checkout flow and they have credits
  useEffect(() => {
    if (checkoutSuccess) {
      setShowPreview(true);
    }
  }, [checkoutSuccess]);

  useEffect(() => {
    if (showPreview) {
      modalScreenContext?.setTitle("Drop Preview");
    }
    return () => {
      modalScreenContext?.setTitle("Create drop");
    };
  }, [modalScreenContext, showPreview]);

  useEffect(() => {
    if (state.status === "idle") {
      if (!userProfile?.data.profile.verified) {
        setValue("editionSize", editionSizeCredit);
      } else {
        setValue("editionSize", defaultValues.editionSize);
      }
    }
  }, [
    userProfile?.data.profile.verified,
    editionSizeCredit,
    setValue,
    state.status,
  ]);
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

  const pickFile = useFilePicker();

  const selectedDuration = watch("duration");

  const selectedDurationLabel = useMemo(
    () => durationOptions.find((d) => d.value === selectedDuration)?.label,
    [selectedDuration]
  );
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
                    <DropFileZone
                      onChange={handleFileChange}
                      disabled={restoringFiles["file"]}
                    >
                      <View tw="z-1">
                        <Pressable
                          tw={`h-[120px] w-[120px] items-center justify-center overflow-hidden rounded-lg md:h-64 md:w-64 ${
                            restoringFiles["file"] ? "opacity-40" : ""
                          }`}
                          disabled={restoringFiles["file"]}
                          onPress={async () => {
                            const file = await pickFile({
                              mediaTypes: "all",
                            });

                            handleFileChange(file);
                          }}
                        >
                          {value ? (
                            <View>
                              <Preview
                                file={value}
                                width={windowWidth >= 768 ? 256 : 120}
                                height={windowWidth >= 768 ? 256 : 120}
                                style={previewBorderStyle}
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
                                    {errors?.file?.message as string}
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
                            label="Description"
                            tw="flex-1"
                            multiline
                            textAlignVertical="top"
                            placeholder={descPlaceholder}
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
                      placeholder={descPlaceholder}
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
                      helperText="Automatically selects a winner once your drop is over."
                      title="Make it a Raffle"
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
                        {!shouldProceedToCheckout ? (
                          <DataPill
                            label={`${watch("editionSize")} ${
                              watch("editionSize") == 1 ? "Edition" : "Editions"
                            }`}
                            type="text"
                          />
                        ) : null}

                        <DataPill
                          tw="mx-1 md:mx-4"
                          label={`${watch("royalty")}% Royalties`}
                          type="text"
                        />
                        <DataPill
                          tw="mx-1 md:mx-4"
                          label={`Duration: ${selectedDurationLabel}`}
                          type="text"
                        />
                      </ScrollView>
                    </View>
                  </Accordion.Trigger>
                  <Accordion.Content tw="pt-0">
                    <>
                      <View tw="justify-between lg:flex-row">
                        <View
                          tw="flex-1 flex-row"
                          style={{
                            display: shouldProceedToCheckout ? "none" : "flex",
                          }}
                        >
                          <Controller
                            control={control}
                            name="editionSize"
                            render={({
                              field: { onChange, onBlur, value, ref },
                            }) => {
                              return (
                                <Fieldset
                                  ref={ref}
                                  tw="flex-1"
                                  label="Edition size"
                                  placeholder="Enter a number"
                                  onBlur={onBlur}
                                  disabled={!user?.user?.data.profile.verified}
                                  helperText="How many editions will be available to collect"
                                  errorText={errors.editionSize?.message}
                                  value={value?.toString()}
                                  onChangeText={onChange}
                                />
                              );
                            }}
                          />
                        </View>

                        <View
                          tw={`mt-4 flex-1 flex-row md:mt-0 ${
                            shouldProceedToCheckout ? "" : "lg:ml-4"
                          }`}
                        >
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
                                  placeholder="Enter a number"
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
            ) : !showPreview ? (
              "Continue"
            ) : (
              "Drop now"
            )}
          </Button>

          {state.transactionHash && !showPreview ? (
            <View tw="mt-4">
              <PolygonScanButton transactionHash={state.transactionHash} />
            </View>
          ) : null}

          {state.error ? (
            <View tw="mb-1 mt-4 items-center justify-center">
              <Text tw="text-red-500">{state.error}</Text>
            </View>
          ) : null}
        </View>
      </AnimateHeight>

      <View style={{ height: insets.bottom }} />
    </BottomSheetModalProvider>
  );
};

const previewBorderStyle = { borderRadius: 16 };
