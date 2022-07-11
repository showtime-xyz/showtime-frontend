import { useState, useRef } from "react";
import { Platform } from "react-native";

import { createParam } from "app/navigation/use-param";

import { Route } from "design-system/tab-view/src/types";

const { useParam } = createParam();

type TabState = {
  params?: string;
  defaultIndex?: number;
};
export function useTabState<PageRef, T = Route>(
  routesProps: T[],
  props?: TabState
) {
  const defaultIndex = props?.defaultIndex ?? 0;

  const defaultParam = props?.params ?? "tab";
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Todo: Native use useParam hooks.
  const [index, setIndex] =
    Platform.OS === "web"
      ? // eslint-disable-next-line react-hooks/rules-of-hooks
        useParam(defaultParam, {
          parse: (v) => {
            // handling when params index is an illegal character, e.g.tab = 11,1a,abc
            const value = Number(v ?? defaultIndex)
              ? Number(v ?? defaultIndex)
              : 0;
            return value > routesProps.length || value < 0 ? 0 : value;
          },
          initial: defaultIndex,
        })
      : // eslint-disable-next-line react-hooks/rules-of-hooks
        useState(defaultIndex);
  const [routes, setRoute] = useState(routesProps);
  const tabRefs = useRef<PageRef[]>([]);
  const setTabRefs = (ref: PageRef) => {
    if (!ref) return;
    tabRefs.current[index] = ref;
  };
  return {
    index,
    setIndex,
    routes,
    setRoute,
    isRefreshing,
    setIsRefreshing,
    setTabRefs,
    currentTab: tabRefs.current[index] ?? undefined,
  };
}
