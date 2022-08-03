import { Button } from "@showtime-xyz/universal.button";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useWallet } from "app/hooks/auth/use-wallet";

export const MissingSignatureMessage = () => {
  const { disconnect, connect } = useWallet();
  const handleReconnect = async () => {
    await disconnect();
    connect?.();
  };

  return (
    <View tw="flex-row items-center mt-2">
      <Text tw="text-sm dark:text-white text-gray-900 py-4 pr-2">
        Haven't received a signature request yet?
      </Text>
      <Button onPress={handleReconnect}>Reconnect your wallet</Button>
    </View>
  );
};
