import * as React from "react";

import { createParam } from "app/navigation/use-param";

import { EmptyPlaceholder } from "../empty-placeholder";
import { CheckoutClaimForm } from "./checkout-claim-form";
import { CheckoutForm } from "./checkout-form";
import { SelectPlan } from "./select-plan";

type Query = {
  clientSecret?: string;
};
const { useParam } = createParam<Query>();

export const CheckoutPaidNFT = () => {
  const [clientSecret, setClientSecret] = useParam("clientSecret");
  if (!clientSecret) return <EmptyPlaceholder title="No payment yet" />;
  return <CheckoutClaimForm clientSecret={clientSecret} />;
};
