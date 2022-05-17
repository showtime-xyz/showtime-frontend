import { useMemo } from "react";

import {
  apiProvider,
  configureChains,
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { chain, createClient, WagmiProvider } from "wagmi";

import { useIsDarkMode } from "design-system/hooks";

const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
  [apiProvider.alchemy(process.env.ALCHEMY_ID), apiProvider.fallback()]
);

const { connectors } = getDefaultWallets({
  appName: "Showtime",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export const WalletProvider = ({ children }) => {
  const isDark = useIsDarkMode();

  const rainbowTheme = useMemo(
    () =>
      isDark
        ? darkTheme({
            accentColor: "white",
            accentColorForeground: "black",
          })
        : lightTheme({
            accentColor: "black",
            accentColorForeground: "white",
          }),
    [isDark]
  );

  return (
    <WagmiProvider client={wagmiClient}>
      <RainbowKitProvider theme={rainbowTheme} chains={chains}>
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
};
