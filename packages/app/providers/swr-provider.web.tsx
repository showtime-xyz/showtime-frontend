import { SWRConfig } from "swr";

import { useToast } from "@showtime-xyz/universal.toast";

import { useAccessTokenManager } from "app/hooks/auth/use-access-token-manager";
import { isServer } from "app/lib/is-server";

const localStorageProvider = () => {
  // @ts-ignore
  const map = new Map(JSON.parse(localStorage.getItem("app-cache")) || []);

  window.addEventListener("beforeunload", () => {
    const appCache = JSON.stringify(Array.from(map.entries()));
    localStorage.setItem("app-cache", appCache);
  });

  return map;
};

export const SWRProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const toast = useToast();
  const { refreshTokens } = useAccessTokenManager();

  return (
    <SWRConfig
      value={{
        provider: isServer ? () => new Map() : localStorageProvider,
      }}
    >
      {children}
    </SWRConfig>
  );
};
