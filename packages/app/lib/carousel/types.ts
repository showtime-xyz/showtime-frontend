import type { TCarouselProps } from "react-native-reanimated-carousel";

export type CarouselProps = TCarouselProps & {
  pagination?: {
    variant: "dot" | "rectangle";
    tw?: string;
  };
  controller?: boolean;
  controllerTw?: string;
  effect?: "slide" | "fade";
  tw?: string;
};
