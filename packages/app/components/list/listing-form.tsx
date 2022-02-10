import { View, Text, Fieldset, Button, ButtonLabel } from "design-system";
import { useEffect, useMemo, useState, useRef } from "react";
import { NFT, OwnersListOwner } from "app/types";
import { useForm, Controller } from "react-hook-form";
import { yup } from "app/lib/yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Tag } from "design-system/icon";
import { useIsDarkMode } from "design-system/hooks";
import { tw } from "design-system/tailwind";

type Props = {
  nft?: NFT;
  ownedAmount: number;
};

type UnableToListProps = {
  isOwner?: boolean;
  ownerList?: OwnersListOwner[];
};

const defaultListingValues = {
  price: 0,
  copies: 1,
  currency: "ETH",
};

export const UnableToList = (props: UnableToListProps) => {
  const isOwner = props.isOwner;
  const ownerList = props.ownerList ?? [];
  const tryAgainCopy = `Try again from ${
    ownerList.length > 1 ? "one of these addresses " : "this address "
  }`;

  return (
    <View tw="mt-8">
      <Text tw="text-black dark:text-white mb-2">
        The current address you are using does not own an edition of this NFT.
      </Text>
      {isOwner ? (
        <View tw="mt-8">
          <Text tw="font-medium text-black dark:text-white mb-4">
            {tryAgainCopy}
          </Text>

          {ownerList.map((ownerListItem) => (
            <Text
              tw="font-medium text-black dark:text-white mb-2"
              key={`${ownerListItem.address}`}
            >
              {ownerListItem.address}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
};

export const ListingForm = (props: Props) => {
  const nft = props.nft;
  const ownedAmount = props.ownedAmount;
  const copiesHelperText = `1 by default ${
    nft ? `, you own ${ownedAmount}` : ""
  }`;

  const [currentPrice, setCurrentPrice] = useState<number | string>(
    defaultListingValues.price
  );
  const [currentCurrency, setCurrentCurrency] = useState<string>(
    defaultListingValues.currency
  );

  const isDark = useIsDarkMode();

  // const handleSubmitForm = (values, "filePath") => {
  //   console.log("** Submiting burning form **", values);
  //   startBurning({ ...values, tokenId: nft?.token_id });
  // };

  const createPriceValidationSchema = useMemo(
    () =>
      yup.object({
        price: yup.number().required().min(0).max(Number.MAX_VALUE),
        currency: yup.string().required().default("ETH"),
        copies: yup.number().required().min(1).max(ownedAmount).default(1),
      }),
    []
  );

  const { control, handleSubmit, formState } = useForm<any>({
    resolver: yupResolver(createPriceValidationSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: defaultListingValues,
  });

  const isValid = formState.isValid;

  return (
    <View>
      <View tw="mt-4 flex-row">
        <Controller
          control={control}
          name="copies"
          render={({ field: { onChange, onBlur, value } }) => {
            const errorText = formState.errors.copies?.message
              ? formState.errors.copies?.message
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
              <Fieldset
                selectOnly={true}
                select={{
                  options: [
                    { label: "ETH", value: "ETH" },
                    { label: "DAI", value: "DAI" },
                  ],
                  placeholder: "ETH",
                  value,
                  size: "regular",
                  onChange: (v) => {
                    onChange(v);
                    setCurrentCurrency(v);
                  },
                }}
              />
            );
          }}
        />
      </View>
      <View tw="p-4 w-full">
        <Button
          // onPress={handleSubmit(handleSubmitForm)}
          tw="h-12 rounded-full"
          variant="primary"
          disabled={!isValid}
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
            List for {currentPrice} {currentCurrency}
          </Text>
        </Button>
      </View>
    </View>
  );
};
