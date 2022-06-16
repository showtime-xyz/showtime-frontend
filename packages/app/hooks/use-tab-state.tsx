import { useState, useRef } from "react";

import { createParam } from "app/navigation/use-param";

import { Route } from "design-system/tab-view/src/types";

type Query = {
  tab: number;
};
const { useParam } = createParam<Query>();

export function useTabState<PageRef>(routesProps: Route[]) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [index, setIndex] = useParam("tab", {
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
