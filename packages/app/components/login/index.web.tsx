import { useCallback, useMemo } from "react";
import { yup } from "app/lib/yup";

import { View, Text, Button, ButtonLabel } from "design-system";
import { LoginInputField } from "./login-input-field";
import { LoginContainer } from "./login-container";
import { LoginHeader } from "./login-header";
import { useLogin } from "./useLogin";

export function Login() {
  //#region hooks
  const {
    loading,
    signaturePending,
    walletName,
    handleSubmitWallet,
    handleSubmitEmail,
    handleSubmitPhoneNumber,
  } = useLogin();
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
      {signaturePending ? (
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
            key="login-contact-details-field"
            label="Contact details"
            placeholder="Enter your email or phone number"
            signInButtonLabel="Sign in"
            validationSchema={contactDetailsValidationSchema}
            onSubmit={handleSubmitContactDetails}
          />
        </>
      )}
    </LoginContainer>
  );
}
