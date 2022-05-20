import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

import { PolygonScanButton } from "app/components/polygon-scan-button";
import { UseDropNFT, useDropNFT } from "app/hooks/use-drop-nft";
import { yup } from "app/lib/yup";
import { TextLink } from "app/navigation/link";

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
import { withModalScreen } from "design-system/modal-screen/with-modal-screen";
import { Pressable } from "design-system/pressable";
import { Preview } from "design-system/preview";
import { tw } from "design-system/tailwind";

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
    .min(1)
    .max(10000)
    .default(defaultValues.editionSize),
  royalty: yup
    .number()
    .required()
    .min(1)
    .max(69)
    .default(defaultValues.royalty),
  hasAcceptedTerms: yup
    .boolean()
    .default(defaultValues.hasAcceptedTerms)
    .required()
    .isTrue("You must accept the terms and conditions."),
});

const DropModal = () => {
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

  const { state, dropNFT } = useDropNFT();

  const onSubmit = (values: UseDropNFT) => {
    dropNFT(values);
  };

  const pickFile = useFilePicker();

  if (state.status === "success") {
    return (
      <View tw="items-center justify-center">
        <Text tw="text-4xl">🎉</Text>
        <View>
          <View tw="h-4" />
          <Text tw="text-center text-4xl text-black dark:text-white">
            Congrats!
          </Text>

          <View tw="mt-8 mb-4">
            <Text tw="text-center text-lg text-black dark:text-white">
              Now share your free NFT drop to the world!
            </Text>
          </View>
          <TextLink
            href={`/nft/${process.env.NEXT_PUBLIC_CHAIN_ID}/${state.edition?.contract_address}`}
            tw="text-center font-bold text-blue-700"
          >
            Open URL
          </TextLink>
        </View>
      </View>
    );
  }

  return (
    <BottomSheetModalProvider>
      <ScrollView tw="p-4">
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
                      <Preview file={value} tw="h-84 w-84 rounded-2xl" />
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
          {/* <Text>Import media</Text> */}
          <View tw="mt-4 flex-row">
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
                    onChangeText={onChange}
                  />
                );
              }}
            />
          </View>
          <View tw="mt-4 flex-row">
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
          <View tw="mt-4 flex-row">
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
            <View tw="flex-row flex-1">
              <Controller
                control={control}
                name="hasAcceptedTerms"
                render={({ field: { onChange, value } }) => (
                  <>
                    <View tw="flex-row flex-1">
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
                : "Submit"}
            </Button>

            <View tw="mt-4">
              <PolygonScanButton transactionHash={state.transactionHash} />
            </View>
          </View>
        </View>
      </ScrollView>
    </BottomSheetModalProvider>
  );
};

export const DropScreen = withModalScreen(DropModal, {
  title: "Drop NFT",
  matchingPathname: "/nft/drop",
  matchingQueryParam: "dropNFTModal",
});
