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

import { ConnectButton } from "app/components/connect-button";
import { PolygonScanButton } from "app/components/polygon-scan-button";
import { Preview } from "app/components/preview";
import { useMintNFT, UseMintNFT } from "app/hooks/use-mint-nft";
import { useWallet } from "app/hooks/use-wallet";
import { useWeb3 } from "app/hooks/use-web3";
import { yup } from "app/lib/yup";
import { TextLink } from "app/navigation/link";

import { useFilePicker } from "design-system/file-picker";
import { Hidden } from "design-system/hidden";
import { useRouter } from "design-system/router";

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
  const { web3 } = useWeb3();
  const {
    state,
    setMedia,
    startMinting,
    signTransaction,
    signMessageData,
    shouldShowSignMessage,
  } = useMintNFT();
  const { connected } = useWallet();

  const isSignRequested = signMessageData.status === "sign_requested";
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

  const isDark = useIsDarkMode();
  const pickFile = useFilePicker();

  const router = useRouter();

  const CreateScrollView =
    Platform.OS === "android" ? BottomSheetScrollView : ScrollView;

  // enable submission only on idle or error state.
  const isError =
    state.status === "mediaUploadError" ||
    state.status === "nftJSONUploadError" ||
    state.status === "mintingError";
  const enable = state.status === "idle" || isError;

  // TODO: remove this after imperative login modal API in rainbowkit
  if (!connected) {
    return (
      <View tw="p-4">
        <ConnectButton
          handleSubmitWallet={({ onOpenConnectModal }) => onOpenConnectModal()}
        />
      </View>
    );
  }

  if (state.status === "transactionInitiated") {
    return (
      <View tw="flex-1 items-center justify-center">
        <Spinner />
        <View tw="h-10" />
        <Text tw="px-5 text-center text-base text-black dark:text-white">
          Your NFT is being minted on Polygon network. Feel free to navigate
          away from this screen.
        </Text>
        <View tw="h-4" />
        <PolygonScanButton transactionHash={state.transaction} />
      </View>
    );
  }

  if (shouldShowSignMessage) {
    return (
      <View tw="flex-1 items-center justify-center p-4">
        <Text tw="bold py-4 text-center text-base dark:text-gray-400">
          We need a signature in order to complete minting. This won't cost any
          gas.
        </Text>
        <Button
          tw={`mt-4 px-8 ${isSignRequested ? "opacity-60" : ""}`}
          size="regular"
          variant="primary"
          disabled={isSignRequested}
          onPress={() => {
            signTransaction(signMessageData.data);
          }}
        >
          {isSignRequested ? "Signing..." : "Sign"}
        </Button>
      </View>
    );
  }

  if (state.status === "mintingSuccess") {
    return (
      <View tw="flex-1 items-center justify-center">
        <Text tw="text-8xl">🎉</Text>
        <View tw="h-8" />
        <Text tw="text-center text-4xl text-black dark:text-white">
          Congrats!
        </Text>
        <View tw="mt-8 mb-4">
          <Text tw="font-space-bold my-6 text-center text-lg text-black dark:text-white ">
            Your NFT has been minted on Showtime!
          </Text>
          <View tw="h-4" />
          <Text tw="text-center text-base text-black dark:text-white ">
            It'll appear in your profile in few seconds.
          </Text>
          <View tw="h-8" />
          <PolygonScanButton transactionHash={state.transaction} />
          <Button
            variant="tertiary"
            tw="mt-4"
            size="regular"
            onPress={() => router.push("/profile")}
          >
            Go to profile
          </Button>
        </View>
      </View>
    );
  }

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
              : state.status === "mediaUpload" ||
                state.status === "nftJSONUpload"
              ? "Uploading..."
              : isError
              ? "Failed. Retry"
              : "Minting..."}
          </Button>

          {state.error ? (
            <View tw="mt-4">
              <Text tw="text-red-500">{state.error}</Text>
            </View>
          ) : null}
        </View>
      </CreateScrollView>
    </View>
  );
}

export { Create };
