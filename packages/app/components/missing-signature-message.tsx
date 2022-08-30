import { useEffect, useRef } from "react";
import { Platform } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useWallet } from "app/hooks/use-wallet";
import { useWalletConnect } from "app/lib/walletconnect";

export const MissingSignatureMessage = ({
  onMount,
  onReconnectWallet,
}: {
  onMount?: any;
  onReconnectWallet?: any;
}) => {
  const connector = useWalletConnect();

  const { connect, connected, disconnect } = useWallet();
  const openConnectModalAfterDisconnect = useRef(false);
  const mounted = useRef(false);
  const router = useRouter();

  const handleReconnect = async () => {
    if (Platform.OS === "web") {
      disconnect();
    } else {
      connector.killSession();
    }
    openConnectModalAfterDisconnect.current = true;
  };

  useEffect(() => {
    // TODO: rainbowkit sets openAccountModal undefined if the wallet is in `connected` state, so we did some hacks here
    if (connect && openConnectModalAfterDisconnect.current) {
      setTimeout(() => {
        connect();
        onReconnectWallet?.();
      });
      openConnectModalAfterDisconnect.current = false;
    }
  }, [connect, onReconnectWallet]);

  useEffect(() => {
    // TODO: wallet connect stays connected even after we await in disconnect so we do this hack
    if (!connected && openConnectModalAfterDisconnect.current) {
      // TODO: wallet selection modal is only on login screen on native
      router.push("/login");
      onReconnectWallet?.();
      openConnectModalAfterDisconnect.current = false;
    }
  }, [connected, onReconnectWallet, router]);

  useEffect(() => {
    if (!mounted.current) {
      onMount?.();
      mounted.current = true;
    }
  }, [onMount]);

  return (
    <View tw="mt-2 items-center">
      <Text tw="py-4 pr-2 text-sm text-gray-900 dark:text-white">
        Haven't received a signature request yet?
      </Text>
      <Button onPress={handleReconnect}>Reconnect your wallet</Button>
    </View>
  );
};
