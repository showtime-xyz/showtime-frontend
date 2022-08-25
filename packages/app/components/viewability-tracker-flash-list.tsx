import { FlashList } from "@shopify/flash-list";

import { withViewabilityInfiniteScrollList } from "app/hoc/with-viewability-infinite-scroll-list";

export const ViewabilityTrackerFlashList =
  withViewabilityInfiniteScrollList(FlashList);
