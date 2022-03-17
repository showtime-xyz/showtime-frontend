import { useHandler, useEvent } from "react-native-reanimated";

export function usePageScrollHandler(handlers: any, dependencies?: any) {
  const { context, doDependenciesDiffer } = useHandler(handlers, dependencies);
  const subscribeForEvents = ["onPageScroll"];
  return useEvent(
    (event) => {
      "worklet";
      const { onPageScroll } = handlers;
      //@ts-ignore
      if (onPageScroll && event.eventName.endsWith("onPageScroll")) {
        onPageScroll(event, context);
      }
    },
    subscribeForEvents,
    doDependenciesDiffer
  );
}
