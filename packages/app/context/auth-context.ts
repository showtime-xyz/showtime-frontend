import { createContext } from "react";

import type { AuthenticationStatus, MyInfo } from "app/types";

type AuthContextType = {
  authenticationStatus: AuthenticationStatus;
  accessToken?: string;

  setAuthenticationStatus: (status: AuthenticationStatus) => void;

  login: (endpoint: string, payload: object) => Promise<MyInfo>;
  logout: () => Promise<void>;

  authStateRef: React.MutableRefObject<{
    isAuthenticated: boolean;
    isIncompletedProfile: boolean | undefined;
  }>;
};

export const AuthContext = createContext<AuthContextType | null>(null);
