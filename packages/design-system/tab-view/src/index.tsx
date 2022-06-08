import { TabView } from "react-native-tab-view-next/src";

import { createHeaderTabsComponent } from "./create-header-tabs";
import { Route } from "./types";

export const HeaderTabViewComponent = createHeaderTabsComponent<Route>(TabView);
