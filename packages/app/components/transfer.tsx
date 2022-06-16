import { Platform } from "react-native";

import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { yupResolver } from "@hookform/resolvers/yup";
import { formatDistanceToNowStrict } from "date-fns";
import { ethers } from "ethers";
import { Controller, useForm } from "react-hook-form";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { Button } from "@showtime-xyz/universal.button";
import { Fieldset } from "@showtime-xyz/universal.fieldset";
import { ArrowRight, PolygonScan } from "@showtime-xyz/universal.icon";
import { ScrollView } from "@showtime-xyz/universal.scroll-view";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { tw } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { Collection } from "app/components/card/rows/collection";
import { Owner } from "app/components/card/rows/owner";
import { Media } from "app/components/media";
import { useUserProfile } from "app/hooks/api-hooks";
import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import useDebounce from "app/hooks/use-debounce";
import { useTransferNFT } from "app/hooks/use-transfer-nft";
import { useUser } from "app/hooks/use-user";
import { yup } from "app/lib/yup";
import type { NFT } from "app/types";
import { findAddressInOwnerList } from "app/utilities";

import { PolygonScanButton } from "./polygon-scan-button";

type FormData = {
  quantity: number;
  receiverAddress: string;
};

function Transfer({ nft }: { nft?: NFT }) {
  const { startTransfer, state } = useTransferNFT();
  const { userAddress } = useCurrentUserAddress();
  const { user } = useUser();

  const ownerListItem = findAddressInOwnerList(
    userAddress,
    user?.data.profile.wallet_addresses_v2,
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

  if (!nft) return null;

  const TransferNftScrollView =
    Platform.OS === "android" ? BottomSheetScrollView : ScrollView;

  // enable submission only on idle or error state.
  const enable = state.status === "idle" || state.status === "transferingError";

  if (state.status === "transactionInitiated") {
    return (
      <View tw="flex-1 items-center justify-center p-8">
        <Spinner />
        <View tw="items-center">
          <View tw="h-8" />
          <Text tw="text-center text-base text-black dark:text-white">
            Your NFT is being transferred. Feel free to navigate away from this
            screen.
          </Text>
          <View tw="h-8" />
          <PolygonScanButton transactionHash={state.transaction} />
        </View>
      </View>
    );
  }

  if (state.status === "transferingError") {
    return (
      <View tw="flex-1 items-center justify-center pb-8">
        <Spinner />
        <View tw="items-center">
          <View tw="h-8" />
          <Text tw="text-center text-base text-black dark:text-white">
            Something went wrong!
          </Text>
          <View tw="h-8" />
          <Button onPress={handleSubmit(handleSubmitTransfer)}>Retry</Button>
        </View>
      </View>
    );
  }

  if (state.status === "transferingSuccess") {
    return (
      <View tw="mt-4 flex-1 items-center justify-center pb-8">
        <Text tw="text-4xl">🎉</Text>
        <View>
          <View tw="my-8">
            <Text tw="font-space-bold text-center text-lg text-black dark:text-white">
              Your NFT has been transferred
            </Text>
          </View>
          <PolygonScanButton transactionHash={state.transaction} />
        </View>
      </View>
    );
  }

  return (
    <View tw="flex-1">
      <TransferNftScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <Collection nft={nft} />

        <View tw="p-[16px]">
          <View tw="flex-row items-center pb-4">
            <Media item={nft} tw="h-[80px] w-[80px] rounded-2xl" />
            <View tw="flex-1 px-[16px]">
              <Text tw="font-space-bold pb-4 text-lg font-bold text-black dark:text-white">
                {nft?.token_name}
              </Text>
              <View tw="flex-row items-center">
                <PolygonScan
                  style={tw.style("overflow-hidden")}
                  color={tw.style("bg-gray-500")?.backgroundColor as string}
                  height={14}
                  width={14}
                />
                <Text tw="pl-1 text-xs font-bold text-gray-500">
                  {nft?.token_created
                    ? `Minted ${formatDistanceToNowStrict(
                        new Date(nft?.token_created),
                        {
                          addSuffix: true,
                        }
                      )}`
                    : null}
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
            <View tw="mt-4 flex-row items-center rounded-lg bg-white p-4 shadow-lg dark:bg-black">
              <Avatar url={data?.data.profile.img_url} />
              <View tw="ml-1 justify-around">
                {data?.data.profile.name ? (
                  <Text tw="text-xs font-semibold text-gray-600 dark:text-gray-400">
                    {data?.data.profile.name}
                  </Text>
                ) : null}

                <View tw="mt-1 flex-row items-center">
                  <Text tw="text-13 font-semibold text-black dark:text-white">
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

        <View tw="absolute w-full px-4" style={{ bottom: 16 }}>
          <Button
            onPress={handleSubmit(handleSubmitTransfer)}
            disabled={!enable}
            tw={`h-12 rounded-full ${!enable ? "opacity-60" : ""}`}
          >
            <Text tw="pr-2 text-sm text-white dark:text-gray-900">
              {state.status === "idle"
                ? "Transfer"
                : state.status === "transfering"
                ? "Transferring..."
                : state.status === "transferingError"
                ? "Failed. Retry"
                : "Success!"}
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
