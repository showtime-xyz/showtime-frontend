import { useContext } from "react";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { Button } from "@showtime-xyz/universal.button";
import {
  Badge,
  InformationCircle,
  LockBadge,
} from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { UserContext } from "app/context/user-context";
import { useWallet } from "app/hooks/use-wallet";
import { useWalletBalance } from "app/hooks/use-wallet-balance";
import { useWeb3 } from "app/hooks/use-web3";
import { useNavigateToBuy } from "app/navigation/use-navigate-to";

export const BuyCreatorToken = () => {
  const user = useContext(UserContext);
  const navigateToBuy = useNavigateToBuy();
  const wallet = useWallet();
  const isWeb3Wallet = useWeb3();
  const renderBuyButton = () => {
    if (wallet.isMagicWallet) {
      return (
        <Button
          onPress={() => {
            wallet.connect();
          }}
        >
          Connect
        </Button>
      );
    } else {
      return (
        <Button
          onPress={() => {
            if (wallet.address) {
              wallet.getBalance(wallet.address).then((balance) => {
                console.log("balance ", balance);
              });
            }
          }}
        >
          Buy
        </Button>
      );
    }
  };

  return (
    <View tw="p-4">
      <View tw="flex-row items-center" style={{ columnGap: 8 }}>
        <View tw="flex-row items-center" style={{ columnGap: 2 }}>
          <Text tw="text-2xl font-semibold">Buy @itsvalentinacy</Text>
          <VerificationBadge size={20} />
        </View>
        <Text tw="text-2xl font-semibold">tokens</Text>
      </View>
      <View tw="flex-row items-center pt-4" style={{ columnGap: 2 }}>
        <LockBadge width={14} height={14} color={colors.black} />
        <Text tw="text-gray-600">Unlocks exclusive channel content</Text>
      </View>
      <View tw="mt-4 rounded-3xl border-[1px] border-gray-300 p-8">
        <View tw="flex-row" style={{ columnGap: 16 }}>
          <Avatar
            size={100}
            url="https://lh3.googleusercontent.com/AEnH2_JXVpF55uZc0WWhws48yF2TXccF5HbCrz7BXfmPgQQFMr_gDBsQHY6Y5zXT7T_OLz6pQpdr9BML3oIGfUqzI989xPrr3AN4"
          />
          <View style={{ rowGap: 16 }}>
            <View tw="flex-row" style={{ columnGap: 8 }}>
              <View tw="items-start self-start rounded-sm bg-black px-2">
                <Text tw="text-white">USDC</Text>
              </View>
              <View tw="items-start self-start rounded-sm bg-blue-200 px-2">
                <Text>ETH</Text>
              </View>
            </View>
            <View>
              <Text tw="text-4xl font-semibold">21.67</Text>
            </View>
            <View>
              <Text tw="font-semibold text-green-500">^ $2.49 (25%) Month</Text>
            </View>
          </View>
        </View>
        <View
          tw="mt-4 flex-row items-center justify-between"
          style={{ columnGap: 16 }}
        >
          <Button tw="flex-1" style={{ backgroundColor: colors.cyan[400] }}>
            <Text style={{ color: colors.black }}>Buy</Text>
          </Button>
          <Button tw="flex-1" style={{ backgroundColor: colors.blue[200] }}>
            <Text style={{ color: colors.black }}>Sell</Text>
          </Button>
          <View>
            <InformationCircle color={colors.blue[300]} />
          </View>
        </View>
      </View>
      <View style={{ rowGap: 16 }} tw="mt-8">
        <View tw="flex-row justify-between">
          <Text tw="text-gray-700">You own:</Text>
          <Text tw="text-gray-700">0</Text>
        </View>
        <View tw="flex-row items-center">
          <Text tw="flex-2 text-gray-700">Quantity to buy:</Text>
          <View tw="w-4" />
          <View tw="flex-1 flex-row rounded-sm border-[1px] border-gray-200">
            <View tw="flex-1 items-center border-gray-200 p-4 text-center">
              <Text>0</Text>
            </View>
            <Pressable tw="flex-1 items-center border-[1px] border-transparent border-l-gray-200 border-r-gray-200 bg-blue-50 p-4">
              <Text tw="text-2xl font-normal">-</Text>
            </Pressable>
            <Pressable tw="flex-1 items-center bg-blue-50 p-4">
              <Text tw="text-2xl font-normal">+</Text>
            </Pressable>
          </View>
        </View>
        <View tw="flex-row justify-between">
          <Text tw="text-gray-700">Estimated transaction fee:</Text>
          <Text tw="text-gray-700">$4.00</Text>
        </View>
        <View tw="flex-row justify-between">
          <Text tw="text-gray-700">You will pay in USDC:</Text>
          <Text tw="text-gray-700">$4.00</Text>
        </View>
      </View>
      <View tw="h-8" />
      {renderBuyButton()}
    </View>
  );
};
