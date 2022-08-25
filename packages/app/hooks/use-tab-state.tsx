import { useState, useRef } from "react";
import { Platform } from "react-native";

import { Route } from "@showtime-xyz/universal.tab-view";

import { createParam } from "app/navigation/use-param";

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
  const [index, setIndex] = Platform.select({
    web: useParam(defaultParam, {
      parse: (v) => {
        // handling when params index is an illegal character, e.g.tab = 11,1a,abc
        const value = Number(v ?? defaultIndex) ? Number(v ?? defaultIndex) : 0;
        return value > routesProps.length || value < 0 ? 0 : value;
      },
      initial: defaultIndex,
    }),
    default: useState(defaultIndex),
  });
  const [routes, setRoute] = useState(routesProps);
  const tabRefs = useRef<PageRef[] | null[]>([]);

  return {
    index,
    setIndex,
    routes,
    setRoute,
    isRefreshing,
    setIsRefreshing,
    currentTab: tabRefs.current[index] ?? undefined,
    tabRefs,
  };
}
