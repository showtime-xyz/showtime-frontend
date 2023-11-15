import { useCallback } from "react";

import { useRouter } from "@showtime-xyz/universal.router";
import { View } from "@showtime-xyz/universal.view";

import { PhoneNumberPicker } from "app/components/login/phone-number-picker";
import { useManageAccount } from "app/hooks/use-manage-account";
import { Analytics, EVENTS } from "app/lib/analytics";
import { useMagic } from "app/lib/magic";

export const VerifyPhoneNumberModal = () => {
  const router = useRouter();
  const { verifyPhoneNumber } = useManageAccount();
  const { magic } = useMagic();

  const submitPhoneNumber = useCallback(
    async (phoneNumber: string) => {
      Analytics.track(EVENTS.BUTTON_CLICKED, {
        name: "Login with phone number",
      });

      try {
        const did = await magic.auth.loginWithSMS({
          phoneNumber,
        });

        if (did) {
          await verifyPhoneNumber(phoneNumber, did);
          router.pop();
        }
      } catch (error) {
        console.error(error);
      } finally {
        // logout user after magic login or else on next app mount wallet and magic both will be connected that can lead to weird bugs.
        magic?.user?.logout();
      }
    },
    [magic, verifyPhoneNumber, router]
  );

  return (
    <>
      <View tw="flex h-full px-4">
        <PhoneNumberPicker handleSubmitPhoneNumber={submitPhoneNumber} />
      </View>
    </>
  );
};
