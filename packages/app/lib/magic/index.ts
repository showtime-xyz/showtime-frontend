import { Magic } from "@magic-sdk/react-native";

const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY);
const Relayer = magic.Relayer;

export { Magic, Relayer };
