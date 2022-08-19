import { TabView } from "react-native-tab-view-next";

import { createHeaderTabsComponent } from "./create-header-tabs";

export { TabFlatList, TabScrollView, TabSectionList } from "./scrollable-view";
export * from "./create-header-tabs";
export * from "./scene";
export * from "./types";

export type {
  TabScrollViewProps,
  TabFlatListProps,
  TabSectionListProps,
} from "./scrollable-view";

export const HeaderTabView = createHeaderTabsComponent<any>(TabView);
