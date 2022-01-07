export function setLogin(login: string) {
  localStorage.setItem("login", login);
}

export function getLogin() {
  return localStorage.getItem("login");
}

export function deleteLogin() {
  localStorage.removeItem("login");
}
