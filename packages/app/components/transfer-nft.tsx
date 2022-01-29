import { useState } from "react";
import { Platform } from "react-native";
import useUnmountSignal from "use-unmount-signal";
import useSWR from "swr";
import { formatDistanceToNowStrict } from "date-fns";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

import { View, Text, Fieldset, Button, ScrollView } from "design-system";
import { ArrowRight, PolygonScan } from "design-system/icon";
import { tw } from "design-system/tailwind";
import { Image } from "design-system/image";
import { Video } from "design-system/video";
import { Collection } from "design-system/card/rows/collection";
import { Owner } from "design-system/card/rows/owner";
import { axios } from "app/lib/axios";
import { yup } from "app/lib/yup";
import type { NFT } from "app/types";
import { supportedVideoExtensions } from "app/hooks/use-mint-nft";
import { yupResolver } from "@hookform/resolvers/yup";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useForm, Controller } from "react-hook-form";

const defaultValues = {
  copiesCount: 1,
  receiver: "",
};

const transferNFTValidationSchema = yup.object({
  copiesCount: yup
    .number()
    .typeError("must be a number")
    .required()
    .min(1)
    .max(10000)
    .default(defaultValues.copiesCount),
  receiver: yup.string().required().default(defaultValues.receiver),
});

function TransferNft({ nftId }: { nftId?: string }) {
  const [url] = useState(`/v2/nft_detail/${nftId}`);
  const unmountSignal = useUnmountSignal();
  const { data, error } = useSWR([url], (url) =>
    axios({ url, method: "GET", unmountSignal })
  );

  const nft = data?.data as NFT;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(transferNFTValidationSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues,
  });

  if (error) {
    console.error(error);
  }

  if (!nft) return null;

  console.log({ nft });

  const TransferNftScrollView =
    Platform.OS === "android" ? BottomSheetScrollView : ScrollView;

  const tabBarHeight = Platform.OS === "android" ? 0 : useBottomTabBarHeight();
  const fileExtension = nft?.token_img_url.split(".").pop();
  const isVideo =
    fileExtension && supportedVideoExtensions.includes(fileExtension);
  const Preview = isVideo ? Video : Image;

  return (
    <View tw="flex-1">
      <TransferNftScrollView
        contentContainerStyle={{ paddingBottom: tabBarHeight + 80 }}
      >
        <Collection nft={nft} />

        <View tw="p-[16px]">
          <View tw="flex-row items-center pb-4">
            <Preview
              source={{
                uri: nft?.token_img_url,
              }}
              tw="w-[80px] h-[80px] rounded-2xl"
            />
            <View tw="flex-1 px-[16px]">
              <Text
                tw="text-black dark:text-white font-bold pb-4"
                variant="text-lg"
              >
                {nft?.token_name}
              </Text>
              <View tw="flex-row items-center">
                <PolygonScan
                  style={tw.style("overflow-hidden")}
                  color={tw.style("bg-gray-500")?.backgroundColor as string}
                  height={14}
                  width={14}
                />
                <Text tw="text-gray-500 font-bold pl-1" variant="text-xs">
                  Minted
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

          <Owner nft={nft} price={true} tw="px-0" />

          <View tw="mt-4 flex-row">
            <Controller
              control={control}
              name="copiesCount"
              render={({ field: { onChange, onBlur, value } }) => {
                return (
                  <Fieldset
                    tw="flex-1"
                    label="Copies"
                    placeholder="1"
                    helperText="1 by default"
                    onBlur={onBlur}
                    keyboardType="numeric"
                    errorText={errors.copiesCount?.message}
                    value={value?.toString()}
                    onChangeText={onChange}
                    returnKeyType="done"
                  />
                );
              }}
            />
          </View>

          <View tw="mt-4 flex-row">
            <Controller
              control={control}
              name="receiver"
              render={({ field: { onChange, onBlur, value } }) => {
                return (
                  <Fieldset
                    tw="flex-1"
                    label="Receiver"
                    placeholder="eg: @showtime, showtime.eth, 0x..."
                    helperText="Type username, ENS, or Ethereum address"
                    onBlur={onBlur}
                    errorText={errors.receiver?.message}
                    value={value?.toString()}
                    onChangeText={onChange}
                    returnKeyType="done"
                  />
                );
              }}
            />
          </View>
        </View>
      </TransferNftScrollView>
      <View tw="absolute px-4 w-full" style={{ bottom: tabBarHeight + 16 }}>
        <Button onPress={() => {}} tw="h-12 rounded-full">
          <Text tw="text-white dark:text-gray-900 text-sm pr-2">Transfer</Text>
          <ArrowRight
            style={tw.style("rounded-lg overflow-hidden w-6 h-6")}
            color={
              tw.style("bg-white dark:bg-black")?.backgroundColor as string
            }
          />
        </Button>
      </View>
    </View>
  );
}

export { TransferNft };
