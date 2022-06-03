import { useState } from "react";

import { createParam } from "app/navigation/use-param";

import { Route } from "./src/types";

type Query = {
  tab: number;
};
const { useParam } = createParam<Query>();

export const useTabState = (routesProps: Route[]) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [index, setIndex] = useParam("tab", {
    parse: (v) => Number(v ?? 0),
    initial: 0,
  });
  const [routes, setRoute] = useState(routesProps);
  return { index, setIndex, routes, setRoute, isRefreshing, setIsRefreshing };
};
