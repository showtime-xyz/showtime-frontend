import { useMemo } from "react";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { colors } from "@showtime-xyz/universal.tailwind";

import { Button as BaseButton } from "./button";
import { CONTAINER_BACKGROUND_MAPPER, ICON_COLOR_MAPPER } from "./constants";
import type { ButtonProps } from "./types";

export type { ButtonVariant, ButtonProps } from "./types";

export function Button({ variant = "primary", ...props }: ButtonProps) {
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
    default:
      return <PrimaryButton {...props} />;
  }
}

export function PrimaryButton(props: ButtonProps) {
  const isDark = useIsDarkMode();

  return (
    <BaseButton
      {...props}
      labelStyle={{ color: isDark ? "#000" : "#FFF" }}
      iconColor={ICON_COLOR_MAPPER.primary}
      backgroundColors={CONTAINER_BACKGROUND_MAPPER.primary}
    />
  );
}

export function SecondaryButton(props: ButtonProps) {
  const isDark = useIsDarkMode();

  return (
    <BaseButton
      {...props}
      labelStyle={{ color: isDark ? "#FFF" : colors.gray[900] }}
      iconColor={ICON_COLOR_MAPPER.secondary}
      backgroundColors={CONTAINER_BACKGROUND_MAPPER.secondary}
    />
  );
}

export function TertiaryButton(props: ButtonProps) {
  const isDark = useIsDarkMode();

  return (
    <BaseButton
      {...props}
      labelStyle={{ color: isDark ? "#FFF" : colors.gray[900] }}
      iconColor={ICON_COLOR_MAPPER.tertiary}
      backgroundColors={CONTAINER_BACKGROUND_MAPPER.tertiary}
    />
  );
}

export function DangerButton(props: ButtonProps) {
  return (
    <BaseButton
      {...props}
      labelStyle={{ color: "#FFF" }}
      iconColor={ICON_COLOR_MAPPER.danger}
      backgroundColors={CONTAINER_BACKGROUND_MAPPER.danger}
    />
  );
}

export function TextButton({ accentColor, ...props }: ButtonProps) {
  const isDark = useIsDarkMode();

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
      labelStyle={labelStyle}
      iconColor={iconColor}
      backgroundColors={undefined}
    />
  );
}

export function OutlinedButton({ ...props }: ButtonProps) {
  const isDark = useIsDarkMode();

  return (
    <BaseButton
      {...props}
      labelStyle={{ color: isDark ? "#FFF" : "#000" }}
      iconColor={ICON_COLOR_MAPPER.outlined}
      backgroundColors={CONTAINER_BACKGROUND_MAPPER.outlined}
    />
  );
}
