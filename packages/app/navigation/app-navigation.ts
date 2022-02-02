import Router from "next/router";
import { useCallback } from "react";
import { useRouter } from "./use-router";

export const useProfileNavigation = (address?: string) => {
  const router = useRouter();

  return useCallback(() => {
    if (address) {
      const as = `/profile/${address}`;

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
  // TODO: Support trending, marketplace, notifications
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
