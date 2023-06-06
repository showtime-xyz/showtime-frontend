import { GrowthBookProvider } from "@growthbook/growthbook-react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AlertProvider } from "@showtime-xyz/universal.alert";
import { BottomSheetModalProvider } from "@showtime-xyz/universal.bottom-sheet";
import { ColorSchemeProvider } from "@showtime-xyz/universal.color-scheme";
import { LightBoxProvider } from "@showtime-xyz/universal.light-box";
import { SafeAreaProvider } from "@showtime-xyz/universal.safe-area";
import { SnackbarProvider } from "@showtime-xyz/universal.snackbar";

import { ReactionProvider } from "app/components/reaction/reaction-provider";
import { growthbook } from "app/lib/growthbook";
import { KeyboardProvider } from "app/lib/keyboard-controller";
import { NavigationProvider } from "app/navigation";
import { AuthProvider } from "app/providers/auth-provider";
import { ClaimProvider } from "app/providers/claim-provider";
import { DropProvider } from "app/providers/drop-provider";
import { FeedProvider } from "app/providers/feed-provider";
import { MuteProvider } from "app/providers/mute-provider";
import { SWRProvider } from "app/providers/swr-provider";
import { UserProvider } from "app/providers/user-provider";
import { WalletMobileSDKProvider } from "app/providers/wallet-mobile-sdk-provider";
import { WalletProvider } from "app/providers/wallet-provider";
import { Web3Provider } from "app/providers/web3-provider";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ColorSchemeProvider>
      <ReactionProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <KeyboardProvider statusBarTranslucent>
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
                                        <MuteProvider>
                                          <ClaimProvider>
                                            <DropProvider>
                                              {children}
                                            </DropProvider>
                                          </ClaimProvider>
                                        </MuteProvider>
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
          </KeyboardProvider>
        </GestureHandlerRootView>
      </ReactionProvider>
    </ColorSchemeProvider>
  );
};
