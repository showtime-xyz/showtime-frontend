import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";

type HeaderCancelProps = {
  canGoBack?: boolean;
};
export const HeaderCancel = ({ canGoBack = true }: HeaderCancelProps) => {
  const router = useRouter();
  const canGoHome = router.pathname.split("/").length - 1 >= 2;

  return (
    <PressableScale
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      onPress={() => {
        if (canGoBack) {
          router.pop();
        } else if (canGoHome) {
          router.push("/home");
        } else {
          router.push("/search");
        }
      }}
    >
      <Text tw="font-medium text-gray-700 dark:text-white">Cancel</Text>
    </PressableScale>
  );
};
