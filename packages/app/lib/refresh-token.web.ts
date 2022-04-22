import { useEffect, useState } from "react";

const REFRESH_TOKEN_STRING = "access-token";
let listeners: any = [];

export function setRefreshToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(REFRESH_TOKEN_STRING, token);
    listeners.forEach((listener: any) => listener(token));
  }
}

export function getRefreshToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem(REFRESH_TOKEN_STRING);
  }
}

export function deleteRefreshToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(REFRESH_TOKEN_STRING);
  }
}

export function useRefreshToken() {
  const [, setCount] = useState(0);
  useEffect(() => {
    const callback = () => {
      setCount((c) => c + 1);
    };
    listeners.push(callback);
    return () => {
      listeners = listeners.filter((l: any) => l !== callback);
    };
  }, []);

  return getRefreshToken();
}
