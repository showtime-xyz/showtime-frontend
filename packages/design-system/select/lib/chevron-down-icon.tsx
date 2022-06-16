import { MotiView } from "moti";
import { SvgProps } from "react-native-svg";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { ChevronDown } from "@showtime-xyz/universal.icon";
import { colors } from "@showtime-xyz/universal.tailwind";

interface ChevronDownIconProps extends SvgProps {
  open: boolean;
}

export const ChevronDownIcon: React.FC<ChevronDownIconProps> = ({
  open,
  ...rest
}) => {
  const isDarkMode = useIsDarkMode();

  return (
    <MotiView
      animate={{
        rotateZ: open ? "180deg" : "0deg",
      }}
      transition={{
        type: "timing",
        duration: 300,
      }}
    >
      <ChevronDown
        fill={isDarkMode ? colors.gray[100] : colors.gray[900]}
        {...rest}
      />
    </MotiView>
  );
};
