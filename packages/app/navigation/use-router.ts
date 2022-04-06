import { useCallback, useMemo } from "react";

import { reloadAsync } from "expo-updates";
import { useRouter as useNextRouter, NextRouter } from "next/router";

import {
  useLinkTo,
  useNavigation,
  useNavigationState,
  StackActions,
  NavigationState,
} from "app/lib/react-navigation/native";

import { parseNextPath } from "./parse-next-path";

const getPath = (navigationState: NavigationState) => {
  return (
    navigationState?.routes?.[navigationState?.index]?.path ??
    navigationState?.routes?.[navigationState?.index]?.state?.routes[0]?.path ??
    "/"
  );
};

export function useRouter() {
  const linkTo = useLinkTo();
  const router = useNextRouter();
  const navigation = useNavigation();
  const navigationState = useNavigationState((state) => state);

  return {
    push: useCallback(
      (...nextProps: Parameters<NextRouter["push"]>) => {
        if (router) {
          router.push(...nextProps);
        } else {
          const [url, as] = nextProps;

          const to = as ? parseNextPath(as) : parseNextPath(url);

          if (to) {
            linkTo(to);
          }
        }
      },
      [linkTo, router]
    ),
    replace: useCallback(
      (...nextProps: Parameters<NextRouter["replace"]>) => {
        if (router) {
          router.replace(...nextProps);
        } else {
          const [url, as] = nextProps;

          const to = as ? parseNextPath(as) : parseNextPath(url);

          if (to) {
            linkTo(to);
          }
        }
      },
      [linkTo, router]
    ),
    back: useCallback(() => {
      if (router) {
        router.back();
      } else {
        navigation.goBack();
      }
    }, [router, navigation]),
    pop: useCallback(() => {
      if (router) {
        router.back();
      } else {
        navigation.dispatch(StackActions.pop());
      }
    }, [router, navigation, navigationState]),
    prefetch: useCallback(
      (...nextProps: Parameters<NextRouter["prefetch"]>) => {
        if (router) {
          router.prefetch(...nextProps);
        }
      },
      [router]
    ),
    pathname: useMemo(() => {
      if (router) {
        return router.pathname;
      } else {
        const pathname = getPath(navigationState);

        return pathname;
      }
    }, [router, navigationState]),
    reload: useCallback(async () => {
      if (router) {
        router.reload();
      } else {
        await reloadAsync();
      }
    }, [router]),
  };
}
