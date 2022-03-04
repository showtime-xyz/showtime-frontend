import { Platform } from "react-native";

const DEFAULT_WIDTH = Platform.select({
  web: "w-10/12 max-w-420px md:w-420px lg:w-420px",
  default: "w-12/12 max-w-480px md:w-480px lg:w-480px",
});
const DEFAULT_HEIGHT = "max-h-280px";

// tailwind classes
const CONTAINER_TW_BASE =
  "items-center absolute ios:absolute android:absolute top-0 right-0 bottom-0 left-0";
const CONTAINER_TW = Platform.select({
  web: `${CONTAINER_TW_BASE} justify-center`,
  android: `${CONTAINER_TW_BASE} justify-end`,
  ios: CONTAINER_TW_BASE,
});

const MODAL_TW_BASE =
  "flex overflow-hidden bg-white dark:bg-black shadow-lg shadow-black dark:shadow-white";
const MODAL_TW = Platform.select({
  web: `${MODAL_TW_BASE} rounded-[32px]`,
  ios: `flex-1 ${MODAL_TW_BASE}`,
  android: `${MODAL_TW_BASE} rounded-t-[32px]`,
});

const BODY_CONTAINER_TW_BASE = "bg-gray-100 dark:bg-gray-900";
const BODY_CONTAINER_TW = Platform.select({
  web: `flex-1 ${BODY_CONTAINER_TW_BASE}`,
  default: BODY_CONTAINER_TW_BASE,
});
const BODY_TW = "p-[16px]";

export {
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH,
  CONTAINER_TW,
  MODAL_TW,
  BODY_CONTAINER_TW,
  BODY_TW,
};
