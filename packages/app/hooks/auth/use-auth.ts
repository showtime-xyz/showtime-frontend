import { useContext } from "react";

import { AuthContext } from "app/context/auth-context";

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw "You need to add `AuthProvider` to your root component";
  }

  return context;
}
