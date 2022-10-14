import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useMyInfo } from "app/hooks/api-hooks";

export const ClaimLimitExplanationModal = () => {
  const { data: userProfile } = useMyInfo();

  const hasVerifiedPhoneNumber =
    userProfile?.data?.profile.has_verified_phone_number;
  const verified = userProfile?.data?.profile.verified;
  const dailyClaimLimit = userProfile?.data?.daily_claim_limit ?? 5;
  return (
    <BottomSheetModalProvider>
      <View tw="mb-6 justify-center px-4 pt-4">
        <Text tw="text-sm text-black dark:text-white">
          {`- Your claims are precious — use them wisely!`}
        </Text>
        <View tw="h-4" />
        <Text tw="text-sm text-black dark:text-white">
          {hasVerifiedPhoneNumber || verified ? (
            <>
              {`- Congrats, your phone is verified! Enjoy 1 more claim every hour, up to ${dailyClaimLimit} claims.`}
            </>
          ) : (
            <>
              {`- You are currently earning 1 claim every 3 hours, up to ${dailyClaimLimit} claims. Verify your phone number to claim more drops.`}
            </>
          )}
        </Text>
        <View tw="h-4" />
      </View>
    </BottomSheetModalProvider>
  );
};
