import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("screen");

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

export const MIN_VELOCITY_Y_TO_ACTIVATE = 100;

export const SPRING_CONFIG = {
  damping: 500,
  stiffness: 1000,
  mass: 3,
  overshootClamping: true,
  restDisplacementThreshold: 10,
  restSpeedThreshold: 10,
};

export const SNAP_POINTS_HORIZONTAL = {
  ORIGIN: 0,
  FIRST_PAGE_HALF: SCREEN_WIDTH / -2,
  SECOND_PAGE: SCREEN_WIDTH * -1,
  SECOND_PAGE_HALF: (SCREEN_WIDTH * -3) / 2,
};

export const SNAP_POINTS_HORIZONTAL_AS_ARRAY = [
  0,
  SCREEN_WIDTH / -2,
  SCREEN_WIDTH * -1,
  (SCREEN_WIDTH * -3) / 2,
  SCREEN_WIDTH * -2,
];
