import { useMemo, useState, useRef, useEffect } from "react";
import { StyleSheet } from "react-native";

import { PortalProvider } from "@gorhom/portal";

import { Button } from "@showtime-xyz/universal.button";
import { Fieldset } from "@showtime-xyz/universal.fieldset";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { BottomSheetScrollView } from "app/components/bottom-sheet-scroll-view";
import { useAuth } from "app/hooks/auth/use-auth";
import { useLoginWithSMS } from "app/lib/privy/privy-hooks";

import { LoginComponent } from "./login";
import { useLogin } from "./use-login";

export function Login() {
  //#region hooks
  const {
    walletStatus,
    walletName,
    handleSubmitEmail,
    handleSubmitOtp,
    handleSubmitWallet,
    loading,
  } = useLogin();

  const [showOtp, setShowOtp] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const otpValueRef = useRef("");
  const { sendCode } = useLoginWithSMS();
  const otpInputRef = useRef<any>(null);
  const { authenticationStatus } = useAuth();

  useEffect(() => {
    if (showOtp) {
      setTimeout(() => {
        otpInputRef.current.focus();
      }, 100);
    }
  }, [showOtp]);

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

  //#endregion
  return (
    <PortalProvider>
      <BottomSheetScrollView style={styles.container}>
        {isConnectingToWallet ? (
          <View tw="py-40">
            <Text tw="text-center dark:text-gray-400">
              {walletName
                ? `Pushed a request to ${walletName}... Please check your wallet.`
                : `Pushed a request to your wallet...`}
            </Text>
          </View>
        ) : showOtp ? (
          <View tw="p-4">
            <Fieldset
              label="Enter OTP"
              placeholder="xxxx"
              textContentType="oneTimeCode"
              onChangeText={(v) => {
                otpValueRef.current = v;
              }}
              ref={otpInputRef}
            />
            <View tw="mt-8" style={{ rowGap: 16 }}>
              <Button
                size="regular"
                onPress={() =>
                  handleSubmitOtp(otpValueRef.current, phoneNumber)
                }
                disabled={authenticationStatus === "AUTHENTICATING"}
              >
                {authenticationStatus === "AUTHENTICATING"
                  ? "Submitting..."
                  : "Submit"}
              </Button>
              <Button
                size="regular"
                variant="secondary"
                onPress={() => setShowOtp(false)}
                disabled={authenticationStatus === "AUTHENTICATING"}
              >
                Cancel
              </Button>
            </View>
          </View>
        ) : (
          <LoginComponent
            handleSubmitEmail={handleSubmitEmail}
            handleSubmitPhoneNumber={(phoneNumber) => {
              sendCode({
                phone: phoneNumber,
              });
              setPhoneNumber(phoneNumber);
              setShowOtp(true);
            }}
            handleSubmitWallet={handleSubmitWallet}
            loading={loading && !isConnectingToWallet}
          />
        )}
      </BottomSheetScrollView>
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
