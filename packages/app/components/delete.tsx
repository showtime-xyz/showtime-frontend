import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import useSWR from "swr";
import { useEffect, useMemo } from "react";
import { Platform, ScrollView } from "react-native";

import { View, Text, Fieldset, Button } from "design-system";
import { UseBurnNFT, useBurnNFT } from "app/hooks/use-burn-nft";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useForm, Controller } from "react-hook-form";
import { yup } from "app/lib/yup";
import { axios } from "app/lib/axios";
import { yupResolver } from "@hookform/resolvers/yup";
import { NFT } from "app/types";
import { useUser } from "../hooks/use-user";

const defaultValues = {
  copies: 1,
};

function Delete({ nftId }: { nftId: number }) {
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
  //#endregion

  const tabBarHeight = Platform.OS === "android" ? 50 : useBottomTabBarHeight();

  const CreateScrollView =
    Platform.OS === "android" ? BottomSheetScrollView : ScrollView;

  // enable submission only on idle or error state.
  const enable = state.status === "idle" || state.status === "burningError";

  return (
    <View tw="flex-1">
      <CreateScrollView
        contentContainerStyle={{ paddingBottom: tabBarHeight + 100 }}
      >
        <View tw="px-3 py-4">
          <View tw="mt-4 flex-row">
            <Controller
              control={control}
              name="copies"
              render={({ field: { onChange, onBlur, value } }) => {
                return (
                  <Fieldset
                    tw="flex-1"
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
