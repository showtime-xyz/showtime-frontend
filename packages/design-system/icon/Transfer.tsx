import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const SvgTransfer = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M0 10C0 4.477 4.477 0 10 0s10 4.477 10 10-4.477 10-10 10S0 15.523 0 10Z"
      fill="#27272A"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.293 12.793a1 1 0 1 0 1.414 1.414l3.5-3.5a1 1 0 0 0 0-1.414l-3.5-3.5a1 1 0 0 0-1.414 1.414L11.086 9H6.5a1 1 0 1 0 0 2h4.586l-1.793 1.793Z"
      fill={props.color}
    />
  </Svg>
);

export default SvgTransfer;
