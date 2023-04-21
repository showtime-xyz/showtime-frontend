import { useState } from "react";

import { useIsomorphicLayoutEffect } from "app/hooks/use-isomorphic-layout-effect";

export const ClientSideOnly = ({ children }: any) => {
  const [clientSide, setClientSide] = useState(false);
  if (typeof window !== "undefined" && clientSide === false) {
    setClientSide(true);
  }

  return clientSide ? children : false;
};
