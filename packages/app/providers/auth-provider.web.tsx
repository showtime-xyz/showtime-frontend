import React from "react";

import { useDisconnect } from "wagmi";

import { AuthProvider as AuthProviderBase } from "./auth-provider.tsx";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { disconnect } = useDisconnect();
  const handleDisconnect = () => {
    disconnect();
    localStorage.removeItem("walletconnect");
  };

  return (
    <AuthProviderBase onWagmiDisconnect={handleDisconnect}>
      {children}
    </AuthProviderBase>
  );
}
