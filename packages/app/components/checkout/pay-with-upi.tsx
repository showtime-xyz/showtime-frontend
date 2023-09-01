import { OnrampWebSDK } from "@onramp.money/onramp-web-sdk";

import { Button } from "@showtime-xyz/universal.button";
import { Image } from "@showtime-xyz/universal.image";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import { Logger } from "app/lib/logger";

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

export const PayWithUPI = (props: {
  onRampInitData: OnRampInitDataType;
  edition: CreatorEditionResponse;
}) => {
  const { onRampInitData, edition } = props;

  const router = useRouter();
  const handleSubmit = () => {
    let req: any;
    if (process.env.NEXT_PUBLIC_STAGE === "development") {
      req = {
        appId: onRampInitData.app_id,
        walletAddress: onRampInitData.wallet_address,
        fiatType: onRampInitData.fiat_type,
        fiatAmount: onRampInitData.fiat_amount,
        merchantRecognitionId: onRampInitData.merchant_id,
      };
    } else {
      req = {
        appId: onRampInitData.app_id,
        walletAddress: onRampInitData.wallet_address,
        flowType: onRampInitData.flow_type,
        fiatType: onRampInitData.fiat_type,
        fiatAmount: onRampInitData.fiat_amount,
        network: onRampInitData.network,
        coinCode: onRampInitData.coin_code,
        merchantRecognitionId: onRampInitData.merchant_id,
      };
    }

    const onrampInstance = new OnrampWebSDK(req);

    onrampInstance.show();

    onrampInstance.on("TX_EVENTS", (e) => {
      console.log("on ramp tx status ", e);
      if (
        e.type === "ONRAMP_WIDGET_TX_FINDING" ||
        e.type === "ONRAMP_WIDGET_TX_PURCHASING"
      ) {
        if (onrampInstance._isVisible) {
          onrampInstance.close();
        }
        router.replace(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              contractAddress:
                edition?.creator_airdrop_edition.contract_address,
              checkoutReturnForPaidNFTModal: true,
              onRampMerchantId: onRampInitData.merchant_id,
            },
          },
          router.asPath,
          {
            shallow: true,
          }
        );
      }
    });

    onrampInstance.on("WIDGET_EVENTS", (e) => {
      if (e.type === "ONRAMP_WIDGET_FAILED") {
        Logger.error("onrampInstance widget failed", e);
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
