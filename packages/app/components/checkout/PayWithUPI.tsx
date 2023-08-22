import { OnrampWebSDK } from "@onramp.money/onramp-web-sdk";

import { Button } from "@showtime-xyz/universal.button";
import { Image } from "@showtime-xyz/universal.image";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

export type OnRampInitDataType = {
  merchantId: string;
  appId: number;
};

export const PayWithUPI = (props: { onRampInitData: OnRampInitDataType }) => {
  const handleSubmit = () => {
    const onrampInstance = new OnrampWebSDK({
      appId: 2,
      walletAddress: "0x8193f4B7A12076A6b9B6Ab76Aa827106696dA8D1",
      flowType: 1,
      fiatType: 1,
      paymentMethod: 1,
      fiatAmount: 1002,
    });

    onrampInstance.show();

    onrampInstance.on("TX_EVENTS", (e) => {
      console.log("onrampInstance TX_EVENTS", e);
      if (e.type === "ONRAMP_WIDGET_TX_COMPLETED") {
        console.log("onrampInstance TX_EVENTS", e);
        // Success close the onramp modal. Start polling the server for the status of the onramp transaction and trigger claim if success
      }
    });
  };
  return (
    <Button size="regular" variant="tertiary" onPress={handleSubmit}>
      <View tw="flex-row items-center" style={{ gap: 8 }}>
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg",
          }}
          height={40}
          width={40}
          style={{ marginBottom: -4 }}
        />
        <Text tw="font-semibold text-black">Pay with UPI</Text>
      </View>
    </Button>
  );
};
