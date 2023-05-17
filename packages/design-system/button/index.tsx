import { useMemo } from "react";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { colors } from "@showtime-xyz/universal.tailwind";

import {
  Button as BaseButton,
  GradientButton as BaseGradientButton,
} from "./button";
import { CONTAINER_BACKGROUND_MAPPER, ICON_COLOR_MAPPER } from "./constants";
import type { BaseButtonProps, ButtonProps } from "./types";

export type { ButtonVariant, ButtonProps } from "./types";

export function Button({ variant = "primary", theme, ...rest }: ButtonProps) {
  const isDarkMode = useIsDarkMode();
  const isDark = theme === "dark" || (theme === "light" ? false : isDarkMode);

  const props = useMemo(() => ({ isDark, ...rest }), [isDark, rest]);
  switch (variant) {
    case "primary":
      return <PrimaryButton {...props} />;
    case "danger":
      return <DangerButton {...props} />;
    case "tertiary":
      return <TertiaryButton {...props} />;
    case "secondary":
      return <SecondaryButton {...props} />;
    case "text":
      return <TextButton {...props} />;
    case "outlined":
      return <OutlinedButton {...props} />;
    case "gradient":
      return <GradientButton {...props} />;
    case "base":
      return <BaseButton {...props} />;
    default:
      return <PrimaryButton {...props} />;
  }
}

export function PrimaryButton({ isDark, ...rest }: BaseButtonProps) {
  return (
    <BaseButton
      isDark={isDark}
      backgroundColors={CONTAINER_BACKGROUND_MAPPER.primary}
      labelStyle={{ color: isDark ? "#000" : "#FFF" }}
      iconColor={ICON_COLOR_MAPPER.primary}
      {...rest}
    />
  );
}

export function SecondaryButton({ isDark, ...rest }: BaseButtonProps) {
  return (
    <BaseButton
      isDark={isDark}
      labelStyle={{ color: isDark ? "#FFF" : colors.gray[900] }}
      iconColor={ICON_COLOR_MAPPER.secondary}
      backgroundColors={CONTAINER_BACKGROUND_MAPPER.secondary}
      {...rest}
    />
  );
}

export function TertiaryButton({ isDark, ...rest }: BaseButtonProps) {
  return (
    <BaseButton
      isDark={isDark}
      labelStyle={{ color: isDark ? "#FFF" : colors.gray[900] }}
      iconColor={ICON_COLOR_MAPPER.tertiary}
      backgroundColors={CONTAINER_BACKGROUND_MAPPER.tertiary}
      {...rest}
    />
  );
}

export function DangerButton(props: BaseButtonProps) {
  return (
    <BaseButton
      labelStyle={{ color: "#FFF" }}
      iconColor={ICON_COLOR_MAPPER.danger}
      backgroundColors={CONTAINER_BACKGROUND_MAPPER.danger}
      {...props}
    />
  );
}

export function TextButton({ accentColor, isDark, ...props }: BaseButtonProps) {
  const labelStyle = useMemo(
    () => ({
      color: accentColor
        ? typeof accentColor === "string"
          ? accentColor
          : isDark
          ? accentColor[1]
          : accentColor[0]
        : isDark
        ? ICON_COLOR_MAPPER.text[1]
        : ICON_COLOR_MAPPER.text[0],
    }),
    [accentColor, isDark]
  );

  const iconColor = useMemo(
    () =>
      accentColor
        ? typeof accentColor === "string"
          ? [accentColor, accentColor]
          : accentColor
        : ICON_COLOR_MAPPER.text,
    [accentColor]
  );

  return (
    <BaseButton
      {...props}
      isDark={isDark}
      labelStyle={labelStyle}
      iconColor={iconColor}
      backgroundColors={undefined}
    />
  );
}

export function OutlinedButton({ isDark, ...rest }: BaseButtonProps) {
  return (
    <BaseButton
      {...rest}
      isDark={isDark}
      labelStyle={{ color: isDark ? "#FFF" : "#000" }}
      iconColor={ICON_COLOR_MAPPER.outlined}
      backgroundColors={CONTAINER_BACKGROUND_MAPPER.outlined}
    />
  );
}

export function GradientButton(props: ButtonProps) {
  return (
    <BaseGradientButton {...props} iconColor={ICON_COLOR_MAPPER.secondary} />
  );
}
