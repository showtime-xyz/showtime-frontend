import { useMemo, useCallback } from "react";

import { useManageAccount } from "app/hooks/use-manage-account";
import { USER_API_KEY } from "app/hooks/use-user";
import { magic } from "app/lib/magic";

import { View, Text } from "design-system";
import { BottomSheet } from "design-system/bottom-sheet";

import { EmailInput } from "./email-input";

type AddEmailProps = {
  visibility: boolean;
  dismiss: () => void;
};

export const AddEmail = (props: AddEmailProps) => {
  const { addEmail } = useManageAccount();
  const dismiss = props.dismiss;
  const visibility = props.visibility;
  const snapPoints = useMemo(() => ["40"], []);

  const submitEmail = useCallback(async (email: string) => {
    try {
      const did = await magic.auth.loginWithMagicLink({ email });
      if (did) {
        await addEmail(email, did);
        dismiss();
      }
    } catch (error) {
      console.log("Error:", error);
    }
  }, []);

  return (
    <View>
      <BottomSheet
        visible={visibility}
        onDismiss={dismiss}
        snapPoints={snapPoints}
      >
        <View tw="flex h-full">
          <Text tw="text-gray-900 dark:text-white text-base font-bold px-2 py-8">
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
      </BottomSheet>
    </View>
  );
};
