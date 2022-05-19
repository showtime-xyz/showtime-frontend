import { createContext, Dispatch } from "react";

import { defaultFilters } from "app/hooks/api-hooks";

export interface FillterActions {
  type: "collection_change" | "sort_change";
  payload: number | string;
}

export const FilterContext = createContext<{
  filter: typeof defaultFilters;
  dispatch: Dispatch<FillterActions>;
}>({
  filter: defaultFilters,
  dispatch: () => undefined,
});
