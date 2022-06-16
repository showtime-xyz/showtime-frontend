import { useState, useRef } from "react";

import { Route } from "@showtime-xyz/universal.tab-view/src/types";

import { createParam } from "app/navigation/use-param";

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
