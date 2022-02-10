import { createContext } from "react";

import type { AuthenticationStatus } from "../types";

type AuthContextType = {
  authenticationStatus: AuthenticationStatus;
  accessToken?: string;

  setAuthenticationStatus: (status: AuthenticationStatus) => void;

  login: (endpoint: string, payload: object) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);
