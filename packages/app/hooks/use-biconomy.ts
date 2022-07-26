import { useContext } from "react";

import { BiconomyContext } from "app/providers/biconomy-provider";

export const useBiconomy = () => {
  return useContext(BiconomyContext);
};
