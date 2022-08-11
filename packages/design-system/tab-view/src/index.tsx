import { TabView } from "react-native-tab-view-next";

import { createHeaderTabsComponent } from "./create-header-tabs";

export { TabFlatList, TabScrollView, TabSectionList } from "./scrollable-view";
export type {
  TabScrollViewProps,
  TabFlatListProps,
  TabSectionListProps,
} from "./scrollable-view";

export const HeaderTabViewComponent = createHeaderTabsComponent<any>(TabView);
