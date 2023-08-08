import { useCallback, useState, useEffect } from "react";

import Spinner from "@showtime-xyz/universal.spinner";
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
          }).then((res) => {
            setClientSecret(res?.client_secret);
          });
        }
        setIsLoading(false);
      });
  }, [editionId]);
  useEffect(() => {
    getClaimPaymentsIntent();
  }, [getClaimPaymentsIntent]);
  if (isLoading) {
    return (
      <View tw="min-h-[296px] flex-1 items-center justify-center">
        <Spinner />
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
