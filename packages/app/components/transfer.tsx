import { Linking, Platform } from "react-native";

import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { yupResolver } from "@hookform/resolvers/yup";
import { formatDistanceToNowStrict } from "date-fns";
import { ethers } from "ethers";
import { Controller, useForm } from "react-hook-form";

import { useUserProfile } from "app/hooks/api-hooks";
import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import useDebounce from "app/hooks/use-debounce";
import { useNFTDetails } from "app/hooks/use-nft-details";
import { useTransferNFT } from "app/hooks/use-transfer-nft";
import { yup } from "app/lib/yup";
import { findAddressInOwnerList, getPolygonScanLink } from "app/utilities";

import {
  Button,
  Fieldset,
  Media,
  ScrollView,
  Text,
  VerificationBadge,
  View,
} from "design-system";
import { Avatar } from "design-system/avatar";
import { Collection } from "design-system/card/rows/collection";
import { Owner } from "design-system/card/rows/owner";
import { ArrowRight, PolygonScan } from "design-system/icon";
import { Spinner } from "design-system/spinner";
import { tw } from "design-system/tailwind";

type FormData = {
  quantity: number;
  receiverAddress: string;
};

function Transfer({ nftId }: { nftId?: string }) {
  const { startTransfer, state } = useTransferNFT();
  const { userAddress } = useCurrentUserAddress();

  const { data: nft, error, loading } = useNFTDetails(Number(nftId));

  const ownerListItem = findAddressInOwnerList(
    userAddress,
    nft?.multiple_owners_list
  );

  const maxQuantity = ownerListItem?.quantity || 1;
  const hideCopiesInput = maxQuantity === 1;
  const copiesHelperText = `1 by default, you own ${maxQuantity}`;

  const defaultValues = {
    quantity: 1,
    receiverAddress: "",
  };

  const transferNFTValidationSchema = yup.object({
    quantity: yup
      .number()
      .typeError("Must be a number")
      .required("Please enter number of copies")
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
    watch,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(transferNFTValidationSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues,
  });

  const watchReceiverAddress = watch("receiverAddress");

  const debouncedTransferAddress = useDebounce(watchReceiverAddress, 400);

  const { data } = useUserProfile({ address: debouncedTransferAddress });

  async function handleSubmitTransfer({ quantity, receiverAddress }: FormData) {
    // TODO: move address resolver to a hook?
    let address: string | undefined;
    // probably ens address. ENS address should be obtained only from eth mainnet
    if (receiverAddress.includes(".")) {
      const provider = new ethers.providers.InfuraProvider(
        null,
        process.env.NEXT_PUBLIC_INFURA_ID
      );
      address = await provider.resolveName(receiverAddress);
    }
    // hex address
    else if (receiverAddress.startsWith("0x")) {
      address = receiverAddress;
    }
    // showtime username
    else {
      address = data?.data.profile.wallet_addresses_v2[0].address;
    }

    if (nft && address) {
      startTransfer({ nft, receiverAddress: address, quantity });
    }
  }

  function handleOpenPolygonScan() {
    Linking.openURL(getPolygonScanLink(state.transaction));
  }

  if (error) {
    console.error(error);
  }

  if (loading)
    return (
      <View tw="flex-1 items-center justify-center">
        <Spinner />
      </View>
    );

  if (!nft) return null;

  const TransferNftScrollView =
    Platform.OS === "android" ? BottomSheetScrollView : ScrollView;

  if (state.status === "transfering" || state.status === "transferingSuccess") {
    return (
      <View tw="flex-1 justify-center items-center p-4 h-full">
        {state.status === "transfering" ? (
          <Spinner />
        ) : (
          <Text variant="text-4xl">🎉</Text>
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
      <TransferNftScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <Collection nft={nft} />

        <View tw="p-[16px]">
          <View tw="flex-row items-center pb-4">
            <Media item={nft} tw="w-[80px] h-[80px] rounded-2xl" />
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

          {!hideCopiesInput && (
            <View tw="mt-4 flex-row">
              <Controller
                control={control}
                name="quantity"
                render={({ field: { onChange, onBlur, value } }) => {
                  const errorText = errors.quantity?.message
                    ? `Copies amount must be between 1 and ${maxQuantity}`
                    : undefined;
                  return (
                    <Fieldset
                      tw="flex-1"
                      label="Copies"
                      placeholder="1"
                      helperText={copiesHelperText}
                      onBlur={onBlur}
                      keyboardType="numeric"
                      errorText={errorText}
                      value={value?.toString()}
                      onChangeText={onChange}
                      returnKeyType="done"
                    />
                  );
                }}
              />
            </View>
          )}

          <View tw="mt-4 flex-row">
            <Controller
              control={control}
              name="receiverAddress"
              render={({ field: { onChange, onBlur, value } }) => {
                return (
                  <Fieldset
                    tw="flex-1"
                    label="Receiver"
                    placeholder="eg: showtime, showtime.eth, 0x..."
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
          {data?.data.profile && watchReceiverAddress ? (
            <View tw="mt-4 flex-row items-center bg-white dark:bg-black shadow-lg rounded-lg p-4">
              <Avatar url={data?.data.profile.img_url} />
              <View tw="justify-around ml-1">
                <Text
                  variant="text-xs"
                  tw="text-gray-600  font-semibold dark:text-gray-400"
                >
                  {data?.data.profile.name}
                </Text>
                <View tw="flex-row mt-1 items-center">
                  <Text
                    tw="dark:text-white text-black font-semibold"
                    variant="text-13"
                  >
                    @{data?.data.profile.username}
                  </Text>
                  {data?.data.profile.verified ? (
                    <View tw="ml-1">
                      <VerificationBadge size={12} />
                    </View>
                  ) : null}
                </View>
              </View>
              <View tw="ml-auto">
                <Button
                  variant="tertiary"
                  onPress={() => {
                    setValue("receiverAddress", "");
                  }}
                >
                  Remove
                </Button>
              </View>
            </View>
          ) : null}
        </View>

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
      </TransferNftScrollView>
    </View>
  );
}

export { Transfer };
