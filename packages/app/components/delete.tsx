import useSWR from "swr";
import { useEffect, useMemo } from "react";
import { Platform, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { formatDistanceToNowStrict } from "date-fns";
import { NFT } from "app/types";
import { yup } from "app/lib/yup";
import { axios } from "app/lib/axios";
import { Owner } from "design-system/card";
import { tw } from "design-system/tailwind";
import { useUser } from "app/hooks/use-user";
import { PolygonScan } from "design-system/icon";
import { useRouter } from "app/navigation/use-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { Collection } from "design-system/card/rows/collection";
import { UseBurnNFT, useBurnNFT } from "app/hooks/use-burn-nft";
import { View, Text, Fieldset, Button, Media } from "design-system";

const defaultValues = {
  copies: 1,
};

function Delete({ nftId }: { nftId: number }) {
  const router = useRouter();
  const { user } = useUser();
  const { startBurning, state } = useBurnNFT();
  const handleSubmitForm = (values: Omit<UseBurnNFT, "filePath">) => {
    console.log("** Submiting burning form **", values);
    startBurning({ ...values, tokenId: nft.token_id });
  };

  const { data, error, mutate } = useSWR(`/v2/nft_detail/${nftId}`, (url) =>
    axios({ url, method: "GET" })
  );
  const nft = data?.data as NFT;
  console.log("nft", nft);
  if (error) {
    console.error(error);
  }

  const { data: ownershipData } = useSWR(
    () =>
      nft &&
      user &&
      `/v1/owned_quantity?nft_id=${nft.nft_id}&profile_id=${user.data.profile.profile_id}`,
    (url) => axios({ url, method: "GET" }).then((res) => res?.data)
  );

  const createBurnValidationSchema = useMemo(
    () =>
      yup.object({
        copies: yup
          .number()
          .required()
          .min(1)
          .max(ownershipData?.owned_count ?? 1)
          .default(defaultValues.copies),
      }),
    [ownershipData]
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(createBurnValidationSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues,
  });

  const tabBarHeight = Platform.OS === "android" ? 50 : useBottomTabBarHeight();

  const CreateScrollView =
    Platform.OS === "android" ? BottomSheetScrollView : ScrollView;

  // enable submission only on idle or error state.
  const enable = state.status === "idle" || state.status === "burningError";

  useEffect(() => {
    if (state.status != "burningSuccess") return;

    // @TODO: Maybe we should optimistically decrease edition count?
    mutate(`/v2/nft_detail/${nftId}`);

    // We're popping twice here to also close the NFT page behind this modal
    router.pop();
    router.pop();
  }, [state.status]);

  return (
    <View tw="flex-1">
      <CreateScrollView
        contentContainerStyle={{ paddingBottom: tabBarHeight + 100 }}
      >
        <View tw="px-3 py-4">
          <View tw="mb-4">
            <Text
              variant="text-xl"
              tw="font-bold text-black dark:text-white mb-4"
            >
              Are you sure you want to delete this NFT?
            </Text>
            <Text variant="text-sm" tw="text-black dark:text-white">
              This can’t be undone and it will be sent to a burn address.
            </Text>
          </View>
          <View tw="border-b border-gray-100 dark:border-gray-900 -mx-2">
            <Collection nft={nft} />
          </View>
          <View tw="p-4 flex-row items-center -mx-2">
            <View tw="w-20 h-20 mr-4">
              <Media item={nft} tw="w-20 h-20" />
            </View>
            <View>
              <Text
                variant="text-lg"
                tw="font-medium text-black dark:text-white mb-2"
              >
                {nft?.token_name}
              </Text>
              <View tw="flex-row items-center">
                <PolygonScan
                  width={16}
                  height={16}
                  color={tw.style("text-gray-500").color as string}
                />
                <Text variant="text-xs" tw="ml-1 font-bold text-gray-500">
                  {`Minted ${formatDistanceToNowStrict(
                    new Date(nft?.token_created),
                    {
                      addSuffix: true,
                    }
                  )}`}
                </Text>
              </View>
            </View>
          </View>
          <View tw="-mx-2">
            <Owner nft={nft} price={true} />
          </View>
          <View tw="mt-4 flex-row">
            <Controller
              control={control}
              name="copies"
              render={({ field: { onChange, onBlur, value } }) => {
                return (
                  <Fieldset
                    tw="flex-1 bg-gray-100"
                    label="Copies"
                    placeholder="1"
                    helperText={`1 by default${
                      ownershipData
                        ? `, you own ${ownershipData.owned_count}`
                        : ""
                    }`}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    errorText={errors.copies?.message}
                    value={value?.toString()}
                    onChangeText={onChange}
                    returnKeyType="done"
                  />
                );
              }}
            />
          </View>
        </View>
      </CreateScrollView>
      <View tw="absolute px-4 w-full" style={{ bottom: tabBarHeight + 16 }}>
        <Button
          onPress={handleSubmit(handleSubmitForm)}
          tw="h-12 rounded-full"
          disabled={!enable}
        >
          <Text tw="text-white dark:text-gray-900 text-sm">
            {state.status === "idle"
              ? "Burn"
              : state.status === "burning"
              ? "Burning..."
              : state.status === "burningError"
              ? "Failed. Retry"
              : "Success!"}
          </Text>
        </Button>
      </View>
    </View>
  );
}

export { Delete };
