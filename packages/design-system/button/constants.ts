import { colors } from "@showtime-xyz/universal.tailwind";

const CONTAINER_TW =
  "rounded-full flex-row justify-center items-center " +
  "disabled:opacity-40 disabled:cursor-not-allowed";

const CONTAINER_PADDING_TW = {
  small: "px-4 py-2",
  regular: "p-4",
};

const CONTAINER_ICON_PADDING_TW = {
  small: "px-1",
  regular: "p-3",
};

const CONTAINER_HEIGHT_TW = {
  small: "h-8",
  regular: "h-12",
};

const CONTAINER_BACKGROUND_MAPPER = {
  primary: {
    // default: [colors.gray[900], colors.white],
    default: "bg-gray-900 dark:bg-white",
    // pressed: [colors.gray[700], colors.gray[200]],
    pressed: "bg-gray-700 dark:bg-gray-200",
  },
  secondary: {
    // default: [colors.white, colors.black],
    default: "bg-white dark:bg-black",
    // pressed: [colors.gray[200], colors.gray[800]],
    pressed: "bg-gray-200 dark:bg-gray-800",
  },
  tertiary: {
    // default: [colors.gray[100], colors.gray[900]],
    default: "bg-gray-100 dark:bg-gray-900",
    // pressed: [colors.gray[300], colors.gray[700]],
    pressed: "bg-gray-300 dark:bg-gray-700",
  },
  danger: {
    // default: [colors.red[500], colors.red[500]],
    default: "bg-red-500 dark:bg-red-500",
    // pressed: [colors.red[700], colors.red[700]],
    pressed: "bg-red-700 dark:bg-red-700",
  },
  outlined: {
    default: "bg-transparent border border-gray-700 dark:border-gray-400",
    pressed: "bg-transparent border border-gray-700 dark:border-gray-400",
  },
};
const LABEL_SIZE_TW = {
  small: "text-xs",
  regular: "text-sm",
};

const LABEL_WEIGHT_TW = {
  small: "font-bold",
  regular: "font-semibold",
};

const ICON_SIZE_TW = {
  small: {
    width: 16,
    height: 16,
  },
  regular: {
    width: 20,
    height: 20,
  },
};

const ICON_COLOR_MAPPER = {
  primary: ["#FFF", colors.gray[900]],
  secondary: [colors.gray[900], "#FFF"],
  tertiary: [colors.gray[900], "#FFF"],
  danger: ["#FFF", "#FFF"],
  text: [colors.gray[900], "#FFF"],
  outlined: ["#FFF", colors.gray[900]],
};

const ACCENT_COLOR = ["white", "black"];
export {
  CONTAINER_TW,
  CONTAINER_PADDING_TW,
  CONTAINER_ICON_PADDING_TW,
  CONTAINER_HEIGHT_TW,
  CONTAINER_BACKGROUND_MAPPER,
  LABEL_SIZE_TW,
  LABEL_WEIGHT_TW,
  ICON_SIZE_TW,
  ICON_COLOR_MAPPER,
  ACCENT_COLOR,
};
