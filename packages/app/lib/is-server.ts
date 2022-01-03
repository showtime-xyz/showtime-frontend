import { Platform } from "react-native";

export const isServer = Platform.OS === "web" && typeof window === "undefined";
