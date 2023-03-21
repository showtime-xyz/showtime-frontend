import { Linking } from "react-native";

import { Button } from "design-system/button";
import { useIsDarkMode } from "design-system/hooks";
import { PolygonScan } from "design-system/icon";
import { Text } from "design-system/text";

export const PolygonScanButton = ({
  transactionHash,
}: {
  transactionHash?: string;
}) => {
  const isDark = useIsDarkMode();

  if (!transactionHash) {
    return null;
  }

  return (
    <Button
      onPress={() =>
        Linking.openURL(
          `https://${
            process.env.NEXT_PUBLIC_CHAIN_ID === "mumbai" ? "mumbai." : ""
          }polygonscan.com/tx/${transactionHash}`
        )
      }
      variant="tertiary"
      size="regular"
    >
      <PolygonScan
        style={{ borderRadius: 8, overflow: "hidden" }}
        color={isDark ? "#FFF" : "#000"}
      />
      <Text tw="pl-2 text-sm font-semibold text-black dark:text-white">
        View on Polygon Scan
      </Text>
    </Button>
  );
};
