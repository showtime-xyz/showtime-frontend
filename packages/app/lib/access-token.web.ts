const ACCESS_TOKEN_STRING = "access-token";

export function setAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_STRING, token);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_STRING);
}

export function deleteAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_STRING);
}

export function useAccessToken() {
  // TODO: implement a storage listener

  return getAccessToken();
}
