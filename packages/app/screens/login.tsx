import { Modal } from "design-system";
import { Login } from "app/components/login";
import { useRouter } from "app/navigation/use-router";

export function LoginScreen() {
  const router = useRouter();
  return (
    <Modal
      title="Sign In"
      close={router.pop}
      height=""
      bodyTW="bg-white dark:bg-black"
    >
      <Login />
    </Modal>
  );
}
