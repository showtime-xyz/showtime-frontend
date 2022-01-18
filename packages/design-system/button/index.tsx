import React from "react";
import { tw as tailwind } from "design-system/tailwind";
import { BaseButton } from "./button-base";

import type { ButtonProps, BaseButtonProps } from "./types";

export { ButtonLabel } from "./button-label";

export function Button({
  variant = "primary",
  size = "regular",
  iconOnly = false,
  ...props
}: ButtonProps) {
  switch (variant) {
    case "primary":
      return <PrimaryButton size={size} iconOnly={iconOnly} {...props} />;
    case "danger":
      return <DangerButton size={size} iconOnly={iconOnly} {...props} />;
    case "tertiary":
      return <TertiaryButton size={size} iconOnly={iconOnly} {...props} />;
    case "secondary":
      return <SecondaryButton size={size} iconOnly={iconOnly} {...props} />;
    default:
      return <PrimaryButton size={size} iconOnly={iconOnly} {...props} />;
  }
}

export function PrimaryButton({ tw = "", ...props }: BaseButtonProps) {
  return (
    <BaseButton
      {...props}
      tw={[
        `bg-gray-900 dark:bg-white`,
        typeof tw === "string" ? tw ?? "" : tw?.join(" "),
      ]}
      labelTW="text-white dark:text-black"
      iconColor={tailwind.color("white dark:gray-900")}
    />
  );
}

export function SecondaryButton({ tw = "", ...props }: BaseButtonProps) {
  return (
    <BaseButton
      {...props}
      tw={[
        `bg-white dark:bg-black`,
        typeof tw === "string" ? tw ?? "" : tw?.join(" "),
      ]}
      labelTW="text-gray-900 dark:text-white"
      iconColor={tailwind.color("gray-900 dark:white")}
    />
  );
}

export function TertiaryButton({ tw = "", ...props }: BaseButtonProps) {
  return (
    <BaseButton
      {...props}
      tw={[
        `bg-gray-100 dark:bg-gray-900`,
        typeof tw === "string" ? tw ?? "" : tw?.join(" "),
      ]}
      labelTW="text-gray-900 dark:text-white"
      iconColor={tailwind.color("gray-900 dark:white")}
    />
  );
}

export function DangerButton({ tw = "", ...props }: BaseButtonProps) {
  return (
    <BaseButton
      {...props}
      tw={[
        `bg-red-500 dark:bg-red-700`,
        typeof tw === "string" ? tw ?? "" : tw?.join(" "),
      ]}
      labelTW="text-white"
      iconColor="white"
    />
  );
}
