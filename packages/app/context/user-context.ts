import { createContext } from "react";

import type { KeyedMutator } from "swr";

import type { UserType } from "../types";

type UserContextType = {
  user?: UserType;
  error?: Error;
  isLoading: boolean;
  isAuthenticated: boolean;
  mutate: KeyedMutator<UserType>;
};

export const UserContext = createContext<UserContextType | null>(null);
