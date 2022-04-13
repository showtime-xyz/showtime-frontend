import { useEffect } from "react";

import { useRouter } from "app/navigation/use-router";
import { ProfileScreen } from "app/screens/profile";

function ProfileRouter() {
  const router = useRouter();

  useEffect(() => {
    if (
      router.pathname === "/[username]" &&
      !router.asPath.includes("[username]")
    ) {
      const href = router.asPath.replace("/", "/@");
      const as = router.asPath.replace("/", "/@");
      router.replace(href, as, {
        shallow: true,
      });
    }

    if (
      router.pathname === "/profile/[username]" &&
      !router.asPath.includes("[username]") &&
      !router.asPath.startsWith("/@")
    ) {
      const href = router.asPath.replace("/profile/", "/");
      const as = router.asPath.replace("/profile/", "/");
      router.replace(href, as, {
        shallow: true,
      });
    }
  }, [router]);

  return <ProfileScreen />;
}

export default ProfileRouter;
