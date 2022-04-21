import { useEffect, useState } from "react";

const ACCESS_TOKEN_STRING = "access-token";
let listeners: any = [];

export function setAccessToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(ACCESS_TOKEN_STRING, token);
    listeners.forEach((listener: any) => listener(token));
  }
}

export function getAccessToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem(ACCESS_TOKEN_STRING);
  }
}

export function deleteAccessToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ACCESS_TOKEN_STRING);
  }
}

export function useAccessToken() {
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

  return getAccessToken();
}
