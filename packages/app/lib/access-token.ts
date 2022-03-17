import { useEffect, useState } from "react";

import { MMKV } from "react-native-mmkv";

const accessTokenStorage = new MMKV();
const ACCESS_TOKEN_STRING = "access-token";

export function setAccessToken(token: string) {
  accessTokenStorage.set(ACCESS_TOKEN_STRING, token);
}

export function getAccessToken() {
  return accessTokenStorage.getString(ACCESS_TOKEN_STRING);
}

export function deleteAccessToken() {
  accessTokenStorage.delete(ACCESS_TOKEN_STRING);
}

export function useAccessToken() {
  const [accessToken, setAccessToken] = useState(() => getAccessToken());

  useEffect(() => {
    const listener = accessTokenStorage.addOnValueChangedListener(
      (changedKey) => {
        if (changedKey === ACCESS_TOKEN_STRING) {
          const newValue = getAccessToken();
          setAccessToken(newValue);
        }
      }
    );
    return () => {
      listener.remove();
    };
  }, []);

  return accessToken;
}
