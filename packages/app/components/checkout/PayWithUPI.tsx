import { Button } from "@showtime-xyz/universal.button";

export type OnRampInitDataType = {
  merchantId: string;
};

export const PayWithUPI = (props: { onRampInitData: OnRampInitDataType }) => {
  return <Button>Hello world</Button>;
};
