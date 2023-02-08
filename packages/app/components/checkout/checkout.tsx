import * as React from "react";
import { useState } from "react";

import { CheckoutForm } from "./checkout-form";
import { SelectPlan } from "./select-plan";

export const Checkout = () => {
  const [paymentIntent, setPaymentIntent] = useState(null);

  return paymentIntent ? (
    <CheckoutForm paymentIntent={paymentIntent} />
  ) : (
    <SelectPlan setPaymentIntent={setPaymentIntent} />
  );
};
