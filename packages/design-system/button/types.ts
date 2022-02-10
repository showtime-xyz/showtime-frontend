import type React from "react";

import type { Props as PressableScaleProps } from "design-system/pressable-scale";
import type { TW } from "design-system/tailwind/types";

export type ButtonVariant = "primary" | "danger" | "tertiary" | "secondary";

export type ButtonSize = "small" | "regular";

export type ButtonProps = {
  /**
   * Defines the button variant.
   * @default primary
   */
  variant?: ButtonVariant;
  children?: React.ReactNode | string;
  asChild?: boolean;
} & PressableScaleProps &
  Partial<Pick<BaseButtonProps, "tw" | "labelTW" | "iconOnly" | "size">>;

export type BaseButtonProps = {
  /**
   * Defines the tailwind class names to
   * be applied to the button container.
   * @default undefined
   */
  tw?: TW;
  /**
   * Defines the tailwind class names to
   * be applied to the label.
   * @default undefined
   */
  labelTW?: TW;
  /**
   * Defines the background state colors.
   */
  backgroundColors: {
    default: string[];
    pressed: string[];
  };
  /**
   * Defines the button icons colour.
   * @default white|black
   */
  iconColor: string[];
  /**
   * Defines if the button will only contains
   * an icon or not.
   * @default false
   */
  iconOnly: boolean;
  /**
   * Defines the button size.
   * @default small
   */
  size: ButtonSize;

  children?: React.ReactNode | string;

  /**
   * Renders the child of button as the Button
   */
  asChild?: boolean;
} & PressableScaleProps;
