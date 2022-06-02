import { useContext, useEffect } from "react";
import { Platform, Pressable, ScrollView } from "react-native";

import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

import { Accordion } from "@showtime-xyz/universal.accordion";
import { Button } from "@showtime-xyz/universal.button";
import { Checkbox } from "@showtime-xyz/universal.checkbox";
import { Fieldset } from "@showtime-xyz/universal.fieldset";
import { ErrorText } from "@showtime-xyz/universal.fieldset";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { ChevronUp, Image as ImageIcon } from "@showtime-xyz/universal.icon";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { Switch } from "@showtime-xyz/universal.switch";
import { tw } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { MintContext } from "app/context/mint-context";
import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useMintNFT, UseMintNFT } from "app/hooks/use-mint-nft";
import { useUser } from "app/hooks/use-user";
import { useWeb3 } from "app/hooks/use-web3";
import { yup } from "app/lib/yup";
import { TextLink } from "app/navigation/link";
import { useRouter } from "app/navigation/use-router";

import { useFilePicker } from "design-system/file-picker";
import { Hidden } from "design-system/hidden";
import { Preview } from "design-system/preview";

const defaultValues = {
  editionCount: 1,
  royaltiesPercentage: 10,
  notSafeForWork: false,
  hasAcceptedTerms: false,
  file: { file: null, type: null },
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
  file: yup.mixed().required(),
});

function Create() {
  const router = useRouter();
  const { user } = useUser();
  const { web3 } = useWeb3();
  const { state } = useContext(MintContext);
  const { setMedia, startMinting } = useMintNFT();
  const { userAddress: address } = useCurrentUserAddress();

  const isNotMagic = !web3;

  const handleSubmitForm = (values: Omit<UseMintNFT, "filePath">) => {
    console.log("** Submiting minting form **", values);
    startMinting(values);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(createNFTValidationSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      ...defaultValues,
      file: {
        // initialise file in form with minting state. Happens when we set file in mint from camera screen
        file: state.file,
        type: state.fileType,
      },
    },
  });

  //#endregion

  const isDark = useIsDarkMode();
  const pickFile = useFilePicker();

  const { isMagic } = useWeb3();

  const CreateScrollView =
    Platform.OS === "android" ? BottomSheetScrollView : ScrollView;

  // enable submission only on idle or error state.
  const isError =
    state.status === "mediaUploadError" ||
    state.status === "nftJSONUploadError" ||
    state.status === "mintingError";
  const enable = state.status === "idle" || isError;

  useEffect(
    function redirect() {
      if (
        (state.status === "mediaUpload" || state.status === "nftJSONUpload") &&
        Platform.OS !== "web"
      ) {
        // TODO: save the file in the user gallery (if taken from camera)
        setTimeout(() => {
          router.pop();
          router.replace(
            Platform.OS === "web"
              ? `/@${user?.data?.profile?.username ?? address}`
              : `/profile`
          );
        }, 1000);
      }
    },
    [state.status, user, address, router]
  );

  return (
    <View tw="flex-1">
      <CreateScrollView keyboardShouldPersistTaps="handled">
        <View tw="px-3 py-4">
          <View
            tw="rounded-4 flex-row items-center bg-gray-100 dark:bg-gray-900"
            testID="data-private"
          >
            <Hidden from="md">
              <Controller
                control={control}
                name="file"
                render={({ field: { onChange, value } }) => {
                  return (
                    <View tw="z-1">
                      <Pressable
                        onPress={async () => {
                          const file = await pickFile({ mediaTypes: "all" });
                          onChange(file);
                          setMedia({ file: file.file, fileType: file.type });
                        }}
                      >
                        {value.file ? (
                          <Preview
                            file={value.file}
                            //@ts-ignore
                            type={value.type}
                            tw="h-24 w-24 rounded-2xl"
                          />
                        ) : (
                          <View tw="h-24 w-24 items-center justify-center rounded-2xl">
                            <ImageIcon
                              color={
                                tw.style("bg-black dark:bg-white")
                                  ?.backgroundColor as string
                              }
                              width={24}
                              height={24}
                            />
                            <View tw="h-2" />
                            <Text tw="text-xs text-gray-600 dark:text-gray-400">
                              Select Media
                            </Text>
                            {errors.file?.message ? (
                              <>
                                <View tw="h-2" />
                                <Text tw="text-sm text-red-500">required</Text>
                              </>
                            ) : null}
                          </View>
                        )}
                      </Pressable>
                    </View>
                  );
                }}
              />
            </Hidden>
            <View tw="flex-1">
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Fieldset
                    label="Title"
                    placeholder="Add a title"
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

          <Hidden until="md">
            <Controller
              control={control}
              name="file"
              render={({ field: { onChange, value } }) => {
                return (
                  <Pressable
                    onPress={async () => {
                      const file = await pickFile({ mediaTypes: "all" });
                      onChange(file);
                      setMedia({ file: file.file, fileType: file.type });
                    }}
                  >
                    <View
                      tw="mt-4 items-center rounded-xl bg-gray-100 p-8 dark:bg-gray-900"
                      //@ts-ignore
                      style={{
                        borderStyle: "dashed",
                        borderWidth: 1,
                        borderColor: tw.style("dark:bg-gray-600 bg-gray-400")
                          .backgroundColor,
                      }}
                    >
                      {value.file ? (
                        <View>
                          <Preview
                            file={value.file}
                            //@ts-ignore
                            type={value.type}
                            tw="h-80 w-80 rounded-2xl"
                          />
                          {state.status === "nftJSONUpload" ||
                          state.status === "mediaUpload" ? (
                            <View tw="mt-4 flex-row items-center rounded-full bg-white py-3 px-4 dark:bg-black">
                              <Spinner size="small" />
                              <Text tw="ml-4 text-xs font-bold text-black dark:text-white">
                                Uploading to IPFS...
                              </Text>
                            </View>
                          ) : null}
                        </View>
                      ) : (
                        <View tw="items-center">
                          <Text tw="text-sm font-bold text-gray-900 dark:text-white">
                            Select file to upload
                          </Text>
                          <View tw="h-4" />
                          <Text tw="text-sm text-gray-600 dark:text-gray-400">
                            png, jpg, mp4, mov, gltf, glb
                          </Text>
                          <View tw="h-4" />
                          <Text tw="text-sm text-gray-600 dark:text-gray-400">
                            Stored on{" "}
                            <TextLink
                              tw="text-sm font-bold text-gray-600 dark:text-gray-400"
                              href={"https://ipfs.io/"}
                            >
                              IPFS
                            </TextLink>
                          </Text>
                          {errors.file?.message ? (
                            <>
                              <View tw="h-2" />
                              <Text tw="text-sm text-red-500">required</Text>
                            </>
                          ) : null}
                        </View>
                      )}
                    </View>
                  </Pressable>
                );
              }}
            />
          </Hidden>

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

          <View tw="mt-4 rounded-2xl border-2 border-gray-200 dark:border-gray-800">
            <Accordion.Root
              value={Platform.select({ web: "options", default: undefined })}
            >
              <Accordion.Item value="options">
                <Accordion.Trigger>
                  <Accordion.Label>Options</Accordion.Label>
                  <Accordion.Chevron>
                    <View tw="h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900">
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
                  {/* <View tw="flex-row mt-4"> */}
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
                          label="Creator Royalties (%)"
                          placeholder="10%"
                          tw="mt-4"
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

                  <View tw="mt-8 flex-row justify-between">
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
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </View>
          <Controller
            control={control}
            name="hasAcceptedTerms"
            render={({ field: { onChange, value } }) => (
              <View>
                <View tw="mt-8 flex-row items-center justify-center">
                  <Checkbox
                    onChange={(v) => onChange(v)}
                    checked={value}
                    accesibilityLabel="I agree to the terms and conditions"
                  />

                  <Pressable
                    onPress={() => onChange(!value)}
                    style={{ flex: 1 }}
                  >
                    <Text tw="ml-4 text-sm text-gray-600 dark:text-gray-400">
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
      </CreateScrollView>

      <View tw="mt-8 w-full px-4">
        <Button
          variant="primary"
          size="regular"
          onPress={handleSubmit(handleSubmitForm)}
          disabled={!enable}
          tw={!enable ? "opacity-60" : ""}
        >
          {state.status === "idle"
            ? "Create"
            : state.status === "mediaUpload" || state.status === "nftJSONUpload"
            ? "Uploading..."
            : state.status === "mintingSuccess"
            ? "Success!"
            : isError
            ? "Failed. Retry"
            : "Minting..."}
        </Button>

        <View tw="mt-4 h-12">
          {state.status === "minting" && !isMagic ? (
            <Button
              onPress={handleSubmit(handleSubmitForm)}
              tw="h-12"
              variant="tertiary"
            >
              <Text tw="text-sm text-gray-900 dark:text-white">
                Didn't receive the signature request yet?
              </Text>
            </Button>
          ) : null}
        </View>
      </View>
    </View>
  );
}

export { Create };
