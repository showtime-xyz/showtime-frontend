import { useEffect, useState } from "react";

import { MMKV } from "react-native-mmkv";

const refreshTokenStorage = new MMKV();
const REFRESH_TOKEN_KEY = "refresh-token";

export function setRefreshToken(token: string) {
  return refreshTokenStorage.set(REFRESH_TOKEN_KEY, token);
}

export function getRefreshToken() {
  return refreshTokenStorage.getString(REFRESH_TOKEN_KEY);
}

export function deleteRefreshToken() {
  return refreshTokenStorage.delete(REFRESH_TOKEN_KEY);
}

export function useRefreshToken() {
  const [refreshToken, setRefreshToken] = useState(() => getRefreshToken());

  useEffect(() => {
    const listener = refreshTokenStorage.addOnValueChangedListener(
      (changedKey) => {
        if (changedKey === REFRESH_TOKEN_KEY) {
          const newValue = getRefreshToken();
          setRefreshToken(newValue);
        }
      }
    );
    return () => {
      listener.remove();
    };
  }, []);

  return refreshToken;
}
