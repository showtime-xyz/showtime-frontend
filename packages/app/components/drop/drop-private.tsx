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
  useWindowDimensions,
} from "react-native";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

import { Accordion } from "@showtime-xyz/universal.accordion";
import { Alert } from "@showtime-xyz/universal.alert";
import { BottomSheetModalProvider } from "@showtime-xyz/universal.bottom-sheet";
import { Button } from "@showtime-xyz/universal.button";
import { Checkbox } from "@showtime-xyz/universal.checkbox";
import { DataPill } from "@showtime-xyz/universal.data-pill";
import { ErrorText, Fieldset } from "@showtime-xyz/universal.fieldset";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { FlipIcon, Image as ImageIcon } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { ScrollView } from "@showtime-xyz/universal.scroll-view";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { AddWalletOrSetPrimary } from "app/components/add-wallet-or-set-primary";
import { BottomSheetScrollView } from "app/components/bottom-sheet-scroll-view";
import { PolygonScanButton } from "app/components/polygon-scan-button";
import { Preview } from "app/components/preview";
import { QRCodeModal } from "app/components/qr-code";
import { useMyInfo } from "app/hooks/api-hooks";
import { MAX_FILE_SIZE, UseDropNFT, useDropNFT } from "app/hooks/use-drop-nft";
import { usePersistForm } from "app/hooks/use-persist-form";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useRedirectToCreateDrop } from "app/hooks/use-redirect-to-create-drop";
import { useShare } from "app/hooks/use-share";
import { useUser } from "app/hooks/use-user";
import { DropFileZone } from "app/lib/drop-file-zone";
import { FilePickerResolveValue, useFilePicker } from "app/lib/file-picker";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { yup } from "app/lib/yup";
import { formatAddressShort } from "app/utilities";

import { Hidden } from "design-system/hidden";

const SECONDS_IN_A_DAY = 24 * 60 * 60;
const SECONDS_IN_A_WEEK = 7 * SECONDS_IN_A_DAY;
const SECONDS_IN_A_MONTH = 30 * SECONDS_IN_A_DAY;

const defaultValues = {
  royalty: 10,
  editionSize: 15,
  duration: SECONDS_IN_A_MONTH,
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

const DROP_FORM_DATA_KEY = "drop_form_local_data_private";

export const DropPrivate = () => {
  const isDark = useIsDarkMode();
  const { data: userProfile } = useMyInfo();
  const maxEditionSize = userProfile?.data?.profile.verified ? 350 : 50;
  const dropValidationSchema = useMemo(
    () =>
      yup.object({
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
          .max(
            maxEditionSize,
            `You can drop ${maxEditionSize} editions at most`
          )
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
        password: yup
          .string()
          .required("Password is a required field for private drops")
          .max(255),
        radius: yup.number().min(0.01).max(10),
      }),
    [maxEditionSize]
  );
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
    watch,
    setValue,
  } = useForm<any>({
    resolver: yupResolver(dropValidationSchema),
    mode: "onBlur",
    shouldFocusError: true,

    reValidateMode: "onChange",
  });

  const insets = useSafeAreaInsets();

  const bottomBarHeight = usePlatformBottomHeight();

  const { state, dropNFT } = useDropNFT();
  const user = useUser({
    redirectTo: "/login",
    redirectIfProfileIncomplete: true,
  });

  const headerHeight = useHeaderHeight();
  const redirectToCreateDrop = useRedirectToCreateDrop();
  const scrollViewRef = useRef<RNScrollView>(null);
  const windowWidth = useWindowDimensions().width;

  const [accordionValue, setAccordionValue] = useState("");
  const { clearStorage } = usePersistForm(DROP_FORM_DATA_KEY, {
    watch,
    setValue,
    defaultValues,
  });

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

  const onSubmit = (values: UseDropNFT) => {
    dropNFT({ ...values, gatingType: "password" }, clearStorage);
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
      {Platform.OS === "ios" && <View style={{ height: headerHeight }} />}
      <BottomSheetScrollView
        ref={scrollViewRef}
        style={{ padding: 16 }}
        contentContainerStyle={{ paddingBottom: bottomBarHeight }}
      >
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
                    render={({ field: { onChange, onBlur, value, ref } }) => {
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

          <View tw="mt-4 flex-row">
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value, ref } }) => {
                return (
                  <Fieldset
                    ref={ref}
                    tw="flex-1"
                    label="Password"
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
                        label={`${watch("editionSize")} ${
                          watch("editionSize") == 1 ? "Edition" : "Editions"
                        }`}
                        type="text"
                      />
                      <DataPill
                        tw="ml-1 md:ml-4"
                        label={`${watch("royalty")}% Royalties`}
                        type="text"
                      />

                      <DataPill
                        tw={"mx-1 md:mx-4"}
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
                                tw="flex-1"
                                label="Edition size"
                                placeholder="Enter a number"
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
                      <View tw="mt-4 flex-1 flex-row md:mt-0 lg:mr-4">
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
                            label={
                              <View tw="mr-5 flex">
                                <Text tw="font-semibold">
                                  Explicit visual (18+)
                                </Text>
                                <Text tw="max-w-[100%] pt-1 text-xs">
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
      </BottomSheetScrollView>
      <View tw="px-4">
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
          <View tw="mb-1 mt-4 items-center justify-center">
            <Text tw="text-red-500">{state.error}</Text>
          </View>
        ) : null}
      </View>

      <View style={{ height: insets.bottom }} />
    </BottomSheetModalProvider>
  );
};
const previewBorderStyle = { borderRadius: 16 };
