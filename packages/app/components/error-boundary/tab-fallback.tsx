import { TabScrollView } from "@showtime-xyz/universal.tab-view";

import { FallbackProps } from "app/components/error-boundary";

import { Fallback } from "./fallback";

type TabFallbackViewProps = FallbackProps & {
  index: number;
};
export function TabFallback({ index, ...rest }: TabFallbackViewProps) {
  return (
    <TabScrollView index={index}>
      <Fallback {...rest} />
    </TabScrollView>
  );
}
