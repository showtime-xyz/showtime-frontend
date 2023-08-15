import { useCallback, useState, useRef } from "react";

import { Alert } from "@showtime-xyz/universal.alert";
import { Button } from "@showtime-xyz/universal.button";
import { useEffectOnce } from "@showtime-xyz/universal.hooks";
import { useRouter } from "@showtime-xyz/universal.router";
import Spinner from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { axios } from "app/lib/axios";
import { createParam } from "app/navigation/use-param";

import { EmptyPlaceholder } from "../empty-placeholder";
import { CheckoutClaimForm } from "./checkout-claim-form";

type Query = {
  editionId?: string;
  contractAddress?: string;
};
const { useParam } = createParam<Query>();

export const CheckoutPaidNFT = () => {
  const [editionId] = useParam("editionId");
  const [contractAddress] = useParam("contractAddress");
  const [clientSecret, setClientSecret] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const getClaimPaymentsIntent = useCallback(async () => {
    await axios({
      method: "POST",
      url: "/v1/payments/nft/claim/start",
      data: {
        edition_id: editionId,
        use_default_payment_method: false,
        set_payment_method_as_default: true,
      },
    })
      .then((res) => {
        setClientSecret(res?.client_secret);
        setIsLoading(false);
      })
      .catch(async (error) => {
        if (error?.response?.data?.error?.code === 400) {
          await axios({
            method: "POST",
            url: "/v1/payments/nft/claim/resume",
          })
            .then((res) => {
              setClientSecret(res?.client_secret);
            })
            .catch((err) => {
              Alert.alert(
                "Oops, An error occurred.",
                err?.response?.data?.error?.message
              );
              setErrorMsg(err?.response?.data?.error.message);
            });
        } else if (error?.response?.data?.error?.code === 409) {
          // Begin claiming if user has already paid
          router.push(
            {
              pathname: router.pathname,
              query: {
                ...router.query,
                contractAddress,
                checkoutReturnForPaidNFTModal: true,
              },
            },
            router.asPath,
            {
              shallow: true,
            }
          );
        } else {
          Alert.alert(
            "Oops, An error occurred.",
            error?.response?.data?.error?.message
          );
          setErrorMsg(error?.response?.data?.error?.message);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [editionId, router, contractAddress]);

  useEffectOnce(() => {
    getClaimPaymentsIntent();
  });

  if (isLoading) {
    return (
      <View tw="min-h-[296px] flex-1 items-center justify-center">
        <Spinner />
      </View>
    );
  }
  if (errorMsg) {
    return (
      <View tw="min-h-[200px] flex-1 items-center justify-center px-8">
        <Text
          tw={`text-center text-lg font-extrabold leading-6 text-gray-900 dark:text-gray-100`}
        >
          {errorMsg}
        </Text>
        <Button
          tw="mt-4"
          onPress={() => {
            router.pop();
          }}
        >
          Got it.
        </Button>
      </View>
    );
  }

  if (!clientSecret || !contractAddress) {
    return <EmptyPlaceholder tw="min-h-[296px]" title="No payment yet" />;
  }
  return (
    <CheckoutClaimForm
      clientSecret={clientSecret}
      contractAddress={contractAddress}
    />
  );
};
