import { Linking } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { PolygonScan } from "@showtime-xyz/universal.icon";
import { Text } from "@showtime-xyz/universal.text";

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
      <Text tw="pl-2 text-sm text-black dark:text-white">
        View on Polygon Scan
      </Text>
    </Button>
  );
};
