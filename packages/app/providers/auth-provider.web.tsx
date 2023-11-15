import React from "react";

import { AuthProvider as AuthProviderBase } from "./auth-provider.tsx";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const handleDisconnect = () => {
    localStorage.removeItem("walletconnect");
  };

  return (
    <AuthProviderBase onWagmiDisconnect={handleDisconnect}>
      {children}
    </AuthProviderBase>
  );
}
