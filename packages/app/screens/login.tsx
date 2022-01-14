import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";
import { Modal } from "design-system";
import { Login } from "app/components/login";
import { useRouter } from "app/navigation/use-router";

/**
 * extracted these number from react-navigation
 */
// @ts-ignore
const modalPresentationHeight = Platform.isPad
  ? 6
  : Platform.OS === "ios"
  ? 12
  : 0;

export function LoginScreen() {
  const router = useRouter();
  const { top: topSafeArea } = useSafeAreaInsets();
  return (
    <Modal
      title="Sign In"
      close={router.pop}
      height=""
      keyboardVerticalOffset={topSafeArea + modalPresentationHeight}
      bodyTW="bg-white dark:bg-black"
    >
      <Login />
    </Modal>
  );
}
