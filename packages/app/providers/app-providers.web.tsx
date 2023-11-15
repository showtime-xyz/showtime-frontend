import { GrowthBookProvider } from "@growthbook/growthbook-react";
import dynamic from "next/dynamic";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { BottomSheetModalProvider } from "@showtime-xyz/universal.bottom-sheet";
import { ColorSchemeProvider } from "@showtime-xyz/universal.color-scheme";
import { LightBoxProvider } from "@showtime-xyz/universal.light-box";
import { SafeAreaProvider } from "@showtime-xyz/universal.safe-area";
import { SnackbarProvider } from "@showtime-xyz/universal.snackbar";

import { ReactionProvider } from "app/components/reaction/reaction-provider";
import { growthbook } from "app/lib/growthbook";
import { PrivyAuth, PrivyProvider } from "app/lib/privy/privy-provider";
import { NavigationProvider } from "app/navigation";
import { AuthProvider } from "app/providers/auth-provider";
import { MagicProvider } from "app/providers/magic-provider.web";
import { SWRProvider } from "app/providers/swr-provider";
import { UserProvider } from "app/providers/user-provider";

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
                <AlertProvider>
                  <SnackbarProvider>
                    <SWRProvider>
                      <PrivyProvider>
                        <AuthProvider>
                          <UserProvider>
                            <BottomSheetModalProvider>
                              <NavigationProvider>
                                <PrivyAuth>{children}</PrivyAuth>
                              </NavigationProvider>
                            </BottomSheetModalProvider>
                          </UserProvider>
                        </AuthProvider>
                      </PrivyProvider>
                    </SWRProvider>
                  </SnackbarProvider>
                </AlertProvider>
              </LightBoxProvider>
            </SafeAreaProvider>
          </ColorSchemeProvider>
        </MagicProvider>
      </ReactionProvider>
    </GestureHandlerRootView>
  );
};
