import { createContext } from "react";

import PagerView from "react-native-pager-view";
import { SharedValue } from "react-native-reanimated";

type FeedContextType = {
  selected: SharedValue<number>;
  pagerRef: React.MutableRefObject<PagerView | null>;
};

const FeedContext = createContext({} as FeedContextType);

export { FeedContext };
