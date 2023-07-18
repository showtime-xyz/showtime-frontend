import * as React from "react";

import Svg, {
  SvgProps,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";

const SvgRaffleBadge = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 15 10" fill="none" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M.016.6h14.488v2.89a1.558 1.558 0 0 0 0 3.115v2.89H.016V6.603a1.555 1.555 0 0 0 0-3.109V.599Zm7.72 2.181a.5.5 0 0 0-.951 0l-.297.913a.5.5 0 0 1-.475.346h-.96a.5.5 0 0 0-.294.904l.776.564a.5.5 0 0 1 .182.56l-.297.912a.5.5 0 0 0 .77.56l.776-.565a.5.5 0 0 1 .588 0l.777.564A.5.5 0 0 0 9.1 6.98l-.297-.913a.5.5 0 0 1 .182-.559l.777-.564a.5.5 0 0 0-.294-.904h-.96a.5.5 0 0 1-.476-.346l-.296-.913Z"
      fill="url(#RaffleBadge_svg__a)"
    />
    <Defs>
      <LinearGradient
        id="RaffleBadge_svg__a"
        x1={2.84}
        y1={-2.873}
        x2={10.289}
        y2={10.85}
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset={0.002} stopColor="#FFF6DE" />
        <Stop offset={0.501} stopColor="#FFC93F" />
        <Stop offset={1} stopColor="#FF9E2C" />
      </LinearGradient>
    </Defs>
  </Svg>
);

export default SvgRaffleBadge;
