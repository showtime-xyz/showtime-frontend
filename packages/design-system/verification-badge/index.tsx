import Svg, { G, Path, Defs, ClipPath, SvgProps } from "react-native-svg";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";

type VerificationBadgeProps = SvgProps & {
  size?: number;
  fillColor?: string;
  bgColor?: string;
  className?: string;
  theme?: "light" | "dark";
};
export const VerificationBadge = ({
  size = 24,
  fillColor,
  bgColor,
  theme,
  ...props
}: VerificationBadgeProps) => {
  const isDarkMode = useIsDarkMode();

  const isDark = theme ? theme === "dark" : isDarkMode;
  const fill = fillColor ? fillColor : isDark ? "#18181B" : "#fff";
  const bgFill = bgColor ? bgColor : isDark ? "#fff" : "#18181B";

  return (
    <Svg width={size} height={size} {...props} fill="none" viewBox="0 0 24 24">
      <G clipPath="url(#a)">
        <Path
          d="M10.557.472a2.446 2.446 0 0 1 2.886 0c2.059 1.506 1.616 1.362 4.166 1.354a2.443 2.443 0 0 1 2.334 1.696c.78 2.427.507 2.052 2.575 3.544a2.445 2.445 0 0 1 .892 2.745c-.794 2.417-.798 1.953 0 4.38a2.443 2.443 0 0 1-.892 2.745c-2.068 1.491-1.794 1.116-2.575 3.544a2.442 2.442 0 0 1-2.334 1.696c-2.551-.008-2.108-.152-4.166 1.354a2.446 2.446 0 0 1-2.886 0c-2.06-1.505-1.616-1.363-4.166-1.354a2.443 2.443 0 0 1-2.334-1.696c-.78-2.43-.511-2.055-2.575-3.544a2.445 2.445 0 0 1-.892-2.745c.795-2.417.798-1.953 0-4.38a2.444 2.444 0 0 1 .89-2.746c2.063-1.489 1.796-1.111 2.576-3.544A2.442 2.442 0 0 1 6.39 1.825c2.545.008 2.096.161 4.167-1.353Z"
          fill={bgFill}
        />
        <Path
          d="M8 12.571 11 16l5-8"
          stroke={fill}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill={fill} d="M0 0h24v24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
