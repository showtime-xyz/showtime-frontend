import { useMemo } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

import { PolygonScanButton } from "app/components/polygon-scan-button";
import { useBuyNFT } from "app/hooks/use-buy-nft";

import { Button, Fieldset, Media, Spinner, Text, View } from "design-system";
import { Collection } from "design-system/card/rows/collection";
import { Creator } from "design-system/card/rows/elements/creator";

import { useNFTDetails } from "../hooks/use-nft-details";
import { yup } from "../lib/yup";

const defaultValues = {
  quantity: 1,
};

export const Buy = (props: { nftId: string }) => {
  const { state, buyNFT, grantAllowance, reset } = useBuyNFT();
  const { data: nft } = useNFTDetails(Number(props.nftId));

  const buyValidationSchema = useMemo(() => {
    return yup.object({
      //@ts-ignore
      quantity: yup.number().required().min(1).max(nft?.listing?.quantity),
    });
  }, [nft?.listing?.quantity]);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<any>({
    mode: "onBlur",
    resolver: yupResolver(buyValidationSchema),
    reValidateMode: "onChange",
    defaultValues,
  });

  const onSubmit = (data: typeof defaultValues) => {
    if (nft) buyNFT({ nft, quantity: data.quantity });
  };

  if (!nft || !nft.listing) return null;

  if (
    state.status === "verifyingUserBalance" ||
    state.status === "verifyingAllowance" ||
    state.status === "transactionInitiated" ||
    state.status === "loading"
  ) {
    return (
      <View tw="flex-1 items-center justify-center">
        <Spinner />
        <View tw="items-center">
          <Text
            variant="text-base"
            tw="text-black dark:text-white text-center my-8"
          >
            Your NFT is being purchased on Showtime.
          </Text>
          <PolygonScanButton transactionHash={state.transaction} />
        </View>
      </View>
    );
  }

  if (state.status === "grantingAllowance") {
    return (
      <View tw="flex-1 items-center justify-center">
        <Spinner />
        <View tw="items-center">
          <Text
            variant="text-base"
            tw="text-black dark:text-white text-center my-8"
          >
            Granting allowance...
          </Text>
          <PolygonScanButton transactionHash={state.transaction} />
        </View>
      </View>
    );
  }

  if (state.status === "grantingAllowanceError") {
    return (
      <View tw="flex-1 items-center justify-center">
        <Spinner />
        <View tw="items-center">
          <Text
            variant="text-base"
            tw="text-black dark:text-white text-center my-8"
          >
            Sorry. Granting allowance failed.
          </Text>
          <PolygonScanButton transactionHash={state.transaction} />
        </View>
      </View>
    );
  }

  if (state.status === "noBalance") {
    const quantity = getValues("quantity");

    return (
      <View tw="flex-1 items-center justify-center">
        <Spinner />
        <View tw="items-center">
          <Text
            variant="text-base"
            tw="text-black dark:text-white text-center my-8"
          >
            You don't have enough ${nft.listing.currency} on your wallet.
          </Text>
          <Text>You can</Text>
          <Button onPress={reset}>Go back </Button>
          <Text>, or </Text>
          <Button onPress={() => buyNFT({ nft, quantity: quantity })}>
            try again with a different wallet.
          </Button>
        </View>
      </View>
    );
  }

  if (state.status === "needsAllowance") {
    const quantity = getValues("quantity");
    return (
      <View tw="flex-1 items-center justify-center">
        <View tw="items-center">
          <Text
            variant="text-base"
            tw="text-black dark:text-white text-center my-8"
          >
            To buy this NFT, we need permission to spend your{" "}
            {nft.listing.min_price + " " + nft.listing.currency}.
          </Text>
          <Button onPress={() => grantAllowance({ nft, quantity })}>
            Grant Permission
          </Button>
        </View>
      </View>
    );
  }

  if (state.status === "buyingSuccess") {
    return (
      <View tw="flex-1 items-center justify-center mt-4">
        <Text variant="text-4xl">🎉</Text>
        <View>
          <Text
            variant="text-lg"
            tw="my-8 text-black dark:text-white text-center"
          >
            Your NFT has been purchased!
          </Text>
          <PolygonScanButton transactionHash={state.transaction} />
        </View>
      </View>
    );
  }

  return (
    <View>
      <Collection nft={nft} />
      <View tw="p-4">
        <View tw="flex-row items-center">
          <Media item={nft} tw="h-20 w-20 rounded-2xl" />
          <View tw="ml-4">
            <Text>{nft.token_name}</Text>
          </View>
        </View>

        <View tw="flex-row justify-between mt-8">
          <Creator nft={nft} shouldShowDateCreated={false} />
          <Creator nft={nft} label="Listed by" shouldShowDateCreated={false} />
        </View>

        <View tw="mt-4">
          <Controller
            control={control}
            name="quantity"
            render={({ field: { onChange, onBlur, value } }) => {
              return (
                <Fieldset
                  tw="flex-1"
                  label="Quantity"
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
        <View tw="my-8 flex-row justify-between">
          <Text tw="text-gray-900 dark:text-white font-bold">Total</Text>
          <Text tw="text-gray-900 dark:text-white font-bold">
            {nft?.listing?.min_price === 0
              ? "Free"
              : `${nft.listing.min_price} ${nft.listing.currency}`}
          </Text>
        </View>
        <View tw="mt-4">
          <Button onPress={handleSubmit(onSubmit)}>Confirm purchase</Button>
        </View>
      </View>
    </View>
  );
};
