import { useContext } from "react";

import { UserContext } from "app/context/user-context";

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw "You need to add `UserProvider` to your root component";
  }

  return context;
}
