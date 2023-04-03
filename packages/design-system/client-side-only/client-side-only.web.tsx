import { useEffect, useState } from "react";

export const ClientSideOnly = ({ children }: any) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? children : false;
};
