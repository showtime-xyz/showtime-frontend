import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

export const ProfileScialExplanation = () => {
  return (
    <BottomSheetModalProvider>
      <View tw="mb-6 justify-center px-4 pt-4">
        <Text tw="text-sm text-black dark:text-white">
          Connecting your Twitter or Instagram account is only required to
          verify it's you. We will not store or use your data in any other way.
        </Text>
      </View>
    </BottomSheetModalProvider>
  );
};
