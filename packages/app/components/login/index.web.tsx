import { useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";

import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { yup } from "app/lib/yup";

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
  } = useLogin(onLogin);
  //#endregion

  //#region variables
  const contactDetailsValidationSchema = useMemo(
    () =>
      yup
        .object({
          contact: yup
            .string()
            // @ts-ignore
            .or([
              yup
                .string()
                .email("Please enter a valid email address or phone number."),
              yup
                .string()
                .phone(
                  "US",
                  false,
                  "Please enter a valid email address or phone number."
                ),
            ]),
        })
        .required(),
    []
  );
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
      ) : (
        <>
          <LoginHeader />
          <View tw="p-4">
            <ConnectButton handleSubmitWallet={handleSubmitWallet} />
          </View>
          <View tw="mb-4 bg-gray-100 dark:bg-gray-900">
            <View tw="h-2" />
            <Text tw="text-center text-sm font-bold text-gray-600 dark:text-gray-400">
              — or —
            </Text>
            <View tw="h-2" />
          </View>
          <View tw="p-4">
            <LoginInputField
              key="login-contact-details-field"
              label="Contact details"
              placeholder="Enter your email or phone number"
              signInButtonLabel="Sign in"
              validationSchema={contactDetailsValidationSchema}
              onSubmit={handleSubmitContactDetails}
            />
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
