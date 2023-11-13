import { useState, isValidElement } from "react";
import { Platform } from "react-native";

import * as Tooltip from "universal-tooltip";

import { Button, ButtonProps } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

type BuyButtonProps = {
  username?: string;
  text?: JSX.Element | string;
  side?: "top" | "bottom";
} & ButtonProps;
const BuyButton = ({ username, text = "Buy", ...rest }: BuyButtonProps) => {
  const buyPath = `/creator-token/${username}/buy`;
  const router = useRouter();

  return (
    <View>
      <Button
        tw="mt-2.5"
        style={{ backgroundColor: "#08F6CC", width: "100%" }}
        onPress={() => {
          router.push(
            Platform.select({
              native: buyPath + "?selectedAction=buy",
              web: {
                pathname: router.pathname,
                query: {
                  ...router.query,
                  creatorTokenBuyModal: true,
                  username: username,
                  selectedAction: "buy",
                },
              } as any,
            }),
            Platform.select({
              native: buyPath,
              web: router.asPath,
            }),
            { shallow: true }
          );
        }}
        {...rest}
      >
        <>
          {isValidElement(text) ? (
            text
          ) : (
            <Text tw="text-base font-bold text-gray-900">Buy</Text>
          )}
        </>
      </Button>
    </View>
  );
};
const SellButton = ({
  username,
  ...rest
}: { username?: string } & ButtonProps) => {
  const buyPath = `/creator-token/${username}/buy`;
  const router = useRouter();
  return (
    <View>
      <Button
        tw="mt-2.5"
        style={{ backgroundColor: "#FD749D", width: "100%" }}
        onPress={() => {
          router.push(
            Platform.select({
              native: buyPath + "?selectedAction=sell",
              web: {
                pathname: router.pathname,
                query: {
                  ...router.query,
                  creatorTokenBuyModal: true,
                  username: username,
                  selectedAction: "sell",
                },
              } as any,
            }),
            Platform.select({
              native: buyPath,
              web: router.asPath,
            }),
            { shallow: true }
          );
        }}
        {...rest}
      >
        <>
          <Text tw="text-base font-bold text-gray-900">Sell</Text>
        </>
      </Button>
    </View>
  );
};

export const PlatformSellButton = (
  props: { username?: string } & ButtonProps
) => {
  const [open, setOpen] = useState(false);
  const isDark = useIsDarkMode();
  if (Platform.OS !== "web") {
    return (
      <Tooltip.Root
        onDismiss={() => {
          setOpen(false);
        }}
        delayDuration={100}
        open={open}
      >
        <Tooltip.Trigger>
          <SellButton
            {...props}
            onPress={() => {
              setOpen(true);
            }}
          />
        </Tooltip.Trigger>
        <Tooltip.Content
          sideOffset={3}
          containerStyle={{
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 8,
            paddingBottom: 8,
          }}
          className="web:outline-none"
          side="bottom"
          presetAnimation="fadeIn"
          backgroundColor={isDark ? "#fff" : colors.gray[900]}
          borderRadius={12}
        >
          <Tooltip.Text
            text={Platform.select({
              ios: "Unable to purchase on iOS",
              android: "Unable to purchase on Android",
              default: "Unable to purchase",
            })}
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: isDark ? colors.gray[900] : "#fff",
            }}
          />
          <Tooltip.Arrow width={12} height={6} />
        </Tooltip.Content>
      </Tooltip.Root>
    );
  }
  return <SellButton {...props} />;
};

export const PlatformBuyButton = ({
  side = "bottom",
  ...rest
}: BuyButtonProps) => {
  const [open, setOpen] = useState(false);
  const isDark = useIsDarkMode();
  if (Platform.OS !== "web") {
    return (
      <Tooltip.Root
        onDismiss={() => {
          setOpen(false);
        }}
        delayDuration={100}
        open={open}
      >
        <Tooltip.Trigger>
          <BuyButton
            {...rest}
            onPress={() => {
              setOpen(true);
            }}
          />
        </Tooltip.Trigger>
        <Tooltip.Content
          sideOffset={3}
          containerStyle={{
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 8,
            paddingBottom: 8,
          }}
          className="web:outline-none"
          side={side}
          presetAnimation="fadeIn"
          backgroundColor={isDark ? "#fff" : colors.gray[900]}
          borderRadius={12}
        >
          <Tooltip.Text
            text={Platform.select({
              ios: "Unable to purchase on iOS",
              android: "Unable to purchase on Android",
              default: "Unable to purchase",
            })}
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: isDark ? colors.gray[900] : "#fff",
            }}
          />
          <Tooltip.Arrow width={12} height={6} />
        </Tooltip.Content>
      </Tooltip.Root>
    );
  }
  return <BuyButton {...rest} />;
};
