import { FallbackProps } from "app/components/error-boundary";

import { TabScrollView } from "design-system/tab-view";

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
