import { BottomSheet } from "design-system/bottom-sheet";
import { View, Text, Button } from "design-system";

export const ManageWallet = (props) => {
  const viewManagedWallet = props.viewManagedWallet;
  const setViewManagedWallet = props.setViewManagedWallet;

  return (
    <View tw="dark:bg-gray-100 p-10 bg-white">
      <BottomSheet
        visible={viewManagedWallet}
        onDismiss={() => setViewManagedWallet(false)}
      >
        <View>
          <Text tw="dark:text-white text-black">Hello world</Text>
        </View>
      </BottomSheet>
    </View>
  );
};
