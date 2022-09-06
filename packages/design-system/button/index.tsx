import { useMemo } from "react";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";

import { Button as BaseButton } from "./button";
import { CONTAINER_BACKGROUND_MAPPER, ICON_COLOR_TW_MAPPER } from "./constants";
import type { ButtonProps } from "./types";

export type { ButtonVariant } from "./types";

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
    default:
      return <PrimaryButton {...props} />;
  }
}

export function PrimaryButton(props: ButtonProps) {
  return (
    <BaseButton
      {...props}
      labelTW="text-white dark:text-black"
      iconColor={ICON_COLOR_TW_MAPPER.primary}
      backgroundColors={CONTAINER_BACKGROUND_MAPPER.primary}
    />
  );
}

export function SecondaryButton(props: ButtonProps) {
  return (
    <BaseButton
      {...props}
      labelTW="text-gray-900 dark:text-white"
      iconColor={ICON_COLOR_TW_MAPPER.secondary}
      backgroundColors={CONTAINER_BACKGROUND_MAPPER.secondary}
    />
  );
}

export function TertiaryButton(props: ButtonProps) {
  return (
    <BaseButton
      {...props}
      labelTW="text-gray-900 dark:text-white"
      iconColor={ICON_COLOR_TW_MAPPER.tertiary}
      backgroundColors={CONTAINER_BACKGROUND_MAPPER.tertiary}
    />
  );
}

export function DangerButton(props: ButtonProps) {
  return (
    <BaseButton
      {...props}
      labelTW="text-white"
      iconColor={ICON_COLOR_TW_MAPPER.danger}
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
        ? ICON_COLOR_TW_MAPPER.text[1]
        : ICON_COLOR_TW_MAPPER.text[0],
    }),
    [accentColor, isDark]
  );

  const iconColor = useMemo(
    () =>
      accentColor
        ? typeof accentColor === "string"
          ? [accentColor, accentColor]
          : accentColor
        : ICON_COLOR_TW_MAPPER.text,
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
