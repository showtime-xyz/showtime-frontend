import { useWindowDimensions } from "react-native";

import { ConnectButton as RainbotConnectButton } from "@rainbow-me/rainbowkit";

import { Button, View } from "design-system";
import { useIsDarkMode } from "design-system/hooks";
import { Alert } from "design-system/icon";

type ConnectButtonProps = {
  handleSubmitWallet: ({
    onOpenConnectModal,
  }: {
    onOpenConnectModal: () => void;
  }) => void;
};

export const NetworkButton = () => {
  const { width } = useWindowDimensions();
  const isDark = useIsDarkMode();
  const isMobileWeb = width > 768;

  return (
    <RainbotConnectButton.Custom>
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
    </RainbotConnectButton.Custom>
  );
};

export const ConnectButton = ({ handleSubmitWallet }: ConnectButtonProps) => {
  return (
    <RainbotConnectButton.Custom>
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
                  <Button
                    variant="primary"
                    size="regular"
                    onPress={() => {
                      handleSubmitWallet({
                        onOpenConnectModal: openConnectModal,
                      });
                    }}
                  >
                    Connect Wallet
                  </Button>
                );
              }

              return (
                <Button
                  variant="primary"
                  size="regular"
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
    </RainbotConnectButton.Custom>
  );
};
