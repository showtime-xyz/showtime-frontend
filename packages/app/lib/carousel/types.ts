import type { TCarouselProps } from "react-native-reanimated-carousel";

export type CarouselProps = TCarouselProps & {
  pagination?: boolean;
  controller?: boolean;
  controllerTw?: string;
};
