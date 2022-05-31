import { useMemo, useCallback } from "react";

import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useManageAccount } from "app/hooks/use-manage-account";
import { magic } from "app/lib/magic";

import { ModalSheet } from "design-system";

import { EmailInput } from "./email-input";

type AddEmailProps = {
  visibility: boolean;
  dismiss: () => void;
};

export const AddEmail = ({ visibility, dismiss }: AddEmailProps) => {
  const { addEmail } = useManageAccount();
  const snapPoints = useMemo(() => ["75%", "100%"], []);

  const submitEmail = useCallback(
    async (email: string) => {
      try {
        const did = await magic.auth.loginWithMagicLink({ email });
        if (did) {
          await addEmail(email, did);
          dismiss();
        }
      } catch (error) {
        console.log("Error:", error);
      }
    },
    [addEmail, dismiss]
  );

  return (
    <View>
      <ModalSheet
        visible={visibility}
        onClose={dismiss}
        title="Add Email"
        snapPoints={snapPoints}
        web_height={"max-h-480px"}
      >
        <View tw="flex h-full px-4">
          <Text tw="px-2 py-8 text-base font-bold text-gray-900 dark:text-white">
            Enter your email to receive a sign in link.
          </Text>
          <EmailInput
            key="login-email-field"
            onSubmit={submitEmail}
            label="Email address"
            submitButtonLabel="Send"
            keyboardType="email-address"
            textContentType="emailAddress"
            placeholder="Enter your email address"
          />
        </View>
      </ModalSheet>
    </View>
  );
};
