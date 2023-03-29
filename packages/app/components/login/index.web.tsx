import { useEffect } from "react";
import { StyleSheet } from "react-native";

import { PortalProvider } from "@gorhom/portal";

import { Button } from "@showtime-xyz/universal.button";
import { useModalScreenContext } from "@showtime-xyz/universal.modal-screen";
import { ScrollView } from "@showtime-xyz/universal.scroll-view";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { LoginComponent } from "./login";
import { useLogin } from "./use-login";

export function Login() {
  //#region hooks
  const {
    walletStatus,
    walletName,
    showSignMessage,
    verifySignature,
    handleSubmitEmail,
    handleSubmitPhoneNumber,
    handleSubmitWallet,
    loading,
  } = useLogin();
  //#endregion
  const modalScreenContext = useModalScreenContext();

  useEffect(() => {
    if (showSignMessage) {
      modalScreenContext?.setTitle("Sign with your wallet to continue");
    } else {
      modalScreenContext?.setTitle("Sign In");
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
          <View tw="py-20 px-10">
            <Text tw="text-center text-base text-gray-900 dark:text-gray-50">
              Showtime uses this signature to verify you own this address. This
              doesn't cost gas fees.
            </Text>
            <Button size="regular" tw="mt-8" onPress={() => verifySignature()}>
              Continue
            </Button>
          </View>
        ) : (
          <LoginComponent
            handleSubmitEmail={handleSubmitEmail}
            handleSubmitPhoneNumber={handleSubmitPhoneNumber}
            handleSubmitWallet={handleSubmitWallet}
            loading={loading}
          />
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
