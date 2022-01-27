import { useState } from "react";
import { Platform, Pressable, ScrollView } from "react-native";
import useUnmountSignal from "use-unmount-signal";
import useSWR from "swr";

import { View, Text, Fieldset, Button } from "design-system";
import { ArrowRight } from "design-system/icon";
import { tw } from "design-system/tailwind";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { axios } from "app/lib/axios";
import { useForm, Controller } from "react-hook-form";
import { yup } from "app/lib/yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Collection } from "design-system/card/rows/collection";
import { Owner } from "design-system/card/rows/owner";
import type { NFT } from "app/types";

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
  const [url, setUrl] = useState(`/v2/nft_detail/${nftId}`);
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

  console.log({ nft });

  const tabBarHeight = Platform.OS === "android" ? 50 : useBottomTabBarHeight();

  return (
    <View tw="flex-1">
      <Collection nft={nft} />

      <View tw="h-1 w-full bg-gray-100 dark:bg-gray-900 mb-2" />

      {/* <Social nft={nft} /> */}

      {/* <LikedBy nft={nft} /> */}

      {/* <Title nft={nft} /> */}

      {/* <Description nft={nft} /> */}

      <Owner nft={nft} price={true} />

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

      <Button onPress={() => {}} tw="h-12 rounded-full my-4" disabled={true}>
        <ArrowRight
          style={tw.style("rounded-lg overflow-hidden w-6 h-6")}
          color={tw.style("bg-white dark:bg-black")?.backgroundColor as string}
        />
        <Text tw="text-white dark:text-gray-900 text-sm pl-2">Transfer</Text>
      </Button>
    </View>
  );
}

export { TransferNft };
