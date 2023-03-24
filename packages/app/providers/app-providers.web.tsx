import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GrowthBookProvider } from "@growthbook/growthbook-react";

import { growthbook } from "app/lib/growthbook";
import { NavigationProvider } from "app/navigation";
import { AuthProvider } from "app/providers/auth-provider";
import { BiconomyProvider } from "app/providers/biconomy-provider";
import { ClaimProvider } from "app/providers/claim-provider";
import { DropProvider } from "app/providers/drop-provider";
import { FeedProvider } from "app/providers/feed-provider";
import { MagicProvider } from "app/providers/magic-provider.web";
import { MuteProvider } from "app/providers/mute-provider";
import { SWRProvider } from "app/providers/swr-provider";
import { UserProvider } from "app/providers/user-provider";
import { WalletProvider } from "app/providers/wallet-provider";
import { Web3Provider } from "app/providers/web3-provider";

import { AlertProvider } from "design-system/alert";
import { ColorSchemeProvider } from "design-system/color-scheme";
import { LightBoxProvider } from "design-system/light-box";
import { SafeAreaProvider } from "design-system/safe-area";
import { SnackbarProvider } from "design-system/snackbar";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
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
                            <GrowthBookProvider growthbook={growthbook}>
                              <FeedProvider>
                                <NavigationProvider>
                                  <BiconomyProvider>
                                    <MuteProvider>
                                      <ClaimProvider>
                                        <DropProvider>{children}</DropProvider>
                                      </ClaimProvider>
                                    </MuteProvider>
                                  </BiconomyProvider>
                                </NavigationProvider>
                              </FeedProvider>
                            </GrowthBookProvider>
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
  );
};
