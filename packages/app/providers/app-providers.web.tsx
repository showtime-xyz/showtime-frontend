import { GrowthBookProvider } from "@growthbook/growthbook-react";
import dynamic from "next/dynamic";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { BottomSheetModalProvider } from "@showtime-xyz/universal.bottom-sheet";
import { ColorSchemeProvider } from "@showtime-xyz/universal.color-scheme";
import { LightBoxProvider } from "@showtime-xyz/universal.light-box";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "@showtime-xyz/universal.safe-area";
import { SnackbarProvider } from "@showtime-xyz/universal.snackbar";

import { ReactionProvider } from "app/components/reaction/reaction-provider";
import { growthbook } from "app/lib/growthbook";
import { PrivyProvider } from "app/lib/privy/privy-provider";
import { NavigationProvider } from "app/navigation";
import { AuthProvider } from "app/providers/auth-provider";
import { ClaimProvider } from "app/providers/claim-provider";
import { DropProvider } from "app/providers/drop-provider";
import { FeedProvider } from "app/providers/feed-provider";
import { MagicProvider } from "app/providers/magic-provider.web";
import { MuteProvider } from "app/providers/mute-provider";
import { SWRProvider } from "app/providers/swr-provider";
import { UserProvider } from "app/providers/user-provider";
import { WalletProvider } from "app/providers/wallet-provider";
import { Web3Provider } from "app/providers/web3-provider";

const AlertProvider = dynamic(() => import("@showtime-xyz/universal.alert"), {
  ssr: false,
});

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <GestureHandlerRootView>
      <ReactionProvider>
        <MagicProvider>
          <ColorSchemeProvider>
            <SafeAreaProvider>
              <LightBoxProvider>
                <WalletProvider>
                  <AlertProvider>
                    <SnackbarProvider>
                      <SWRProvider>
                        <Web3Provider>
                          <AuthProvider>
                            <UserProvider>
                              <BottomSheetModalProvider>
                                <FeedProvider>
                                  <NavigationProvider>
                                    <MuteProvider>
                                      <ClaimProvider>
                                        <DropProvider>
                                          <PrivyProvider>
                                            {children}
                                          </PrivyProvider>
                                        </DropProvider>
                                      </ClaimProvider>
                                    </MuteProvider>
                                  </NavigationProvider>
                                </FeedProvider>
                              </BottomSheetModalProvider>
                            </UserProvider>
                          </AuthProvider>
                        </Web3Provider>
                      </SWRProvider>
                    </SnackbarProvider>
                  </AlertProvider>
                </WalletProvider>
              </LightBoxProvider>
            </SafeAreaProvider>
          </ColorSchemeProvider>
        </MagicProvider>
      </ReactionProvider>
    </GestureHandlerRootView>
  );
};
