import { useState, useRef } from "react";

import { createParam } from "app/navigation/use-param";

import { Route } from "design-system/tab-view/src/types";

const { useParam } = createParam();

export function useTabState<PageRef, T = Route>(
  routesProps: T[],
  params = "tab"
) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [index, setIndex] = useParam(params, {
    parse: (v) => Number(v ?? 0),
    initial: 0,
  });
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
