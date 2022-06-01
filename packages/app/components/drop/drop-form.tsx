import React from "react";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

import { tw } from "@showtime-xyz/universal.tailwind";

// import { useEffect } from "react"
import { PolygonScanButton } from "app/components/polygon-scan-button";
import { UseDropNFT, useDropNFT } from "app/hooks/use-drop-nft";
import { useShare } from "app/hooks/use-share";
import { yup } from "app/lib/yup";
import { useRouter } from "app/navigation/use-router";

import {
  View,
  Text,
  Fieldset,
  Button,
  ScrollView,
  Checkbox,
} from "design-system";
import { ErrorText } from "design-system/fieldset";
import { useFilePicker } from "design-system/file-picker";
import { Image as ImageIcon } from "design-system/icon";
import FlipIcon from "design-system/icon/Flip";
import { Pressable } from "design-system/pressable";
import { Preview } from "design-system/preview";

// import { createParam } from "../navigation/use-param";

const SECONDS_IN_A_DAY = 24 * 60 * 60;
const SECONDS_IN_A_WEEK = 7 * SECONDS_IN_A_DAY;
const SECONDS_IN_A_MONTH = 30 * SECONDS_IN_A_DAY;

const defaultValues = {
  royalty: 10,
  editionSize: 5000,
  duration: SECONDS_IN_A_WEEK,
  hasAcceptedTerms: false,
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
    .max(10000)
    .default(defaultValues.editionSize),
  royalty: yup
    .number()
    .required()
    .min(1)
    .typeError("Please enter a valid number")
    .max(69)
    .default(defaultValues.royalty),
  hasAcceptedTerms: yup
    .boolean()
    .default(defaultValues.hasAcceptedTerms)
    .required()
    .isTrue("You must accept the terms and conditions."),
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
  // const [transactionId, setTransactionId] = useParam('transactionId')

  const { state, dropNFT } = useDropNFT();

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

  // if (state.transactionHash) {
  //   return <View>
  //     <Text>Loading</Text>
  //   </View>
  // }

  if (state.status === "success") {
    return (
      <View tw="items-center justify-center p-4">
        <Text style={{ fontSize: 100 }}>🎉</Text>
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
            onPress={() =>
              share({
                url: `https://showtime.xyz/t/${[
                  process.env.NEXT_PUBLIC_CHAIN_ID,
                ]}/${state.edition?.contract_address}/0`,
              })
            }
          >
            Share NFT with your friends
          </Button>
          <Button variant="tertiary" tw="mt-4" onPress={router.pop}>
            Skip for now
          </Button>
        </View>
      </View>
    );
  }

  return (
    <BottomSheetModalProvider>
      <ScrollView tw="p-4">
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
                        tw="h-84 w-84 items-center justify-center rounded-lg"
                      >
                        {value ? (
                          <View>
                            <Preview file={value} tw="h-84 w-84 rounded-2xl" />
                            <View tw="absolute h-full w-full items-center justify-center">
                              <View tw="flex-row shadow-lg">
                                <FlipIcon
                                  width={20}
                                  height={20}
                                  color="white"
                                />
                                <Text tw="text-md ml-2 text-white">
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
                      label="Your royalties"
                      onBlur={onBlur}
                      helperText="How much you’ll earn each time this NFT is sold"
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
          <View tw="mt-4 flex-row">
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
          <View tw="mt-4 flex-1">
            <View tw="flex-1 flex-row">
              <Controller
                control={control}
                name="hasAcceptedTerms"
                render={({ field: { onChange, value } }) => (
                  <>
                    <View tw="flex-1 flex-row">
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

          <View tw="mt-8 mb-20">
            <Button
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

            <View tw="mt-4">
              <PolygonScanButton transactionHash={state.transactionHash} />
            </View>

            {state.error ? (
              <View tw="mt-4">
                <Text tw="text-red-500">{state.error}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </BottomSheetModalProvider>
  );
};
