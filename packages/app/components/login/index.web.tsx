import { StyleSheet } from "react-native";

import { PortalProvider } from "@gorhom/portal";

import { Button } from "@showtime-xyz/universal.button";
import { ScrollView } from "@showtime-xyz/universal.scroll-view";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { LoginComponent } from "./login";
import { useLogin } from "./use-login";

interface LoginProps {
  onLogin?: () => void;
}

export function Login({ onLogin }: LoginProps) {
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
  } = useLogin(onLogin);
  //#endregion

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
            <Text tw="text-center text-lg dark:text-gray-400">
              We need a signature in order to verify your identity. This won't
              cost any gas.
            </Text>
            <Button tw="mt-8" onPress={verifySignature}>
              Sign the message
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
