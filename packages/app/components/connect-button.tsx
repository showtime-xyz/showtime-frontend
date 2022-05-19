import { ConnectButton as RainbotConnectButton } from "@rainbow-me/rainbowkit";

import { Button, View } from "design-system";

type ConnectButtonProps = {
  handleSubmitWallet: ({
    onOpenConnectModal,
  }: {
    onOpenConnectModal: () => void;
  }) => void;
};

export const ConnectButton = ({ handleSubmitWallet }: ConnectButtonProps) => {
  return (
    <RainbotConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        return (
          // @ts-ignore
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

              if (chain.unsupported) {
                return (
                  <Button
                    variant="primary"
                    size="regular"
                    onPress={() => {
                      openChainModal();
                    }}
                  >
                    Wrong network. Click to Change
                  </Button>
                );
              }

              return (
                <Button
                  variant="primary"
                  size="regular"
                  onPress={() => {
                    openAccountModal();
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
