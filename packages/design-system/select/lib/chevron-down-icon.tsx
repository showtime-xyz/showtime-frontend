import { MotiView } from "moti";
import { SvgProps } from "react-native-svg";

import { useIsDarkMode } from "../../hooks";
import ChevronDown from "../../icon/ChevronDown";
import { colors } from "../../tailwind/colors";

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
