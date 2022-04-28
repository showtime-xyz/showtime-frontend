import { useEffect, useMemo } from "react";
import { Platform, ScrollView } from "react-native";

import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { yupResolver } from "@hookform/resolvers/yup";
import { formatDistanceToNowStrict } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import useSWR from "swr";

import { UseBurnNFT, useBurnNFT } from "app/hooks/use-burn-nft";
import { useUser } from "app/hooks/use-user";
import { axios } from "app/lib/axios";
import { yup } from "app/lib/yup";
import { useRouter } from "app/navigation/use-router";
import type { NFT } from "app/types";

import { Button, Fieldset, Media, Text, View } from "design-system";
import { Owner } from "design-system/card";
import { Collection } from "design-system/card/rows/collection";
import { PolygonScan } from "design-system/icon";
import { tw } from "design-system/tailwind";

const defaultValues = {
  copies: 1,
};

function Delete({ nft }: { nft: NFT }) {
  const router = useRouter();
  const { user } = useUser();
  const { startBurning, state } = useBurnNFT();
  const handleSubmitForm = (values: Omit<UseBurnNFT, "filePath">) => {
    console.log("** Submiting burning form **", values);
    startBurning({ ...values, tokenId: nft.token_id });
  };

  const { data: ownershipData } = useSWR(
    () =>
      nft &&
      user &&
      `/v1/owned_quantity?nft_id=${nft.nft_id}&profile_id=${user.data.profile.profile_id}`,
    (url) => axios({ url, method: "GET" }).then((res) => res?.data)
  );

  const ownsMultiple = ownershipData?.owned_count > 1;

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

  const CreateScrollView =
    Platform.OS === "android" ? BottomSheetScrollView : ScrollView;

  // enable submission only on idle or error state.
  const enable = state.status === "idle" || state.status === "burningError";

  useEffect(() => {
    if (state.status != "burningSuccess") return;

    // TODO: optimistically decrease edition count?

    // We're popping twice here to also close the NFT page behind this modal
    // For web, we just pop it once
    if (Platform.OS === "web") {
      router.pop();
    } else {
      router.pop();
      router.pop();
    }
  }, [state.status]);

  return (
    <View tw="flex-1">
      <CreateScrollView>
        <View tw="flex-1 px-3 py-4">
          <View tw="mb-4">
            <Text
              variant="text-xl"
              tw="mb-4 font-bold text-black dark:text-white"
            >
              Are you sure you want to delete this NFT?
            </Text>
            <Text variant="text-sm" tw="text-black dark:text-white">
              This can’t be undone and it will be sent to a burn address.
            </Text>
          </View>
          <View tw="-mx-2 border-b border-gray-100 dark:border-gray-900">
            <Collection nft={nft} />
          </View>
          <View tw="-mx-2 flex-row items-center p-4">
            <View tw="mr-4 h-20 w-20">
              <Media item={nft} tw="h-20 w-20" />
            </View>
            <View>
              <Text
                variant="text-lg"
                tw="mb-2 font-medium text-black dark:text-white"
              >
                {nft?.token_name}
              </Text>
              <View tw="flex-row items-center">
                <PolygonScan
                  width={16}
                  height={16}
                  color={tw.style("text-gray-500").color as string}
                />
                {nft?.token_created ? (
                  <Text variant="text-xs" tw="ml-1 font-bold text-gray-500">
                    {`Minted ${formatDistanceToNowStrict(
                      new Date(nft?.token_created),
                      {
                        addSuffix: true,
                      }
                    )}`}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
          <View tw="-mx-2">
            <Owner nft={nft} price={true} />
          </View>
          {ownsMultiple ? (
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
          ) : null}
        </View>
      </CreateScrollView>
      <View tw="w-full p-4">
        <Button
          onPress={handleSubmit(handleSubmitForm)}
          tw="h-12 rounded-full"
          disabled={!enable}
        >
          <Text tw="text-sm text-white dark:text-gray-900">
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
