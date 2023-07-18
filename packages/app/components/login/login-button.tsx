import React, { useMemo } from "react";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  Apple,
  GoogleOriginal,
  Twitter,
  Facebook,
  Mail,
  Ethereum,
} from "@showtime-xyz/universal.icon";
import { PressableProps } from "@showtime-xyz/universal.pressable";
import { colors } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

type LoginType =
  | "apple"
  | "google"
  | "facebook"
  | "twitter"
  | "email"
  | "wallet"
  | "social";
type LoginButtonProps = PressableProps & {
  type: LoginType;
};

const BUTTON_TEXT = {
  apple: "Continue with Apple",
  google: "Continue with Google",
  facebook: "Continue with Facebook",
  twitter: "Continue with Twitter",
  email: "Continue with Email",
  wallet: "Connect Wallet",
  social: "Back to social login",
};
const BUTTON_ICON = {
  apple: Apple,
  google: GoogleOriginal,
  facebook: Facebook,
  twitter: Twitter,
  email: Mail,
  wallet: Ethereum,
  social: () => <></>,
};

export const LoginButton = ({ type, ...rest }: LoginButtonProps) => {
  const isDark = useIsDarkMode();

  const Icon = useMemo(
    () => (BUTTON_ICON[type] ? BUTTON_ICON[type] : null),
    [type]
  );

  const iconColorProps = useMemo(() => {
    switch (type) {
      case "google":
        return {};
      case "twitter":
        return { color: colors.twitter };
      case "facebook":
        return { color: colors.facebook };
      case "wallet":
        return { color: isDark ? colors.black : colors.white };
      default:
        return { color: isDark ? colors.white : colors.black };
    }
  }, [isDark, type]);

  const variant = useMemo(() => {
    switch (type) {
      case "wallet":
        return "primary";
      case "social":
        return "text";
      default:
        return "outlined";
    }
  }, [type]);

  const labelTW = useMemo(() => {
    switch (type) {
      case "social":
        return "underline";
      default:
        return "";
    }
  }, [type]);
  return (
    <Button
      variant={variant}
      size="regular"
      tw="my-1"
      labelTW={labelTW}
      {...rest}
    >
      {Icon && (
        <View tw="absolute left-4 top-3">
          <Icon width={24} height={24} {...iconColorProps} />
        </View>
      )}
      {BUTTON_TEXT[type]}
    </Button>
  );
};
