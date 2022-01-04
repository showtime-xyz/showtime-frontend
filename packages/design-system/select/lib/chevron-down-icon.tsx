import { MotiView } from "moti";
import { SvgProps } from "react-native-svg";
import { Easing } from "react-native-reanimated";
import { useIsDarkMode } from "../../hooks";
import { colors } from "../../tailwind/colors";
import ChevronDown from "../../icon/ChevronDown";

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
        duration: 500,
        easing: Easing.bezier(0.87, 0, 0.13, 1),
      }}
    >
      <ChevronDown
        fill={isDarkMode ? colors.gray[100] : colors.gray[900]}
        {...rest}
      />
    </MotiView>
  );
};
