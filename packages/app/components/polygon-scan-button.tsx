import { Linking } from "react-native";

import { Button, Text } from "design-system";
import { PolygonScan } from "design-system/icon";
import { tw } from "design-system/tailwind";

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
    <Button onPress={handleOpenPolygonScan} variant="tertiary">
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
