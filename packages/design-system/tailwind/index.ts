import {
  TailwindProvider,
  styled,
  useTailwind,
} from "tailwindcss-react-native";
import { create } from "twrnc";

const { colors } = require("./colors");
const tw = create(require("./tailwind.config.js"));

export { TailwindProvider, styled, useTailwind, tw, colors };
export { TW } from "./types";
