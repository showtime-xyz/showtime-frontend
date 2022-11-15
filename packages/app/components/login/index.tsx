import { useMemo, useState } from "react";
import { Platform, StyleSheet } from "react-native";

import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { PortalProvider } from "@gorhom/portal";

import { ScrollView } from "@showtime-xyz/universal.scroll-view";
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
import { useLogin } from "./use-login";

const ContainerView: any =
  Platform.OS === "android" ? BottomSheetScrollView : ScrollView;
interface LoginProps {
  onLogin?: () => void;
}

export function Login({ onLogin }: LoginProps) {
  //#region state
  const [showEmailLogin, setShowEmailLogin] = useState(false);

  //#endregion

  //#region hooks
  const {
    walletStatus,
    walletName,
    loading,
    handleSubmitEmail,
    handleSubmitPhoneNumber,
    handleSubmitWallet,
  } = useLogin(onLogin);

  //#endregion

  //#region variables
  const isConnectingToWallet = useMemo(
    () =>
      [
        "CONNECTING_TO_WALLET",
        "CONNECTED_TO_WALLET",
        "FETCHING_NONCE",
        "FETCHED_NONCE",
        "SIGNING_PERSONAL_MESSAGE",
      ].includes(walletStatus),
    [walletStatus]
  );

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
    <PortalProvider>
      <ContainerView style={styles.container}>
        {isConnectingToWallet ? (
          <View tw="py-40">
            <Text tw="text-center dark:text-gray-400">
              {walletName
                ? `Pushed a request to ${walletName}... Please check your wallet.`
                : `Pushed a request to your wallet...`}
            </Text>
          </View>
        ) : (
          <View>
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
              <LoginButton
                onPress={() => setShowEmailLogin(false)}
                type="social"
              />
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
                <LoginButton
                  onPress={() => setShowEmailLogin(true)}
                  type="email"
                />
                <ConnectButton handleSubmitWallet={handleSubmitWallet} />
                <LoginFooter />
              </View>
            </View>
          </View>
        )}
        <LoginOverlays loading={loading && !isConnectingToWallet} />
      </ContainerView>
    </PortalProvider>
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
