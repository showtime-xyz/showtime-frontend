import { useMemo } from "react";

import { BottomSheet } from "design-system/bottom-sheet";
import { View, Text, Button } from "design-system";

export const ManageAddress = (props) => {
  const snapPoints = useMemo(() => ["20%"], []);
  const viewManagedWallet = props.viewManagedWallet;
  const setViewManagedWallet = props.setViewManagedWallet;

  return (
    <View tw="dark:bg-gray-100 p-10 bg-white">
      <BottomSheet
        visible={viewManagedWallet}
        onDismiss={() => setViewManagedWallet(false)}
        snapPoints={snapPoints}
      >
        <View tw="flex justify-end h-full">
          <Button variant="tertiary" size="regular">
            <Text tw="text-red-500 dark:text-red-500">Remove Wallet</Text>
          </Button>
          <View tw="mb-12" />
        </View>
      </BottomSheet>
    </View>
  );
};
