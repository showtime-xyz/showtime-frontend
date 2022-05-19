import { useMemo, useState, useEffect, Fragment } from "react";
import { Platform } from "react-native";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GrowthBookProvider } from "@growthbook/growthbook-react";

import { AppContext } from "app/context/app-context";
import useColorScheme from "app/hooks/use-color-scheme";
import { growthbook } from "app/lib/growthbook";
import { SafeAreaProvider } from "app/lib/safe-area";
import { NavigationProvider } from "app/navigation";
import { AuthProvider } from "app/providers/auth-provider";
import { FeedProvider } from "app/providers/feed-provider";
import { MintProvider } from "app/providers/mint-provider";
import { SWRProvider } from "app/providers/swr-provider";
import { UserProvider } from "app/providers/user-provider";
import { WalletProvider } from "app/providers/wallet-provider";
import { Web3Provider } from "app/providers/web3-provider";

import { AlertProvider } from "design-system/alert";
import { SnackbarProvider } from "design-system/snackbar";
import { tw } from "design-system/tailwind";
import { ToastProvider } from "design-system/toast";

export const AppProvider = ({ children }) => {
  const { injectedGlobalColorContext } = useColorScheme();
  const isWeb = Platform.OS === "web";

  const safeAreaProviderStyles = useMemo(
    () => (isWeb ? tw.style("bg-black") : {}),
    [isWeb]
  );

  const CSRProvider = useMemo(() => (isWeb ? CSROnly : Fragment), [isWeb]);

  return (
    <SafeAreaProvider style={safeAreaProviderStyles}>
      <ToastProvider>
        <AlertProvider>
          <SnackbarProvider>
            <NavigationProvider>
              <SWRProvider>
                <WalletProvider>
                  <Web3Provider>
                    <AppContext.Provider value={injectedGlobalColorContext}>
                      <AuthProvider>
                        <UserProvider>
                          <CSRProvider>
                            <BottomSheetModalProvider>
                              <GrowthBookProvider growthbook={growthbook}>
                                <FeedProvider>
                                  <MintProvider>{children}</MintProvider>
                                </FeedProvider>
                              </GrowthBookProvider>
                            </BottomSheetModalProvider>
                          </CSRProvider>
                        </UserProvider>
                      </AuthProvider>
                    </AppContext.Provider>
                  </Web3Provider>
                </WalletProvider>
              </SWRProvider>
            </NavigationProvider>
          </SnackbarProvider>
        </AlertProvider>
      </ToastProvider>
    </SafeAreaProvider>
  );
};

/**
 * TODO: This will wait the tailwind-react-native transition.
 * See: https://github.com/showtime-xyz/showtime-frontend/pull/1119
 */
const CSROnly = ({ children }: any) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (ready) return children;

  return null;
};
