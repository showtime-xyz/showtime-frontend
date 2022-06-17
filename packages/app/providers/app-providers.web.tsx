import { useState, useEffect } from "react";
import { Platform } from "react-native";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GrowthBookProvider } from "@growthbook/growthbook-react";

import { AlertProvider } from "@showtime-xyz/universal.alert";
import { SafeAreaProvider } from "@showtime-xyz/universal.safe-area";
import { SnackbarProvider } from "@showtime-xyz/universal.snackbar";
import { ToastProvider } from "@showtime-xyz/universal.toast";

import { growthbook } from "app/lib/growthbook";
import { NavigationProvider } from "app/navigation";
import { AuthProvider } from "app/providers/auth-provider";
import { FeedProvider } from "app/providers/feed-provider";
import { MintProvider } from "app/providers/mint-provider";
import { SWRProvider } from "app/providers/swr-provider";
import { UserProvider } from "app/providers/user-provider";
import { WalletProvider } from "app/providers/wallet-provider";
import { Web3Provider } from "app/providers/web3-provider";

import { ThemeProvider } from "./theme-provider";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <ToastProvider>
          <WalletProvider>
            <AlertProvider>
              <SnackbarProvider>
                <SWRProvider>
                  <Web3Provider>
                    <AuthProvider>
                      <UserProvider>
                        <CSROnly>
                          <BottomSheetModalProvider>
                            <GrowthBookProvider growthbook={growthbook}>
                              <FeedProvider>
                                <NavigationProvider>
                                  <MintProvider>{children}</MintProvider>
                                </NavigationProvider>
                              </FeedProvider>
                            </GrowthBookProvider>
                          </BottomSheetModalProvider>
                        </CSROnly>
                      </UserProvider>
                    </AuthProvider>
                  </Web3Provider>
                </SWRProvider>
              </SnackbarProvider>
            </AlertProvider>
          </WalletProvider>
        </ToastProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
};

// TODO: remove CSR after replacing to css tailwind
const CSROnly = ({ children }: any) => {
  const [ready, setReady] = useState(() => {
    if (Platform.OS !== "web") {
      return true;
    }
    return false;
  });

  useEffect(() => {
    setReady(true);
  }, []);

  if (ready) return children;

  return null;
};
