import { TabView } from "react-native-tab-view-next";

import { createCollapsibleTabsComponent } from "./create-collapsible-tabs";

export { TabFlatList, TabScrollView, TabSectionList } from "./scrollable-view";

export * from "./create-collapsible-tabs";
export * from "./scene";
export * from "./types";
export type {
  TabScrollViewProps,
  TabFlatListProps,
  TabSectionListProps,
} from "./scrollable-view";
export { useHeaderTabContext } from "./context";
export const CollapsibleTabView = createCollapsibleTabsComponent<any>(TabView);
