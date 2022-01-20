import { colors } from "design-system/tailwind/colors";
import { tw as tailwind } from "design-system/tailwind";

const CONTAINER_TW =
  "rounded-full flex-row justify-center items-center " +
  "disabled:opacity-40 disabled:cursor-not-allowed";

const CONTAINER_PADDING_TW = {
  small: "px-[16px] py-[8px]",
  regular: "p-[16px]",
};

const CONTAINER_ICON_PADDING_TW = {
  small: "px-[8px]",
  regular: "p-[14px]",
};

const CONTAINER_HEIGHT_TW = {
  small: "h-[32px]",
  regular: "h-[48px]",
};

const CONTAINER_BACKGROUND_MAPPER = {
  primary: {
    default: [colors.gray[900], colors.white],
    pressed: [colors.gray[700], colors.gray[200]],
  },
  secondary: {
    default: [colors.white, colors.black],
    pressed: [colors.gray[200], colors.gray[800]],
  },
  tertiary: {
    default: [colors.gray[100], colors.gray[900]],
    pressed: [colors.gray[300], colors.gray[700]],
  },
  danger: {
    default: [colors.red[500], colors.gray[300]],
    pressed: [colors.red[700], colors.gray[300]],
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

const ICON_COLOR_TW_MAPPER = {
  primary: ["white", colors.gray[900]],
  secondary: [colors.gray[900], "white"],
  tertiary: [colors.gray[900], "white"],
  danger: ["white", "white"],
};

export {
  CONTAINER_TW,
  CONTAINER_PADDING_TW,
  CONTAINER_ICON_PADDING_TW,
  CONTAINER_HEIGHT_TW,
  CONTAINER_BACKGROUND_MAPPER,
  LABEL_SIZE_TW,
  LABEL_WEIGHT_TW,
  ICON_SIZE_TW,
  ICON_COLOR_TW_MAPPER,
};
