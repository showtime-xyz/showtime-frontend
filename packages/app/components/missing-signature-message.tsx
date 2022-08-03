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
    <View tw="mt-2 flex-row items-center">
      <Text tw="py-4 pr-2 text-sm text-gray-900 dark:text-white">
        Haven't received a signature request yet?
      </Text>
      <Button onPress={handleReconnect}>Reconnect your wallet</Button>
    </View>
  );
};
