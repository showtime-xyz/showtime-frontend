import { useMemo } from "react";
import useProfile from "./useProfile";

export const FLAGS = {
  hasMinting: "mint",
};

export const flagDefs = {
  [FLAGS.hasMinting]: (profile) => profile?.minting_enabled || false,
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
