import { OnrampWebSDK } from "@onramp.money/onramp-web-sdk";

import { Button } from "@showtime-xyz/universal.button";
import { Image } from "@showtime-xyz/universal.image";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

export type OnRampInitDataType = {
  app_id: number;
  coin_code: string;
  fiat_amount: number;
  fiat_type: number;
  flow_type: number;
  merchant_id: string;
  network: string;
  wallet_address: string;
};

export const PayWithUPI = (props: { onRampInitData: OnRampInitDataType }) => {
  const { onRampInitData } = props;
  const handleSubmit = () => {
    const onrampInstance = new OnrampWebSDK({
      appId: onRampInitData.app_id,
      walletAddress: onRampInitData.wallet_address,
      flowType: onRampInitData.flow_type,
      fiatType: onRampInitData.fiat_type,
      fiatAmount: onRampInitData.fiat_amount,
      network: onRampInitData.network,
      coinCode: onRampInitData.coin_code,
      merchantRecognitionId: onRampInitData.merchant_id,
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
    <Button
      size="regular"
      variant="base"
      tw="bg-gray-100 dark:bg-gray-50"
      onPress={handleSubmit}
    >
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
