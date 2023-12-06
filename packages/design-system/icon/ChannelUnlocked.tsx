import * as React from "react";

import Svg, {
  Path,
  Defs,
  SvgProps,
  LinearGradient,
  Stop,
} from "react-native-svg";

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={props.width}
      height={props.height}
      viewBox="0 0 31 28"
      fill="none"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.307 27.436a16.269 16.269 0 01-7.092-1.601L2.2 27.436a1.5 1.5 0 01-1.705-1.99l2.138-4.287C1.16 19.069.307 16.592.307 13.936c0-7.455 6.717-13.5 15-13.5 8.283 0 15 6.045 15 13.5 0 7.456-6.717 13.5-15 13.5z"
        fill="url(#paint0_linear_75_3119)"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_75_3119"
          x1={116.233}
          y1={-21.136}
          x2={64.3816}
          y2={-64.0397}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset={0.0211045} stopColor="#FFCB6C" />
          <Stop offset={0.0494776} stopColor="#FDD764" />
          <Stop offset={0.124157} stopColor="#FFD24D" />
          <Stop offset={0.15459} stopColor="#E6A130" />
          <Stop offset={0.17186} stopColor="#EDAF38" />
          <Stop offset={0.191278} stopColor="#FFE956" />
          <Stop offset={0.221722} stopColor="#FFEC92" />
          <Stop offset={0.25977} stopColor="#FED749" />
          <Stop offset={0.313071} stopColor="#FDC93F" />
          <Stop offset={0.362216} stopColor="#F6C33D" />
          <Stop offset={0.403646} stopColor="#ED9F26" />
          <Stop offset={0.46356} stopColor="#E88A3F" />
          <Stop offset={0.541176} stopColor="#F4CE5E" />
          <Stop offset={0.609129} stopColor="#E4973C" />
          <Stop offset={0.696306} stopColor="#F1A819" />
          <Stop offset={0.823556} stopColor="#FFD480" />
          <Stop offset={0.918348} stopColor="#FBC73F" />
          <Stop offset={0.997887} stopColor="#F5E794" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}

export default SvgComponent;
