import { useMemo, useState } from "react";
import { Platform, StyleSheet } from "react-native";

import { Button, ButtonLabel } from "@showtime-xyz/universal.button";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { TAB_LIST_HEIGHT } from "app/lib/constants";
import { yup } from "app/lib/yup";

import { Tabs, TabItem, SelectedTabIndicator } from "design-system/tabs";

import { LoginContainer } from "./login-container";
import { LoginHeader } from "./login-header";
import { LoginInputField } from "./login-input-field";
import { LoginOverlays } from "./login-overlays";
import { PhoneNumberPicker } from "./phone-number-picker";
import { useLogin } from "./use-login";

interface LoginProps {
  onLogin?: () => void;
}

const CONTENT_HEIGHT = Platform.select({
  android: [281, 397],
  default: [389, 389],
});

export function Login({ onLogin }: LoginProps) {
  //#region state
  const [selected, setSelected] = useState(0);
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
  const tabsData = useMemo(
    () => [{ name: "Wallet or email" }, { name: "Phone number" }],
    []
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
        <>
          <LoginHeader />

          <View
            style={{
              height: CONTENT_HEIGHT[selected],
            }}
          >
            <Tabs.Root
              initialIndex={selected}
              onIndexChange={setSelected}
              tabListHeight={TAB_LIST_HEIGHT}
            >
              <View tw="items-center justify-center border-b border-gray-200 dark:border-gray-800">
                <View tw="h-[56px] flex-row">
                  {tabsData.map((d, i) => (
                    // @ts-ignore
                    <Tabs.Trigger key={d.name} index={i}>
                      <TabItem name={d.name} selected={selected === i} />
                    </Tabs.Trigger>
                  ))}

                  <SelectedTabIndicator />
                </View>
              </View>
              <Tabs.Pager>
                <Tabs.View style={styles.tabListItemContainer}>
                  <View tw="mb-[16px]">
                    <Button
                      onPress={handleSubmitWallet}
                      variant="primary"
                      size="regular"
                    >
                      <ButtonLabel>Sign in with Wallet</ButtonLabel>
                    </Button>
                  </View>
                  <View tw="mx-[-16px] mb-[16px] bg-gray-100 dark:bg-gray-900">
                    <View tw="h-2" />
                    <Text tw="text-center text-sm font-bold text-gray-600 dark:text-gray-400">
                      — or —
                    </Text>
                    <View tw="h-2" />
                  </View>
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
                </Tabs.View>
                <Tabs.View style={styles.tabListItemContainer}>
                  <PhoneNumberPicker
                    handleSubmitPhoneNumber={handleSubmitPhoneNumber}
                  />
                </Tabs.View>
              </Tabs.Pager>
            </Tabs.Root>
          </View>
        </>
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
    marginTop: -(TAB_LIST_HEIGHT - 16),
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
