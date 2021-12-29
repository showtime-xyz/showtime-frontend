import { useEffect, useState } from "react";

const useStickyState = (key, defaultValue, serverValue) => {
  const [value, setValue] = useState(() => {
    if (typeof window == "undefined") return serverValue ?? defaultValue;

    const stickyValue = window.localStorage.getItem(key);

    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export default useStickyState;
