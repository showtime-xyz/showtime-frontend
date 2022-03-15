import { useState, useEffect } from "react";
import { Platform, Linking, KeyboardAvoidingView } from "react-native";

import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { yupResolver } from "@hookform/resolvers/yup";
import { formatDistanceToNowStrict } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import useSWR from "swr";
import useUnmountSignal from "use-unmount-signal";

import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { supportedVideoExtensions } from "app/hooks/use-mint-nft";
import { useTransferNFT } from "app/hooks/use-transfer-nft";
import { axios } from "app/lib/axios";
import { yup } from "app/lib/yup";
import type { NFT } from "app/types";

import { View, Text, Fieldset, Button, ScrollView } from "design-system";
import { Collection } from "design-system/card/rows/collection";
import { Owner } from "design-system/card/rows/owner";
import { ArrowRight, PolygonScan, Check } from "design-system/icon";
import { Image } from "design-system/image";
import { Spinner } from "design-system/spinner";
import { tw } from "design-system/tailwind";
import { Video } from "design-system/video";

type FormData = {
  quantity: number;
  receiverAddress: string;
};

function TransferNft({ nftId }: { nftId?: string }) {
  const { startTransfer, state } = useTransferNFT();
  const { userAddress } = useCurrentUserAddress();

  const [url] = useState(`/v2/nft_detail/${nftId}`);
  const [maxQuantity, setMaxQuantity] = useState(0);
  const unmountSignal = useUnmountSignal();
  const { data, error } = useSWR([url], (url) =>
    axios({ url, method: "GET", unmountSignal })
  );

  const nft = data?.data as NFT;

  const defaultValues = {
    quantity: 1,
    receiverAddress: "",
  };

  const transferNFTValidationSchema = yup.object({
    quantity: yup
      .number()
      .typeError("Please enter number of copies")
      .required("required")
      .min(1)
      .max(maxQuantity)
      .default(defaultValues.quantity),
    receiverAddress: yup
      .string()
      .required("Please fill receiver address")
      .default(defaultValues.receiverAddress),
  });

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

  useEffect(() => {
    const owner = nft?.multiple_owners_list?.find(
      (owner) => owner.address === userAddress
    );
    if (owner?.quantity) {
      setMaxQuantity(owner?.quantity);
    }
  }, [nft, userAddress]);

  function handleSubmitTransfer({ quantity, receiverAddress }: FormData) {
    startTransfer({ nft, receiverAddress, quantity });
  }

  function handleOpenPolygonScan() {
    Linking.openURL(
      `https://${
        process.env.NEXT_PUBLIC_CHAIN_ID === "mumbai" ? "mumbai." : ""
      }polygonscan.com/tx/${state.transaction}`
    );
  }

  if (error) {
    console.error(error);
  }

  if (!nft) return null;

  const TransferNftScrollView =
    Platform.OS === "android" ? BottomSheetScrollView : ScrollView;

  const fileExtension = nft?.token_img_url.split(".").pop();
  const isVideo =
    fileExtension && supportedVideoExtensions.includes(fileExtension);
  const Preview = isVideo ? Video : Image;

  if (state.status === "transfering" || state.status === "transferingSuccess") {
    return (
      <View tw="flex-1 justify-center items-center p-4 h-full">
        {state.status === "transfering" ? (
          <Spinner />
        ) : (
          <Check
            style={tw.style("rounded-lg overflow-hidden")}
            color={
              tw.style("bg-black dark:bg-white")?.backgroundColor as string
            }
            width={32}
            height={32}
          />
        )}

        <Text tw="text-center text-black dark:text-white py-8">
          {state.status === "transfering"
            ? `Your NFT is being transferred. Feel free to navigate away from this screen.`
            : "The transaction has been completed!"}
        </Text>
        {state.transaction && (
          <Button onPress={handleOpenPolygonScan} variant="tertiary">
            <PolygonScan
              style={tw.style("rounded-lg overflow-hidden ")}
              color={
                tw.style("bg-black dark:bg-white")?.backgroundColor as string
              }
            />
            <Text tw="text-black dark:text-white text-sm pl-2">
              View on Polygon Scan
            </Text>
          </Button>
        )}
      </View>
    );
  }

  return (
    <View tw="flex-1">
      <KeyboardAvoidingView
        behavior="position"
        enabled={Platform.OS !== "android"}
        keyboardVerticalOffset={90}
      >
        <TransferNftScrollView contentContainerStyle={{ paddingBottom: 80 }}>
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
                name="quantity"
                render={({ field: { onChange, onBlur, value } }) => {
                  return (
                    <Fieldset
                      tw="flex-1"
                      label="Copies"
                      placeholder="1"
                      helperText="1 by default"
                      onBlur={onBlur}
                      keyboardType="numeric"
                      errorText={errors.quantity?.message}
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
                name="receiverAddress"
                render={({ field: { onChange, onBlur, value } }) => {
                  return (
                    <Fieldset
                      tw="flex-1"
                      label="Receiver"
                      placeholder="eg: @showtime, showtime.eth, 0x..."
                      helperText="Type username, ENS, or Ethereum address"
                      onBlur={onBlur}
                      errorText={errors.receiverAddress?.message}
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
        <View tw="absolute px-4 w-full" style={{ bottom: 16 }}>
          <Button
            onPress={handleSubmit(handleSubmitTransfer)}
            tw="h-12 rounded-full"
          >
            <Text tw="text-white dark:text-gray-900 text-sm pr-2">
              Transfer
            </Text>
            <ArrowRight
              style={tw.style("rounded-lg overflow-hidden w-6 h-6")}
              color={
                tw.style("bg-white dark:bg-black")?.backgroundColor as string
              }
            />
          </Button>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

export { TransferNft };
