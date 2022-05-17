import { Linking } from "react-native";

import { useTailwind } from "tailwindcss-react-native";

import { Button, Text } from "design-system";
import { useIsDarkMode } from "design-system/hooks";
import { PolygonScan } from "design-system/icon";

export const PolygonScanButton = ({
  transactionHash,
}: {
  transactionHash?: string;
}) => {
  const isDark = useIsDarkMode();
  const tailwind = useTailwind();

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
        style={tailwind("rounded-lg overflow-hidden")}
        color={isDark ? "#fff" : "#000"}
      />
      <Text tw="pl-2 text-sm text-black dark:text-white">
        View on Polygon Scan
      </Text>
    </Button>
  );
};
