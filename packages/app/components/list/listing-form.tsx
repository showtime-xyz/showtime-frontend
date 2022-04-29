import { useEffect, useMemo, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { ListingValues, ListNFT } from "app/hooks/use-list-nft";
import { useUser } from "app/hooks/use-user";
import { useWeb3 } from "app/hooks/use-web3";
import { LIST_CURRENCIES } from "app/lib/constants";
import { yup } from "app/lib/yup";
import { useRouter } from "app/navigation/use-router";
import { NFT } from "app/types";
import { findAddressInOwnerList } from "app/utilities";

import { Button, Fieldset, Text, View } from "design-system";
import { useIsDarkMode } from "design-system/hooks";
import { Tag } from "design-system/icon";
import { SelectOption } from "design-system/select/types";
import { tw } from "design-system/tailwind";

const LISTING_SUPPORTED_CURRENCIES = {
  mumbai: {
    [LIST_CURRENCIES?.TKN]: "TKN",
    [LIST_CURRENCIES?.USDC]: "USDC",
    [LIST_CURRENCIES?.WETH]: "WETH",
    [LIST_CURRENCIES?.DAI]: "DAI",
  },
  polygon: {
    [LIST_CURRENCIES?.USDC]: "USDC",
    [LIST_CURRENCIES?.WETH]: "WETH",
    [LIST_CURRENCIES?.DAI]: "DAI",
  },
}[process.env.NEXT_PUBLIC_CHAIN_ID];

type Props = {
  nft?: NFT;
  listNFT: any;
  listState: ListNFT;
};

type StatusMapping = Exclude<ListNFT["status"], "idle">;

type StatusCopyMapping = {
  [Property in StatusMapping]: string;
};

const statusCopyMapping: StatusCopyMapping = {
  approvalChecking: "Approving Listing...",
  approvalRequesting: "Requesting listing approval...",
  approvalError: "Listing approval denied. Please try again.",
  approvalSuccess: "Successfully approved",
  listing: "Listing your NFT...",
  listingError: "Can't list your NFT. Please try again.",
  listingSuccess: "Success! Your NFT is on sale. Redirecting...",
  transactionInitiated: "Transaction initiated...",
};

const defaultCurrency = "WETH";

const defaultListingValues = {
  price: 0,
  editions: 1,
  currency: defaultCurrency,
};

const options: SelectOption[] = Object.entries(
  LISTING_SUPPORTED_CURRENCIES
).map((currency) => {
  const [value, label] = currency;
  return { value, label } as { value: string; label: string };
});

export const ListingForm = (props: Props) => {
  const { nft, listNFT, listState: state } = props;
  const router = useRouter();
  const isDark = useIsDarkMode();
  const { web3 } = useWeb3();
  const { user } = useUser();
  const { userAddress: address } = useCurrentUserAddress();
  const [currentCurrencyAddress, setCurrentCurrency] = useState<string>(
    LIST_CURRENCIES[defaultListingValues.currency]
  );
  const [currentPrice, setCurrentPrice] = useState<number | string>(
    defaultListingValues.price
  );
  const ownerListItem = findAddressInOwnerList(
    address,
    user?.data.profile.wallet_addresses_v2,
    nft?.multiple_owners_list
  );

  const ownedAmount = ownerListItem?.quantity || 1;
  const hideCopiesInput = ownedAmount === 1;
  const copiesHelperText = `1 by default, you own ${ownedAmount}`;
  const currencySymbol = LISTING_SUPPORTED_CURRENCIES[currentCurrencyAddress];
  const isNotMagic = !web3;

  useEffect(() => {
    if (state.status === "listingSuccess") {
      setTimeout(() => {
        router.pop();
        router.push(`/@${user?.data?.profile?.username ?? address}`);
      }, 1000);
    }
  }, [state.status, user, address]);

  const createListValidationSchema = useMemo(
    () =>
      yup.object({
        price: yup.number().required().min(0).max(Number.MAX_VALUE),
        currency: yup
          .string()
          .required()
          .default(LIST_CURRENCIES[defaultListingValues.currency]),
        editions: yup.number().required().min(1).max(ownedAmount).default(1),
      }),
    [ownedAmount]
  );

  const { control, handleSubmit, formState } = useForm<any>({
    resolver: yupResolver(createListValidationSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: defaultListingValues,
  });

  const isValidForm =
    formState.isValid &&
    (state.status === "idle" ||
      state.status === "listingError" ||
      state.status === "approvalError");

  const deriveCTACopy = () => {
    const displayFreeListingCopy =
      state.status === "idle" && currentPrice === 0;

    if (displayFreeListingCopy) {
      return "Free";
    }

    // Typescript won't guard properly if extracted into a variable
    if (state.status !== "idle") {
      return statusCopyMapping[state.status];
    }

    return `List for ${currentPrice} ${currencySymbol}`;
  };

  const ctaCopy = deriveCTACopy();

  const showSigningOption =
    (state.status === "listing" || state.status === "approvalRequesting") &&
    isNotMagic;

  const handleSubmitForm = async (values: ListingValues) => {
    const currencyAddress =
      values.currency === defaultCurrency
        ? LIST_CURRENCIES[defaultCurrency]
        : values.currency;
    //@ts-ignore
    listNFT({ ...values, currency: currencyAddress, nftId: nft?.token_id });
  };

  return (
    <View>
      {!hideCopiesInput && (
        <View tw="flex-row">
          <Controller
            control={control}
            name="editions"
            render={({ field: { onChange, onBlur, value } }) => {
              const errorText = formState.errors.editions?.message
                ? `Copies amount must be between 1 and ${ownedAmount}`
                : undefined;
              return (
                <Fieldset
                  tw="flex-1 bg-gray-100"
                  label="Copies"
                  placeholder="1"
                  helperText={copiesHelperText}
                  onBlur={onBlur}
                  keyboardType="numeric"
                  errorText={errorText}
                  value={value?.toString()}
                  onChangeText={(v) => onChange(v)}
                  returnKeyType="done"
                />
              );
            }}
          />
        </View>
      )}

      <View tw="mt-4 flex-row rounded-full bg-gray-100 dark:bg-gray-900">
        <Controller
          control={control}
          name="price"
          render={(params) => {
            const {
              field: { onChange, onBlur, value },
            } = params;
            const errorText = formState.errors.price?.message
              ? "Price is incorrect"
              : undefined;
            return (
              <Fieldset
                tw="flex-1 "
                label="Price"
                placeholder="Amount"
                helperText="Required"
                onBlur={onBlur}
                keyboardType="numeric"
                value={value?.toString()}
                errorText={errorText}
                onChangeText={(v) => {
                  onChange(v);
                  setCurrentPrice(v);
                }}
                returnKeyType="done"
              />
            );
          }}
        />
        <Controller
          control={control}
          name="currency"
          render={(params) => {
            const {
              field: { onChange, value },
            } = params;

            return (
              <>
                <Fieldset
                  selectOnly={true}
                  tw="m-0 p-0"
                  select={{
                    options,
                    placeholder: defaultCurrency,
                    value,
                    size: "regular",
                    onChange: (v) => {
                      onChange(v);
                      setCurrentCurrency(v);
                    },
                  }}
                />
              </>
            );
          }}
        />
      </View>

      <View tw="p-4">
        <Button
          onPress={handleSubmit(handleSubmitForm)}
          tw="h-12 rounded-full"
          variant="primary"
          disabled={!isValidForm}
        >
          {state.status === "idle" ? (
            <>
              <Tag
                fill={
                  isDark
                    ? "none"
                    : (tw.style("text-white dark:text-gray-900")
                        .color as string)
                }
                width={21}
                height={21}
              />
              <Text tw="pl-1 text-sm text-white dark:text-gray-900">
                {ctaCopy}
              </Text>
            </>
          ) : (
            <Text tw="pl-1 text-sm text-white dark:text-gray-900">
              {ctaCopy}
            </Text>
          )}
        </Button>
        <View tw="mt-4 h-12">
          {showSigningOption ? (
            <Button
              onPress={handleSubmit(handleSubmitForm)}
              tw="h-12"
              variant="tertiary"
            >
              <Text tw="text-sm text-gray-900 dark:text-white">
                Didn't receive the signature request yet?
              </Text>
            </Button>
          ) : null}
        </View>
      </View>
    </View>
  );
};
