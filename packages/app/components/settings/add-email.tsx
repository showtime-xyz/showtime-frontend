import { useCallback, useState, useEffect } from "react";

import { useRouter } from "@showtime-xyz/universal.router";
import { View } from "@showtime-xyz/universal.view";

import { useManageAccount } from "app/hooks/use-manage-account";
import { useWeb3 } from "app/hooks/use-web3";
import { Analytics, EVENTS } from "app/lib/analytics";
import { Logger } from "app/lib/logger";
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
      Analytics.track(EVENTS.BUTTON_CLICKED, {
        name: "Login with email",
      });

      try {
        const did = await magic.auth.loginWithMagicLink({ email });

        if (did) {
          await addEmail(email, did);
          router.pop();
        }
      } catch (error) {
        Logger.error(error);
      } finally {
        // logout user after magic login or else on next app mount wallet and magic both will be connected that can lead to weird bugs.
        magic?.user?.logout();
      }
    },
    [magic, addEmail, router]
  );

  return (
    <>
      <View tw="flex h-full px-4">
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
