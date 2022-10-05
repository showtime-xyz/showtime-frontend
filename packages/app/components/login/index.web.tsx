import { useCallback } from "react";
import { StyleSheet } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { ConnectButton } from "../connect-button";
import { LoginContainer } from "./login-container";
import { LoginHeader } from "./login-header";
import { LoginInputField } from "./login-input-field";
import { LoginOverlays } from "./login-overlays";
import { useLogin } from "./use-login";

interface LoginProps {
  onLogin?: () => void;
}

export function Login({ onLogin }: LoginProps) {
  //#region hooks
  const {
    walletStatus,
    walletName,
    loading,
    handleSubmitWallet,
    handleSubmitEmail,
    handleSubmitPhoneNumber,
    showSignMessage,
    verifySignature,
  } = useLogin(onLogin);
  //#endregion

  //#endregion

  //#region callbacks
  const handleSubmitContactDetails = useCallback(
    (value: string) => {
      if (value.includes("@")) {
        handleSubmitEmail(value);
      } else {
        handleSubmitPhoneNumber(value);
      }
    },
    [handleSubmitEmail, handleSubmitPhoneNumber]
  );
  //#endregion
  return (
    <LoginContainer style={styles.container}>
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
        <>
          <LoginHeader />
          <View tw="p-4">
            <LoginInputField
              key="login-contact-details-field"
              label="Contact details"
              placeholder="Enter your email or phone number"
              signInButtonLabel="Sign in"
              onSubmit={handleSubmitContactDetails}
            />
          </View>
          <View tw="mb-4 bg-gray-100 dark:bg-gray-900">
            <View tw="h-2" />
            <Text tw="text-center text-sm font-bold text-gray-600 dark:text-gray-400">
              or
            </Text>
            <View tw="h-2" />
          </View>
          <View tw="p-4">
            <ConnectButton handleSubmitWallet={handleSubmitWallet} />
          </View>
        </>
      )}

      <LoginOverlays loading={loading} />
    </LoginContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
});
