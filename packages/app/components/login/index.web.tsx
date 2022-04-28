import { useCallback, useMemo } from "react";

import { yup } from "app/lib/yup";

import { Button, ButtonLabel, Text, View } from "design-system";

import { LoginContainer } from "./login-container";
import { LoginHeader } from "./login-header";
import { LoginInputField } from "./login-input-field";
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
    <LoginContainer loading={loading}>
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
            <Button
              onPress={() => handleSubmitWallet()}
              variant="primary"
              size="regular"
            >
              <ButtonLabel>Sign in with Wallet</ButtonLabel>
            </Button>
          </View>
          <View tw="mb-4 bg-gray-100 dark:bg-gray-900">
            <Text tw="my-2 text-center text-sm font-bold text-gray-600 dark:text-gray-400">
              — or —
            </Text>
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
    </LoginContainer>
  );
}
