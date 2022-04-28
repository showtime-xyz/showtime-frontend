import { Platform } from "react-native";

import type { createIosMenu as ios } from "./index.ios";

export const createIosMenu: typeof ios = () => {
  throw new Error("createIosMenu is not implemented on " + Platform.OS);
};
