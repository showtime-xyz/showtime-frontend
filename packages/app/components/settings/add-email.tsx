import { useCallback, useState, useEffect } from "react";

import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useManageAccount } from "app/hooks/use-manage-account";
import { useWeb3 } from "app/hooks/use-web3";
import { useMagic, Relayer } from "app/lib/magic";

import { EmailInput } from "./email-input";

export const AddEmailModal = () => {
  const router = useRouter();
  const { setMountRelayerOnApp } = useWeb3();
  const { addEmail } = useManageAccount();
  const [mountRelayer, setMountRelayer] = useState(false);
  const { magic } = useMagic();

  useEffect(() => {
    setMountRelayerOnApp(false);
    setMountRelayer(true);
    return () => {
      setMountRelayerOnApp(true);
    };
  }, [setMountRelayerOnApp]);

  const submitEmail = useCallback(
    async (email: string) => {
      try {
        const did = await magic.auth.loginWithMagicLink({ email });
        if (did) {
          await addEmail(email, did);
          router.pop();
        }
      } catch (error) {
        console.log("Error:", error);
      }
    },
    [magic, addEmail, router]
  );

  return (
    <>
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
      {mountRelayer ? <Relayer /> : null}
    </>
  );
};
