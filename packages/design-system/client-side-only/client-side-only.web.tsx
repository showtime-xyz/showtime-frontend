import { useState } from "react";

export const ClientSideOnly = ({ children }: any) => {
  const [clientSide, setClientSide] = useState(false);
  if (typeof window !== "undefined" && clientSide === false) {
    setClientSide(true);
  }

  return clientSide ? children : false;
};
