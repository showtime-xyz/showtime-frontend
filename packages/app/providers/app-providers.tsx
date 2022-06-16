import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GrowthBookProvider } from "@growthbook/growthbook-react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { growthbook } from "app/lib/growthbook";
import { NavigationProvider } from "app/navigation";
import { AuthProvider } from "app/providers/auth-provider";
import { FeedProvider } from "app/providers/feed-provider";
import { MintProvider } from "app/providers/mint-provider";
import { SWRProvider } from "app/providers/swr-provider";
import { UserProvider } from "app/providers/user-provider";
import { WalletProvider } from "app/providers/wallet-provider";
import { Web3Provider } from "app/providers/web3-provider";

import { AlertProvider } from "design-system/alert";
import { SafeAreaProvider } from "design-system/safe-area";
import { SnackbarProvider } from "design-system/snackbar";
import { ToastProvider } from "design-system/toast";

// import { LightBoxProvider } from "design-system/light-box";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider style={{ backgroundColor: "black" }}>
        <WalletProvider>
          <Web3Provider>
            <ToastProvider>
              <AlertProvider>
                {/* <LightBoxProvider> */}
                <SnackbarProvider>
                  <NavigationProvider>
                    <SWRProvider>
                      <AuthProvider>
                        <UserProvider>
                          <BottomSheetModalProvider>
                            <GrowthBookProvider growthbook={growthbook}>
                              <FeedProvider>
                                <MintProvider>{children}</MintProvider>
                              </FeedProvider>
                            </GrowthBookProvider>
                          </BottomSheetModalProvider>
                        </UserProvider>
                      </AuthProvider>
                    </SWRProvider>
                  </NavigationProvider>
                </SnackbarProvider>
                {/* </LightBoxProvider> */}
              </AlertProvider>
            </ToastProvider>
          </Web3Provider>
        </WalletProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};
