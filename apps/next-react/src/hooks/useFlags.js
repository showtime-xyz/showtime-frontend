import { useMemo } from "react";
import useProfile from "./useProfile";
import { ENABLE_MAGIC_TX } from "@/lib/constants";

export const FLAGS = {
  hasMinting: "mint",
  enableMagicTX: "enableMagicTX",
};

export const flagDefs = {
  [FLAGS.hasMinting]: (profile) => profile?.minting_enabled || false,
  [FLAGS.enableMagicTX]: () => ENABLE_MAGIC_TX,
};

const useFlags = () => {
  const { myProfile } = useProfile();

  return {
    ...useMemo(
      () =>
        Object.fromEntries(
          Object.values(FLAGS).map((key) => [key, flagDefs[key](myProfile)])
        ),
      [myProfile]
    ),
    loading: !myProfile,
  };
};

export default useFlags;
