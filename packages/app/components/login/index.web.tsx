import { useEffect } from "react";
import { StyleSheet } from "react-native";

import { PortalProvider } from "@gorhom/portal";
import { usePrivy } from "@privy-io/react-auth";

import { Button } from "@showtime-xyz/universal.button";
import {
  Apple,
  GoogleOriginal,
  MessageFilled,
} from "@showtime-xyz/universal.icon";
import { useModalScreenContext } from "@showtime-xyz/universal.modal-screen";
import { ScrollView } from "@showtime-xyz/universal.scroll-view";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import SvgPhonePortraitOutline from "design-system/icon/PhonePortraitOutline";

import { ConnectButton } from "../connect-button";
import { useLogin } from "./use-login";

export function Login() {
  //#region hooks
  const {
    walletStatus,
    walletName,
    showSignMessage,
    verifySignature,
    handleSubmitWallet,
    loading,
  } = useLogin();
  const { login } = usePrivy();
  //#endregion
  const modalScreenContext = useModalScreenContext();

  useEffect(() => {
    if (showSignMessage) {
      modalScreenContext?.setTitle("Sign in with your wallet to continue");
    } else {
      modalScreenContext?.setTitle("Sign in to collect & unlock");
    }
  }, [showSignMessage, modalScreenContext]);

  return (
    <PortalProvider>
      <ScrollView style={styles.container}>
        {walletStatus === "FETCHING_SIGNATURE" ? (
          <View tw="py-40">
            <Text tw="text-center dark:text-gray-400">
              {walletName !== ""
                ? `Pushed a request to ${walletName}... Please check your wallet.`
                : `Pushed a request to your wallet...`}
            </Text>
          </View>
        ) : showSignMessage ? (
          <View tw="px-10 py-20">
            <Text tw="text-center text-base text-gray-900 dark:text-gray-50">
              Showtime uses this signature to verify you own this address. This
              doesn't cost gas fees.
            </Text>
            <Button
              size="regular"
              tw={`mt-8 ${loading ? "opacity-[0.5]" : ""}`}
              onPress={() => verifySignature()}
              disabled={loading}
            >
              {loading ? "Please wait..." : "Continue"}
            </Button>
          </View>
        ) : (
          <View tw="p-4">
            <Button size="regular" onPress={login}>
              Login with phone <SvgPhonePortraitOutline />, email,
              <MessageFilled /> google <GoogleOriginal /> or apple <Apple />
            </Button>
            <ConnectButton handleSubmitWallet={handleSubmitWallet} />
          </View>
        )}
      </ScrollView>
    </PortalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  tabListItemContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    flex: 1,
    paddingTop: 16,
  },
});
