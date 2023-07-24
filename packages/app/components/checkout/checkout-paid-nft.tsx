import * as React from "react";

import { createParam } from "app/navigation/use-param";

import { EmptyPlaceholder } from "../empty-placeholder";
import { CheckoutClaimForm } from "./checkout-claim-form";
import { CheckoutForm } from "./checkout-form";
import { SelectPlan } from "./select-plan";

type Query = {
  clientSecret?: string;
  contractAddress?: string;
};
const { useParam } = createParam<Query>();

export const CheckoutPaidNFT = () => {
  const [clientSecret] = useParam("clientSecret");
  const [contractAddress] = useParam("contractAddress");

  if (!clientSecret || !contractAddress)
    return <EmptyPlaceholder title="No payment yet" />;
  return (
    <CheckoutClaimForm
      clientSecret={clientSecret}
      contractAddress={contractAddress}
    />
  );
};
