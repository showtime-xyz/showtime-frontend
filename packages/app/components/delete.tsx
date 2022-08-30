import { useMemo } from "react";
import { Platform, ScrollView } from "react-native";

import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { yupResolver } from "@hookform/resolvers/yup";
import { formatDistanceToNowStrict } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import useSWR from "swr";

import { useAlert } from "@showtime-xyz/universal.alert";
import { Button } from "@showtime-xyz/universal.button";
import { Fieldset } from "@showtime-xyz/universal.fieldset";
import { PolygonScan } from "@showtime-xyz/universal.icon";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { tw } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { ConnectButton } from "app/components//connect-button";
import { Owner } from "app/components/card";
import { Media } from "app/components/media";
import { UseBurnNFT, useBurnNFT } from "app/hooks/use-burn-nft";
import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useUser } from "app/hooks/use-user";
import { useWallet } from "app/hooks/use-wallet";
import { axios } from "app/lib/axios";
import { yup } from "app/lib/yup";
import type { NFT } from "app/types";

import { PolygonScanButton } from "./polygon-scan-button";

const defaultValues = {
  copies: 1,
};

function Delete({ nft }: { nft: NFT }) {
  const { user } = useUser();
  const { startBurning, state } = useBurnNFT();
  const { userAddress } = useCurrentUserAddress();
  const { alert } = useAlert();
  const { connected } = useWallet();

  const handleSubmitForm = (values: Omit<UseBurnNFT, "filePath">) => {
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

  // TODO: remove this after imperative login modal API in rainbowkit
  if (!connected) {
    return (
      <View tw="p-4">
        <ConnectButton
          handleSubmitWallet={({ onOpenConnectModal }) => onOpenConnectModal()}
        />
      </View>
    );
  }

  if (state.status === "transactionInitiated") {
    return (
      <View tw="flex-1 items-center justify-center pb-8">
        <Spinner />
        <View tw="items-center">
          <View tw="h-8" />
          <Text tw="text-center text-base text-black dark:text-white">
            Your NFT is being deleted. Feel free to navigate away from this
            screen.
          </Text>
          <View tw="h-8" />
          <PolygonScanButton transactionHash={state.transaction} />
        </View>
      </View>
    );
  }

  if (state.status === "burningError") {
    return (
      <View tw="flex-1 items-center justify-center pb-8">
        <Spinner />
        <View tw="items-center">
          <View tw="h-8" />
          <Text tw="text-center text-base text-black dark:text-white">
            Something went wrong!
          </Text>
          <View tw="h-8" />
          <Button onPress={handleSubmit(handleSubmitForm)}>Retry</Button>
        </View>
      </View>
    );
  }

  if (state.status === "burningSuccess") {
    return (
      <View tw="mt-4 flex-1 items-center justify-center pb-8">
        <View>
          <View tw="my-8">
            <Text tw="font-space-bold text-center text-lg text-black dark:text-white">
              Your NFT has been deleted
            </Text>
          </View>
          <PolygonScanButton transactionHash={state.transaction} />
        </View>
      </View>
    );
  }

  const handleBurnNFT = (e: any) => {
    if (nft?.owner_address_nonens !== userAddress) {
      alert(
        "Switch Wallet",
        "Please log in with the wallet that owns this NFT."
      );
    } else {
      handleSubmit(handleSubmitForm)(e);
    }
  };

  return (
    <View tw="flex-1">
      <CreateScrollView>
        <View tw="flex-1 px-3 py-4">
          <View tw="mb-4 px-2">
            <Text tw="text-xl font-bold text-black dark:text-white">
              Are you sure you want to delete this NFT?
            </Text>
            <View tw="h-4" />
            <Text tw="text-sm text-gray-600 dark:text-gray-400">
              This can't be undone and it will be sent to a burn address.
            </Text>
          </View>
          <View tw="-mx-2 flex-row items-center p-4">
            <View tw="mr-4 h-20 w-20">
              <Media item={nft} tw="h-20 w-20" />
            </View>
            <View>
              <Text tw="font-space-bold mb-2 text-lg font-medium text-black dark:text-white">
                {nft?.token_name}
              </Text>
              <View tw="mt-2 flex-row items-center">
                <PolygonScan
                  width={16}
                  height={16}
                  color={tw.style("text-gray-500").color as string}
                />
                {nft?.token_created ? (
                  <Text tw="ml-1 text-xs font-bold text-gray-500">
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
          onPress={handleBurnNFT}
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
