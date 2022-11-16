import { useWindowDimensions } from "react-native";

import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Alert } from "@showtime-xyz/universal.icon";
import { View } from "@showtime-xyz/universal.view";

import { LoginButton } from "app/components/login/login-button";

import { ConnectButtonProps } from "./connect-button";

export const NetworkButton = () => {
  const { width } = useWindowDimensions();
  const isDark = useIsDarkMode();
  const isMobileWeb = width > 768;

  return (
    <RainbowConnectButton.Custom>
      {({ chain, openChainModal }) => {
        return chain?.unsupported ? (
          <View tw="ml-2">
            <Button
              variant="primary"
              size="regular"
              tw={isMobileWeb ? "" : "h-8 w-8 p-1"}
              onPress={() => {
                openChainModal();
              }}
            >
              {isMobileWeb ? (
                "Wrong Network"
              ) : (
                <Alert
                  width={24}
                  height={24}
                  color={isDark ? "black" : "white"}
                />
              )}
            </Button>
          </View>
        ) : null;
      }}
    </RainbowConnectButton.Custom>
  );
};

export const ConnectButton = ({ handleSubmitWallet }: ConnectButtonProps) => {
  return (
    <RainbowConnectButton.Custom>
      {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
        return (
          <View
            {...(!mounted && {
              "aria-hidden": true,
              tw: "opacity-0 pointer-events-none select-none",
            })}
          >
            {(() => {
              if (!mounted || !account || !chain) {
                return (
                  <LoginButton
                    onPress={() => {
                      handleSubmitWallet({
                        onOpenConnectModal: openConnectModal,
                      });
                    }}
                    type="wallet"
                  />
                );
              }

              return (
                <Button
                  variant="primary"
                  size="regular"
                  tw="my-4"
                  onPress={() => {
                    handleSubmitWallet({
                      onOpenConnectModal: openAccountModal,
                    });
                  }}
                >
                  <>
                    {chain.hasIcon && chain.iconUrl ? (
                      <View
                        tw={`bg-[${chain.iconBackground}] mr-4 h-8 w-8 overflow-hidden rounded-full`}
                      >
                        <img
                          alt={chain.name ?? "Chain icon"}
                          src={chain.iconUrl}
                          style={{ width: 32, height: 32 }}
                        />
                      </View>
                    ) : null}
                  </>
                  {account.displayName}
                  {account.displayBalance ? ` (${account.displayBalance})` : ""}
                </Button>
              );
            })()}
          </View>
        );
      }}
    </RainbowConnectButton.Custom>
  );
};
