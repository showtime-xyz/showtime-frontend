import { useEffect } from "react";
import { Platform, Pressable, ScrollView } from "react-native";

import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

import {
  MintNFTType,
  supportedVideoExtensions,
  UseMintNFT,
} from "app/hooks/use-mint-nft";
import { useUser } from "app/hooks/use-user";
import { useWeb3 } from "app/hooks/use-web3";
import { yup } from "app/lib/yup";
import { useRouter } from "app/navigation/use-router";

import {
  Accordion,
  Button,
  Checkbox,
  Fieldset,
  Text,
  View,
} from "design-system";
import { ErrorText } from "design-system/fieldset";
import { useIsDarkMode } from "design-system/hooks";
import { ChevronUp } from "design-system/icon";
import { Image } from "design-system/image";
import { Video } from "design-system/video";

const defaultValues = {
  editionCount: 1,
  royaltiesPercentage: 10,
  notSafeForWork: false,
  hasAcceptedTerms: false,
};

const createNFTValidationSchema = yup.object({
  editionCount: yup
    .number()
    .required()
    .min(1)
    .max(10000)
    .default(defaultValues.editionCount),
  royaltiesPercentage: yup
    .number()
    .required()
    .min(1)
    .max(69)
    .default(defaultValues.royaltiesPercentage),
  hasAcceptedTerms: yup
    .boolean()
    .default(defaultValues.hasAcceptedTerms)
    .isTrue("You must accept the terms and conditions."),
  title: yup.string().required(),
  notSafeForWork: yup.boolean().default(defaultValues.notSafeForWork),
  description: yup.string(),
});

interface CreateProps {
  uri: string;
  state: MintNFTType;
  startMinting: (params: UseMintNFT) => Promise<void>;
}

function Create({ uri, state, startMinting }: CreateProps) {
  const router = useRouter();
  const { user } = useUser();
  const { web3 } = useWeb3();

  const isNotMagic = !web3;

  const handleSubmitForm = (values: Omit<UseMintNFT, "filePath">) => {
    console.log("** Submiting minting form **", values);
    const valuesWithFilePath = { ...values, filePath: uri };
    startMinting(valuesWithFilePath);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(createNFTValidationSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues,
  });
  //#endregion

  const isDark = useIsDarkMode();
  const fileExtension = uri.split(".").pop();
  const isVideo =
    fileExtension && supportedVideoExtensions.includes(fileExtension);
  const Preview = isVideo ? Video : Image;

  const CreateScrollView =
    Platform.OS === "android" ? BottomSheetScrollView : ScrollView;

  // enable submission only on idle or error state.
  const isError =
    state.status === "mediaUploadError" ||
    state.status === "nftJSONUploadError" ||
    state.status === "mintingError";
  const enable = state.status === "idle" || isError;

  useEffect(
    function redirectAfterSuccess() {
      if (state.status === "mintingSuccess") {
        setTimeout(() => {
          router.pop();
          router.push(
            `/profile/${user?.data?.profile?.wallet_addresses_v2?.[0]?.address}`
          );
        }, 1000);
      }
    },
    [state.status, user]
  );

  return (
    <View tw="flex-1">
      <CreateScrollView keyboardShouldPersistTaps="handled">
        <View tw="px-3 py-4">
          <View tw="flex-row items-center" testID="data-private">
            <Preview
              source={{
                uri,
              }}
              tw="w-20 h-20 rounded-2xl"
            />
            <View tw="ml-2 flex-1">
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Fieldset
                    label="Add a title"
                    placeholder="What's the title of your nft?"
                    value={value}
                    errorText={errors.title?.message}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    testID="data-private"
                  />
                )}
              />
            </View>
          </View>

          <View tw="mt-4 flex-row">
            <Controller
              control={control}
              name="editionCount"
              render={({ field: { onChange, onBlur, value } }) => {
                return (
                  <Fieldset
                    tw="flex-1"
                    label="Copies"
                    placeholder="1"
                    helperText="1 by default"
                    onBlur={onBlur}
                    keyboardType="numeric"
                    errorText={errors.editionCount?.message}
                    value={value?.toString()}
                    onChangeText={onChange}
                    returnKeyType="done"
                  />
                );
              }}
            />
            {/* <Controller
              control={control}
              name="editionCount"
              render={({ field: { onChange, onBlur, value } }) => (
                <Fieldset
                  label="Price"
                  placeholder="Amount"
                  tw="ml-4 flex-1"
                  helperText="Add a price if you wish to sell this NFT."
                  keyboardType="numeric"
                  select={{
                    options: [{ label: "ETH", value: "a" }],
                    placeholder: "ETH",
                    value: "a",
                  }}
                />
              )}
            /> */}
          </View>

          <View tw="mt-4">
            <Accordion.Root>
              <Accordion.Item value="options">
                <Accordion.Trigger>
                  <Accordion.Label>Options</Accordion.Label>
                  <Accordion.Chevron>
                    <View tw="rounded-full h-8 w-8 bg-gray-100 dark:bg-gray-900 items-center justify-center">
                      <ChevronUp color={isDark ? "#fff" : "#000"} />
                    </View>
                  </Accordion.Chevron>
                </Accordion.Trigger>
                <Accordion.Content>
                  <Controller
                    control={control}
                    name="description"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Fieldset
                        label="Description"
                        placeholder="Add a description"
                        onBlur={onBlur}
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                  <View tw="flex-row mt-4">
                    {/* <Controller
                      control={control}
                      name="c"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Fieldset
                          label="Choose a collection"
                          placeholder="Collection"
                          selectOnly
                          helperText="Add to an existing collection."
                          tw="w-[48%]"
                          onBlur={onBlur}
                          select={{
                            options: [{ label: "ETH", value: "a" }],
                            placeholder: "ETH",
                            value,
                            size: "regular",
                            onChange: (v) => onChange(v),
                          }}
                        />
                      )}
                    /> */}
                    {isNotMagic ? (
                      <Controller
                        control={control}
                        name="royaltiesPercentage"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <Fieldset
                            label="Creator Royalties"
                            placeholder="10%"
                            // tw="ml-4 w-[48%]"
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            helperText="How much you'll earn each time this NFT is sold."
                            keyboardType="numeric"
                            returnKeyType="done"
                            errorText={errors.royaltiesPercentage?.message}
                          />
                        )}
                      />
                    ) : null}
                  </View>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </View>
          <Controller
            control={control}
            name="hasAcceptedTerms"
            render={({ field: { onChange, value } }) => (
              <View>
                <View tw="mt-8 flex-row">
                  <Checkbox
                    onChange={(v) => onChange(v)}
                    checked={value}
                    accesibilityLabel="I agree to the terms and conditions"
                  />

                  <Pressable onPress={() => onChange(!value)}>
                    <Text tw="ml-4 text-gray-600 dark:text-gray-400 text-sm">
                      I have the rights to publish this artwork, and understand
                      it will be minted on the Polygon network.
                    </Text>
                  </Pressable>
                </View>
                {errors.hasAcceptedTerms?.message ? (
                  <ErrorText>{errors.hasAcceptedTerms?.message}</ErrorText>
                ) : null}
              </View>
            )}
          />
        </View>

        <View tw="mt-8 px-4 w-full">
          <Button
            onPress={handleSubmit(handleSubmitForm)}
            tw="h-12 rounded-full"
            disabled={!enable}
          >
            <Text tw="text-white dark:text-gray-900 text-sm">
              {state.status === "idle"
                ? "Create"
                : state.status === "mediaUpload" ||
                  state.status === "nftJSONUpload"
                ? "Uploading..."
                : state.status === "mintingSuccess"
                ? "Success!"
                : isError
                ? "Failed. Retry"
                : "Minting..."}
            </Text>
          </Button>

          <View tw="h-12 mt-4">
            {state.status === "minting" && !state.isMagic ? (
              <Button
                onPress={handleSubmit(handleSubmitForm)}
                tw="h-12"
                variant="tertiary"
              >
                <Text tw="text-gray-900 dark:text-white text-sm">
                  Didn't receive the signature request yet?
                </Text>
              </Button>
            ) : null}
          </View>
        </View>
      </CreateScrollView>
    </View>
  );
}

export { Create };
