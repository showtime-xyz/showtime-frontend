import { useMemo, useCallback, useState } from "react";
import { Platform, StyleSheet, useWindowDimensions } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import {
  SceneRendererProps,
  TabView,
  Route,
  ScollableTabBar,
} from "@showtime-xyz/universal.tab-view";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { yup } from "app/lib/yup";

import { LoginContainer } from "./login-container";
import { LoginHeader } from "./login-header";
import { LoginInputField } from "./login-input-field";
import { LoginOverlays } from "./login-overlays";
import { PhoneNumberPicker } from "./phone-number-picker";
import { useLogin } from "./use-login";

interface LoginProps {
  onLogin?: () => void;
}
const LOGIN_ROUTES = [
  {
    title: "Wallet or phone",
    key: "phone",
    index: 0,
  },
  {
    title: "Email",
    key: "email",
    index: 1,
  },
];
const CONTENT_HEIGHT = Platform.select({
  android: [450, 397],
  default: [420, 420],
});

export function Login({ onLogin }: LoginProps) {
  //#region state
  const [index, setIndex] = useState(0);
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
  const { width } = useWindowDimensions();

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
  // const phoneNumberValidationSchema = useMemo(
  //   () =>
  //     yup
  //       .object({
  //         data: yup
  //           .string()
  //           .phone("US", false, "Please enter a valid phone number.")
  //           .required("Please enter a valid phone number."),
  //       })
  //       .required(),
  //   []
  // );

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

  const renderScene = useCallback(
    ({
      route: { key },
    }: SceneRendererProps & {
      route: Route;
    }) => {
      switch (key) {
        case "phone":
          return (
            <View style={styles.tabListItemContainer}>
              <View tw="mb-[16px]">
                <Button
                  onPress={() => handleSubmitWallet()}
                  variant="primary"
                  size="regular"
                >
                  <Text>Sign in with Wallet</Text>
                </Button>
              </View>
              <View tw="mx-[-16px] mb-[16px] bg-gray-100 dark:bg-gray-900">
                <View tw="h-2" />
                <Text tw="text-center text-sm font-bold text-gray-600 dark:text-gray-400">
                  — or —
                </Text>
                <View tw="h-2" />
              </View>
              <PhoneNumberPicker
                handleSubmitPhoneNumber={handleSubmitPhoneNumber}
              />
            </View>
          );
        case "email":
          return (
            <View style={styles.tabListItemContainer}>
              <LoginInputField
                key="login-email-field"
                validationSchema={emailValidationSchema}
                label="Email address"
                placeholder="Enter your email address"
                keyboardType="email-address"
                textContentType="emailAddress"
                signInButtonLabel="Send"
                onSubmit={handleSubmitEmail}
              />
            </View>
          );
        default:
          return null;
      }
    },
    [
      emailValidationSchema,
      handleSubmitEmail,
      handleSubmitPhoneNumber,
      handleSubmitWallet,
    ]
  );
  //#endregion
  return (
    <LoginContainer style={styles.container}>
      {isConnectingToWallet ? (
        <View tw="py-40">
          <Text tw="text-center dark:text-gray-400">
            {walletName
              ? `Pushed a request to ${walletName}... Please check your wallet.`
              : `Pushed a request to your wallet...`}
          </Text>
        </View>
      ) : (
        <View
          style={{
            height: CONTENT_HEIGHT[index],
          }}
        >
          <LoginHeader />
          <TabView
            navigationState={{ index, routes: LOGIN_ROUTES }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            renderTabBar={(props) => <ScollableTabBar {...props} />}
            initialLayout={{
              width,
            }}
          />
        </View>
      )}
      <LoginOverlays loading={loading && !isConnectingToWallet} />
    </LoginContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  tabListItemContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flex: 1,
    paddingTop: 16,
  },
});
