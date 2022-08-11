import { TabView } from "react-native-tab-view-next/src";

import { createHeaderTabsComponent } from "./create-header-tabs";

export * from "./scrollable-view";

export const HeaderTabViewComponent = createHeaderTabsComponent<any>(TabView);
