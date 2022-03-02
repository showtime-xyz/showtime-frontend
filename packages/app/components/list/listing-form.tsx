import { useMemo, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useListNFT } from "app/hooks/use-list-nft";
import { CURRENCY_NAMES, LIST_CURRENCIES } from "app/lib/constants";
import { yup } from "app/lib/yup";
import { NFT } from "app/types";
import { findAddressInOwnerList } from "app/utilities";

import { View, Text, Fieldset, Button } from "design-system";
import { useIsDarkMode } from "design-system/hooks";
import { Tag } from "design-system/icon";
import { SelectOption } from "design-system/select/types";
import { tw } from "design-system/tailwind";

type Props = {
  nft?: NFT;
};

const defaultListingValues = {
  price: 0,
  copies: 1,
  currency: CURRENCY_NAMES[LIST_CURRENCIES.WETH],
};

const options: SelectOption[] = Object.entries(CURRENCY_NAMES).map(
  (currency) => {
    const [value, label] = currency;
    return { value, label } as { value: string; label: string };
  }
);

export const ListingForm = (props: Props) => {
  const nft = props.nft;
  const { listNFT, state, dispatch } = useListNFT();
  const isDark = useIsDarkMode();
  const { userAddress: address } = useCurrentUserAddress();
  const [currentCurrency, setCurrentCurrency] = useState<string>(
    defaultListingValues.currency
  );
  const [currentPrice, setCurrentPrice] = useState<number | string>(
    defaultListingValues.price
  );

  const ownerListItem = findAddressInOwnerList(
    address,
    nft?.multiple_owners_list
  );
  const ownedAmount = ownerListItem?.quantity || 1;
  const hideCopiesInput = ownedAmount === 1;
  const copiesHelperText = `1 by default, you own ${ownedAmount}`;

  const createListValidationSchema = useMemo(
    () =>
      yup.object({
        price: yup.number().required().min(0).max(Number.MAX_VALUE),
        currency: yup
          .string()
          .required()
          .default(CURRENCY_NAMES[LIST_CURRENCIES.WETH]),
        copies: yup.number().required().min(1).max(ownedAmount).default(1),
      }),
    []
  );

  const { control, handleSubmit, formState } = useForm<any>({
    resolver: yupResolver(createListValidationSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: defaultListingValues,
  });
  const isValid = formState.isValid;

  const handleSubmitForm = async (values) => {
    listNFT();
  };

  return (
    <View>
      {!hideCopiesInput && (
        <View tw="flex-row">
          <Controller
            control={control}
            name="copies"
            render={({ field: { onChange, onBlur, value } }) => {
              const errorText = formState.errors.copies?.message
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

      <View tw="mt-4 flex-row bg-gray-100 dark:bg-gray-900 rounded-full">
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
              field: { onChange, onBlur, value },
            } = params;

            return (
              <>
                <Fieldset
                  selectOnly={true}
                  tw="p-0 m-0"
                  select={{
                    options,
                    placeholder: "ETH",
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
          disabled={!isValid}
          // dis form on sub
        >
          <Tag
            fill={
              isDark
                ? "none"
                : (tw.style("text-white dark:text-gray-900").color as string)
            }
            width={21}
            height={21}
          />
          <Text tw="text-white dark:text-gray-900 text-sm pl-1">
            List for {currentPrice} {CURRENCY_NAMES[currentCurrency]}
          </Text>
        </Button>
        <View tw="h-12 mt-4">
          {/* {state.status === "minting" && !state.isMagic ? ( */}
          <Button
            onPress={handleSubmit(handleSubmitForm)}
            tw="h-12"
            variant="tertiary"
          >
            <Text tw="text-gray-900 dark:text-white text-sm">
              Didn't receive the signature request yet?
            </Text>
          </Button>
          {/* ) : null} */}
        </View>
      </View>
    </View>
  );
};
