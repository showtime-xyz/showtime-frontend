import { Linking } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { PolygonScan } from "@showtime-xyz/universal.icon";
import { tw } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";

export const PolygonScanButton = ({
  transactionHash,
}: {
  transactionHash?: string;
}) => {
  function handleOpenPolygonScan() {
    Linking.openURL(
      `https://${
        process.env.NEXT_PUBLIC_CHAIN_ID === "mumbai" ? "mumbai." : ""
      }polygonscan.com/tx/${transactionHash}`
    );
  }

  if (!transactionHash) {
    return null;
  }

  return (
    <Button onPress={handleOpenPolygonScan} variant="tertiary" size="regular">
      <PolygonScan
        style={tw.style("rounded-lg overflow-hidden ")}
        color={tw.style("bg-black dark:bg-white")?.backgroundColor as string}
      />
      <Text tw="pl-2 text-sm text-black dark:text-white">
        View on Polygon Scan
      </Text>
    </Button>
  );
};
