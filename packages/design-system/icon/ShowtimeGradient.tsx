import * as React from "react";

import Svg, {
  SvgProps,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";

const SvgShowtimeGradient = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M22.713 12.552a.6.6 0 0 0 0-1.104l-3.253-1.393a10.5 10.5 0 0 1-5.515-5.515l-1.393-3.253a.6.6 0 0 0-1.104 0L10.055 4.54a10.5 10.5 0 0 1-5.515 5.515l-3.253 1.393a.6.6 0 0 0 0 1.104l3.253 1.393a10.5 10.5 0 0 1 5.515 5.515l1.393 3.253a.6.6 0 0 0 1.104 0l1.393-3.253a10.5 10.5 0 0 1 5.515-5.515l3.253-1.393Z"
      fill="url(#ShowtimeGradient_svg__a)"
    />
    <Defs>
      <LinearGradient
        id="ShowtimeGradient_svg__a"
        x1={23.077}
        y1={0.923}
        x2={0.923}
        y2={23.077}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#FFFBEB" />
        <Stop offset={0.234} stopColor="#FDE68A" />
        <Stop offset={0.693} stopColor="#F59E0B" />
      </LinearGradient>
    </Defs>
  </Svg>
);

export default SvgShowtimeGradient;
