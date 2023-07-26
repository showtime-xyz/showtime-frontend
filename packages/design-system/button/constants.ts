import { colors } from "@showtime-xyz/universal.tailwind";

const CONTAINER_TW =
  "rounded-full flex-row justify-center items-center " +
  "disabled:opacity-40 disabled:cursor-not-allowed";

const CONTAINER_PADDING_TW = {
  small: "px-4 py-2",
  regular: "p-4",
};

const CONTAINER_ICON_PADDING_TW = {
  small: "px-2 w-8",
  regular: "p-3 w-12",
};

const CONTAINER_HEIGHT_TW = {
  small: "h-8",
  regular: "h-12",
};

const CONTAINER_BACKGROUND_MAPPER = {
  primary: {
    default: ["bg-gray-800", "bg-white"],
    pressed: ["bg-gray-700", "bg-gray-200"],
  },
  secondary: {
    default: ["bg-white", "bg-black"],
    pressed: ["bg-gray-200", "bg-gray-800"],
  },
  tertiary: {
    default: ["bg-gray-100", "bg-gray-800"],
    pressed: ["bg-gray-300", "bg-gray-700"],
  },
  danger: {
    default: ["bg-red-500", "bg-red-500"],
    pressed: ["bg-red-700", "bg-red-700"],
  },
  outlined: {
    default: [
      "bg-transparent border border-gray-700",
      "bg-transparent border border-gray-400",
    ],
    pressed: [
      "bg-transparent border border-gray-700",
      "bg-transparent border border-gray-400",
    ],
  },
};

const LABEL_SIZE_TW = {
  small: "text-sm",
  regular: "text-base",
};

const LABEL_WEIGHT_TW = {
  small: "font-semibold",
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
