export function setLogout(logout: string) {
  localStorage.setItem("logout", logout);
}

export function getLogout() {
  return localStorage.getItem("logout");
}

export function deleteLogout() {
  localStorage.removeItem("logout");
}
