import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GrowthBookProvider } from "@growthbook/growthbook-react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { growthbook } from "app/lib/growthbook";
import { NavigationProvider } from "app/navigation";
import { AuthProvider } from "app/providers/auth-provider";
import { BiconomyProvider } from "app/providers/biconomy-provider";
import { ClaimProvider } from "app/providers/claim-provider";
import { DropProvider } from "app/providers/drop-provider";
import { FeedProvider } from "app/providers/feed-provider";
import { MuteProvider } from "app/providers/mute-provider";
import { SWRProvider } from "app/providers/swr-provider";
import { UserProvider } from "app/providers/user-provider";
import { WalletMobileSDKProvider } from "app/providers/wallet-mobile-sdk-provider";
import { WalletProvider } from "app/providers/wallet-provider";
import { Web3Provider } from "app/providers/web3-provider";

import { AlertProvider } from "design-system/alert";
import { ColorSchemeProvider } from "design-system/color-scheme";
import { LightBoxProvider } from "design-system/light-box";
import { SafeAreaProvider } from "design-system/safe-area";
import { SnackbarProvider } from "design-system/snackbar";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ColorSchemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider style={{ backgroundColor: "black" }}>
          <WalletMobileSDKProvider>
            <WalletProvider>
              <Web3Provider>
                <AlertProvider>
                  <LightBoxProvider>
                    <SnackbarProvider>
                      <NavigationProvider>
                        <SWRProvider>
                          <AuthProvider>
                            <UserProvider>
                              <BottomSheetModalProvider>
                                {/* @ts-ignore */}
                                <GrowthBookProvider growthbook={growthbook}>
                                  <FeedProvider>
                                    <BiconomyProvider>
                                      <MuteProvider>
                                        <ClaimProvider>
                                          <DropProvider>
                                            {children}
                                          </DropProvider>
                                        </ClaimProvider>
                                      </MuteProvider>
                                    </BiconomyProvider>
                                  </FeedProvider>
                                </GrowthBookProvider>
                              </BottomSheetModalProvider>
                            </UserProvider>
                          </AuthProvider>
                        </SWRProvider>
                      </NavigationProvider>
                    </SnackbarProvider>
                  </LightBoxProvider>
                </AlertProvider>
              </Web3Provider>
            </WalletProvider>
          </WalletMobileSDKProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ColorSchemeProvider>
  );
};
