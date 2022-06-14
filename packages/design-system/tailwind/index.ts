import {
  TailwindProvider,
  styled,
  useTailwind,
} from "tailwindcss-react-native";
import { create } from "twrnc";

const tw = create(require("./tailwind.config.js"));

export { tw };
export { TailwindProvider, styled, useTailwind };

export { TW } from "./types";
export { colors } from "./colors";
