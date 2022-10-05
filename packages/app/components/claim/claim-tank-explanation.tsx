import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

export const ClaimTankExplanationModal = () => {
  return (
    <BottomSheetModalProvider>
      <View tw="mb-6 px-4">
        <Text tw="text-sm text-black dark:text-white">
          - You are currently earning 1 claim per hour up to your claim limit of
          5.
        </Text>
        <View tw="h-4" />
        <Text tw="text-sm text-black dark:text-white">
          - Your claim limit can be upgraded to 10 by verifying your phone
          number.
        </Text>

        <View tw="h-4" />
        <Text tw="text-sm text-black dark:text-white">
          - You are currently earning 1 claim per hour up to your upgraded claim
          limit of 10.
        </Text>
      </View>
    </BottomSheetModalProvider>
  );
};
