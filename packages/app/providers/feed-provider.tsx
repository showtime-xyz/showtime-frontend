import { ReactNode, useRef } from "react";

import PagerView from "react-native-pager-view";
import { useSharedValue } from "react-native-reanimated";

import { FeedContext } from "app/context/feed-context";

type FeedProviderProps = {
  children: ReactNode;
};

export function FeedProvider({ children }: FeedProviderProps) {
  const selected = useSharedValue(1);
  const pagerRef = useRef<PagerView>(null);

  return (
    <FeedContext.Provider value={{ selected, pagerRef }}>
      {children}
    </FeedContext.Provider>
  );
}
