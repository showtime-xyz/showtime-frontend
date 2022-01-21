import Router from "next/router";
import { useCallback } from "react";
import { useRouter } from "./use-router";

export const useProfileNavigation = (address?: string) => {
  const router = useRouter();

  return useCallback(() => {
    if (address) {
      const path = router.pathname.startsWith("/trending") ? "/trending" : "";
      const as = `${path}/profile/${address}`;

      const href = Router.router
        ? {
            pathname: Router.pathname,
            query: { ...Router.query, walletAddress: address },
          }
        : as;

      router.push(href, as, { shallow: true });
    }
  }, [router, address]);
};

export const useSettingsNavigation = (address?: string) => {
  const router = useRouter();
  return useCallback(() => {
    if (address) {
      const as = `/settings/${address}`;

      const href = Router.router
        ? {
            pathname: Router.pathname,
            query: { ...Router.query, walletAddress: address },
          }
        : as;

      router.push(href, as, { shallow: true });
    }
  }, [router, address]);
};
