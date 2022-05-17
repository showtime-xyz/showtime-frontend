import { Pressable } from "react-native";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

import { PolygonScanButton } from "app/components/polygon-scan-button";
import { UseDropNFT, useDropNFT } from "app/hooks/use-drop-nft";
import { yup } from "app/lib/yup";
import { TextLink } from "app/navigation/link";

import { View, Text, Fieldset, Button, ScrollView } from "design-system";
import { useFilePicker } from "design-system/file-picker";
import { Image as ImageIcon } from "design-system/icon";
import { withModalScreen } from "design-system/modal-screen/with-modal-screen";
import { Preview } from "design-system/preview";
import { tw } from "design-system/tailwind";

const defaultValues = {
  royalty: 10,
  editionSize: 100,
};

const dropValidationSchema = yup.object({
  file: yup.mixed().required(),
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
        <Text variant="text-4xl">🎉</Text>
        <View>
          <Text
            variant="text-4xl"
            tw="mt-4 text-center text-black dark:text-white"
          >
            Congrats!
          </Text>

          <Text
            variant="text-lg"
            tw="mt-8 mb-4 text-center text-black dark:text-white"
          >
            Now share your free NFT drop to the world!
          </Text>

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
    <>
      <ScrollView tw="p-4">
        <View>
          <Controller
            control={control}
            name="file"
            render={({ field: { onChange, value } }) => {
              return (
                <View tw="z-1">
                  <Pressable
                    onPress={async () => {
                      const file = await pickFile({ mediaTypes: "all" });
                      onChange(file.file);
                    }}
                  >
                    {value ? (
                      <Preview file={value} tw="h-24 w-24 rounded-2xl" />
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
                        <Text
                          tw="mt-2 text-gray-600 dark:text-gray-400"
                          variant="text-xs"
                        >
                          Select Media
                        </Text>
                        {errors.file?.message ? (
                          <Text variant="text-sm" tw="mt-2 text-red-500">
                            required
                          </Text>
                        ) : null}
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
                    label="Royalty"
                    onBlur={onBlur}
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
                    errorText={errors.editionSize?.message}
                    value={value?.toString()}
                    onChangeText={onChange}
                  />
                );
              }}
            />
          </View>
        </View>
      </ScrollView>
      <View tw="mb-16 px-4">
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
    </>
  );
};

export const DropScreen = withModalScreen(DropModal, {
  title: "Drop NFT",
  matchingPathname: "/nft/drop",
  matchingQueryParam: "dropNFTModal",
});
