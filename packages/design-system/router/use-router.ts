import { useMemo } from "react";

import {
  useNavigation,
  NavigationState,
  StackActions,
} from "@react-navigation/native";
import type { ParsedUrlQuery } from "querystring";
import { useRouter as useSolitoRouter } from "solito/router";

const getPath = (navigationState: NavigationState) => {
  return (
    navigationState?.routes?.[navigationState?.index]?.path ??
    navigationState?.routes?.[navigationState?.index]?.state?.routes[0]?.path ??
    "/"
  );
};

export function useRouter() {
  const { dispatch, getState } = useNavigation();
  const solitoRouter = useSolitoRouter();

  return useMemo(() => {
    return {
      ...solitoRouter,
      pop: () => {
        dispatch(StackActions.pop());
      },
      pathname: getPath(getState()),
      query: {} as ParsedUrlQuery,
      asPath: getPath(getState()),
    };
  }, [getState, solitoRouter, dispatch]);
}
