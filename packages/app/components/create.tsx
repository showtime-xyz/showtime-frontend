import { View, Text, Fieldset, Select, Checkbox, Button } from "design-system";
import { ChevronUp } from "design-system/icon";
import { Image } from "design-system/image";
import { Pressable, ScrollView } from "react-native";
import { useMintNFT } from "../hooks/api-hooks";
import { Accordion } from "design-system";
import { useIsDarkMode } from "design-system/hooks";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useForm, Controller } from "react-hook-form";
import { yup } from "app/lib/yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorText } from "design-system/fieldset";

const defaultValues = {
  editionCount: 1,
  royaltiesPercentage: 10,
  notSafeForWork: false,
  hasAcceptedTerms: false,
};

// function CloseButton({
//   onPress,
//   variant = "light",
//   size = "lg",
// }: {
//   onPress: () => void;
//   variant?: "light" | "dark";
//   size?: "lg" | "md";
// }) {
//   const dimension = size === "lg" ? 48 : 24;

//   return (
//     <Pressable
//       onPress={onPress}
//       style={{
//         width: dimension,
//         height: dimension,
//         borderRadius: dimension / 2,
//         backgroundColor: tw.color(
//           variant === "light" ? "gray-100" : "gray-900"
//         ),
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       <Close
//         width={size === "lg" ? 24 : 18}
//         height={size === "lg" ? 24 : 18}
//         color={variant === "light" ? "#000" : "#fff"}
//       />
//     </Pressable>
//   );
// }

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

function Create() {
  const { startMinting, state } = useMintNFT();
  const handleSubmitForm = (values: any) => {
    startMinting(values);

    // FileSystem.downloadAsync(
    //   "https://lh3.googleusercontent.com/eDuDBbt8CfAClm4XAfRPf63lZ0DCcf1elQai_43gcmnWr8nuwjXoAZF3xwmWnh5yt8BCA2URJzIJijSVjpUjBVCK-kMi7RZwTuSx=w660",
    //   FileSystem.documentDirectory + "test.jpg"
    // )
    //   .then(({ uri }) => {
    //     const fakeData = {
    //       filePath: uri,
    //       title: "Nature",
    //       description: "A beautiful nature",
    //       notSafeForWork: false,
    //       editionCount: 1,
    //       royaltiesPercentage: 10,
    //     };
    //     console.log("Finished downloading to ", uri);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
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
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View tw="flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: tabBarHeight + 100 }}>
        <View tw="p-4">
          <View tw="mt-11 flex-row">
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/PUGdxrLBiiJqxFRNfJWkVpyE3xuXC2XXsjYSgeuzX-XM_3ApI7ydBd-E1M3POKp_B8miwtoS4FHhDAiwhyNnxX1S_ktvj-1DvZIe=w1328",
              }}
              style={{ width: 84, height: 84, borderRadius: 20 }}
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
                    onChangeText={(text) => onChange(text)}
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
                    value={value.toString()}
                    onChangeText={(text) => onChange(text)}
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
                    <Button variant="tertiary" tw="rounded-full h-8 w-8">
                      <ChevronUp color={isDark ? "#fff" : "#000"} />
                    </Button>
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
                        onChangeText={(v) => onChange(v)}
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
                          onChangeText={(v) => onChange(v)}
                          helperText="How much you'll earn each time this NFT is sold."
                          keyboardType="numeric"
                          returnKeyType="done"
                          errorText={errors.royaltiesPercentage?.message}
                        />
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
      </ScrollView>
      <View tw="absolute px-4 w-full" style={{ bottom: tabBarHeight + 16 }}>
        <Button
          onPress={handleSubmit(handleSubmitForm)}
          disabled={state.status !== "idle"}
          tw="h-12 rounded-full"
        >
          <Text tw="text-white dark:text-gray-900 text-sm">
            {state.status === "idle"
              ? "Create"
              : state.status === "fileUpload"
              ? "Uploading..."
              : state.status === "minting"
              ? "Minting..."
              : state.status === "mintingError" ||
                state.status === "fileUploadError"
              ? "Failed. Retry"
              : "Success!"}
          </Text>
        </Button>
      </View>
    </View>
  );
}

export { Create };
