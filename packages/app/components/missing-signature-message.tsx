import { useEffect, useRef } from "react";
import { Platform } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useWallet } from "app/hooks/auth/use-wallet";

export const MissingSignatureMessage = ({ onMount }: { onMount?: any }) => {
  const { disconnect, connect } = useWallet();
  const mounted = useRef(false);
  const router = useRouter();
  const handleReconnect = async () => {
    disconnect();
    if (Platform.OS === "web") {
      localStorage.removeItem("walletconnect");
      connect?.();
    } else {
      // TODO: wallet selection modal is only on login screen on native
      router.push("/login");
    }
  };

  useEffect(() => {
    if (!mounted.current) {
      onMount?.();
      mounted.current = true;
    }
  }, [onMount]);

  return (
    <View tw="mt-2 flex-row flex-wrap items-center">
      <Text tw="py-4 pr-2 text-sm text-gray-900 dark:text-white">
        Haven't received a signature request yet?
      </Text>
      <Button onPress={handleReconnect}>Reconnect your wallet</Button>
    </View>
  );
};
