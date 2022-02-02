import { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { yup } from "app/lib/yup";

import {
  View,
  Text,
  Tabs,
  TabItem,
  SelectedTabIndicator,
  Button,
  ButtonLabel,
} from "design-system";
import { useLogin } from "./use-login";
import { LoginInputField } from "./login-input-field";
import { LoginHeader } from "./login-header";
import { LoginContainer } from "./login-container";
import { PhoneNumberPicker } from "./phone-number-picker";

const TAB_LIST_HEIGHT = 56;

interface LoginProps {
  onLogin?: () => void;
}

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
  const phoneNumberValidationSchema = useMemo(
    () =>
      yup
        .object({
          data: yup
            .string()
            .phone("US", false, "Please enter a valid phone number.")
            .required("Please enter a valid phone number."),
        })
        .required(),
    []
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
  const tabsData = useMemo(
    () => [{ name: "Phone number" }, { name: "Wallet or email" }],
    []
  );
  //#endregion
  return (
    <LoginContainer
      loading={
        loading &&
        (walletStatus !== "FETCHING_NONCE" || walletStatus !== "FETCHING_NONCE")
      }
    >
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

          <View
            style={{
              marginLeft: -16,
              marginRight: -16,
              height: 376,
            }}
          >
            <Tabs.Root
              initialIndex={selected}
              onIndexChange={setSelected}
              tabListHeight={TAB_LIST_HEIGHT}
            >
              <View tw="justify-center items-center border-b border-gray-200 dark:border-gray-800">
                <View tw="flex-row h-[56px]">
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
                  <PhoneNumberPicker
                    handleSubmitPhoneNumber={handleSubmitPhoneNumber}
                  />
                </Tabs.View>

                <Tabs.View style={styles.tabListItemContainer}>
                  <View tw="mb-[16px]">
                    <Button
                      onPress={() => handleSubmitWallet()}
                      variant="primary"
                      size="regular"
                    >
                      <ButtonLabel>Sign in with Wallet</ButtonLabel>
                    </Button>
                  </View>
                  <View tw="mb-[16px] mx-[-16px] bg-gray-100 dark:bg-gray-900">
                    <Text tw="my-[8px] font-bold text-sm text-gray-600 dark:text-gray-400 text-center">
                      — or —
                    </Text>
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
              </Tabs.Pager>
            </Tabs.Root>
          </View>
        </>
      )}
    </LoginContainer>
  );
}

const styles = StyleSheet.create({
  tabListItemContainer: {
    marginTop: -(TAB_LIST_HEIGHT - 16),
    paddingHorizontal: 16,
  },
});
