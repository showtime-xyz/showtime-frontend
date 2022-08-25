import { useEffect } from "react";

import { SWRConfig } from "swr";

import { useRouter } from "@showtime-xyz/universal.router";

import { ProfileScreen } from "app/screens/profile";

function ProfileRouter({ fallback = {} }: { fallback?: object }) {
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
        scroll: false,
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
        scroll: false,
      });
    }
  }, [router]);

  return (
    <SWRConfig value={{ fallback }}>
      <ProfileScreen />
    </SWRConfig>
  );
}

export default ProfileRouter;
