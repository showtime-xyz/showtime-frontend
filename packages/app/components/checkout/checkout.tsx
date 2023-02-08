import * as React from "react";
import { useState } from "react";

import { CheckoutForm } from "./checkout-form";
import { SelectPlan } from "./select-plan";

export const Checkout = () => {
  const [clientSecret, setClientSecret] = useState(null);

  return clientSecret ? (
    <CheckoutForm clientSecret={clientSecret} />
  ) : (
    <SelectPlan setClientSecret={setClientSecret} />
  );
};
