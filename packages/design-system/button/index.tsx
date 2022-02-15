import { BaseButton } from "./button-base";
import { CONTAINER_BACKGROUND_MAPPER, ICON_COLOR_TW_MAPPER } from "./constants";
import type { ButtonProps } from "./types";

export { ButtonLabel } from "./button-label";

export function Button({
  tw = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  const _tw = typeof tw === "string" ? tw ?? "" : tw?.join(" ");

  switch (variant) {
    case "primary":
      return <PrimaryButton tw={_tw} {...props} />;
    case "danger":
      return <DangerButton tw={_tw} {...props} />;
    case "tertiary":
      return <TertiaryButton tw={_tw} {...props} />;
    case "secondary":
      return <SecondaryButton tw={_tw} {...props} />;
    case "text":
      return <TextButton tw={_tw} {...props} />;
    default:
      return <PrimaryButton tw={_tw} {...props} />;
  }
}

export function PrimaryButton(props: ButtonProps) {
  return (
    <BaseButton
      {...(props as any)}
      labelTW="text-white dark:text-black"
      iconColor={ICON_COLOR_TW_MAPPER.primary}
      backgroundColors={CONTAINER_BACKGROUND_MAPPER.primary}
    />
  );
}

export function SecondaryButton(props: ButtonProps) {
  return (
    <BaseButton
      {...(props as any)}
      labelTW="text-gray-900 dark:text-white"
      iconColor={ICON_COLOR_TW_MAPPER.secondary}
      backgroundColors={CONTAINER_BACKGROUND_MAPPER.secondary}
    />
  );
}

export function TertiaryButton(props: ButtonProps) {
  return (
    <BaseButton
      {...(props as any)}
      labelTW="text-gray-900 dark:text-white"
      iconColor={ICON_COLOR_TW_MAPPER.tertiary}
      backgroundColors={CONTAINER_BACKGROUND_MAPPER.tertiary}
    />
  );
}

export function DangerButton(props: ButtonProps) {
  return (
    <BaseButton
      {...(props as any)}
      labelTW="text-white"
      iconColor={ICON_COLOR_TW_MAPPER.danger}
      backgroundColors={CONTAINER_BACKGROUND_MAPPER.danger}
    />
  );
}

export function TextButton(props: ButtonProps) {
  return (
    <BaseButton
      {...(props as any)}
      labelTW="text-gray-500"
      iconColor={ICON_COLOR_TW_MAPPER.text}
      backgroundColors={undefined}
    />
  );
}
