import { useMemo, useState } from "react";
import { StyleSheet } from "react-native";

import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { ConnectButton } from "app/components/connect-button";
import { yup } from "app/lib/yup";

import { LoginButton } from "./login-button";
import { LoginFooter } from "./login-footer";
import { LoginHeader } from "./login-header";
import { LoginInputField } from "./login-input-field";
import { LoginOverlays } from "./login-overlays";
import { LoginWithApple } from "./login-with-apple";
import { LoginWithGoogle } from "./login-with-google";
import { PhoneNumberPicker } from "./phone-number-picker";
import type { SubmitWalletParams } from "./use-login";

interface LoginComponentProps {
  tw?: string;
  handleSubmitEmail: (email: string) => Promise<void>;
  handleSubmitPhoneNumber: (phoneNumber: string) => Promise<void>;
  handleSubmitWallet: (
    params?: SubmitWalletParams | undefined
  ) => Promise<void>;
  loading: boolean;
}

export function LoginComponent({
  handleSubmitEmail,
  handleSubmitPhoneNumber,
  handleSubmitWallet,
  loading,
  tw = "",
}: LoginComponentProps) {
  //#region state
  const [showEmailLogin, setShowEmailLogin] = useState(false);

  //#endregion

  //#region variables

  const emailValidationSchema = useMemo(
    () =>
      yup
        .object({
          data: yup
            .string()
            .email("Please enter a valid email address.")
            .required("Please enter a valid email address."),
        })
        .required(),
    []
  );

  //#endregion
  return (
    <View tw={tw}>
      <View
        style={[
          styles.tabListItemContainer,
          { display: showEmailLogin ? "flex" : "none" },
        ]}
      >
        <LoginInputField
          key="login-email-field"
          validationSchema={emailValidationSchema}
          label="Email address"
          placeholder="Enter your email address"
          keyboardType="email-address"
          textContentType="emailAddress"
          signInButtonLabel="Send Email"
          onSubmit={handleSubmitEmail}
        />
        <LoginButton onPress={() => setShowEmailLogin(false)} type="social" />
      </View>
      <View style={{ display: showEmailLogin ? "none" : "flex" }}>
        <LoginHeader />
        <View style={styles.tabListItemContainer}>
          <View tw="mb-[16px]">
            <PhoneNumberPicker
              handleSubmitPhoneNumber={handleSubmitPhoneNumber}
            />
          </View>
          <View tw="mx-[-16px] mb-[8px] flex-row items-center">
            <View tw="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
            <Text tw="mx-2 text-center text-sm font-bold text-gray-600 dark:text-gray-400">
              OR
            </Text>
            <View tw="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
          </View>
          <LoginWithApple />
          <LoginWithGoogle />
          {/* <LoginWithTwitter /> */}
          <LoginButton onPress={() => setShowEmailLogin(true)} type="email" />
          <ConnectButton handleSubmitWallet={handleSubmitWallet} />
          <LoginFooter />
        </View>
      </View>
      <LoginOverlays loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    minHeight: 400,
  },
  tabListItemContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    flex: 1,
    paddingTop: 16,
  },
});
