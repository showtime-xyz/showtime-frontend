import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AlertProvider } from "@showtime-xyz/universal.alert";
import { BottomSheetModalProvider } from "@showtime-xyz/universal.bottom-sheet";
import { ColorSchemeProvider } from "@showtime-xyz/universal.color-scheme";
import { LightBoxProvider } from "@showtime-xyz/universal.light-box";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "@showtime-xyz/universal.safe-area";
import { SnackbarProvider } from "@showtime-xyz/universal.snackbar";

import { ReactionProvider } from "app/components/reaction/reaction-provider";
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

import { WalletProvider } from "./wallet-provider";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <GestureHandlerRootView style={{ flexGrow: 1 }}>
      <KeyboardProvider statusBarTranslucent>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <ColorSchemeProvider>
            <ReactionProvider>
              <WalletMobileSDKProvider>
                <WalletProvider>
                  <AlertProvider>
                    <LightBoxProvider>
                      <SnackbarProvider>
                        <NavigationProvider>
                          <SWRProvider>
                            <AuthProvider>
                              <UserProvider>
                                <BottomSheetModalProvider>
                                  {/* @ts-ignore */}
                                  <FeedProvider>
                                    <MuteProvider>
                                      <ClaimProvider>
                                        <DropProvider>{children}</DropProvider>
                                      </ClaimProvider>
                                    </MuteProvider>
                                  </FeedProvider>
                                </BottomSheetModalProvider>
                              </UserProvider>
                            </AuthProvider>
                          </SWRProvider>
                        </NavigationProvider>
                      </SnackbarProvider>
                    </LightBoxProvider>
                  </AlertProvider>
                </WalletProvider>
              </WalletMobileSDKProvider>
            </ReactionProvider>
          </ColorSchemeProvider>
        </SafeAreaProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
};
