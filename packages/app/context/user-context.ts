import { createContext } from "react";
import { UserType } from "../types";

type UserContextType = {
  user?: UserType;
  error?: Error;
  isLoading: boolean;
  isAuthenticated: boolean;
};

export const UserContext = createContext<UserContextType | null>(null);
