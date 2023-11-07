import * as React from "react";

import Svg, { SvgProps, LinearGradient, Stop, Path } from "react-native-svg";

const SvgGoldHexagon = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" viewBox="0 0 17 19" {...props}>
    <LinearGradient
      id="GoldHexagon_svg__a"
      x1={46.462}
      x2={2.533}
      y1={-10.641}
      y2={-26.039}
      gradientUnits="userSpaceOnUse"
    >
      <Stop offset={0} stopColor="#f4ce5e" />
      <Stop offset={0.021} stopColor="#ffcb6c" />
      <Stop offset={0.049} stopColor="#fdd764" />
      <Stop offset={0.124} stopColor="#ffd24d" />
      <Stop offset={0.155} stopColor="#e6a130" />
      <Stop offset={0.172} stopColor="#edaf38" />
      <Stop offset={0.191} stopColor="#ffe956" />
      <Stop offset={0.26} stopColor="#fed749" />
      <Stop offset={0.26} stopColor="#ffec92" />
      <Stop offset={0.563} stopColor="#e4973c" />
      <Stop offset={0.656} stopColor="#f1a819" />
      <Stop offset={0.729} stopColor="#fbc73f" />
      <Stop offset={0.844} stopColor="#f5e794" />
    </LinearGradient>
    <Path
      fill="url(#GoldHexagon_svg__a)"
      d="M7.317.84a3 3 0 0 1 2.959 0l2.554 1.448 2.531 1.489a3 3 0 0 1 1.48 2.562l.023 2.936-.023 2.936a3 3 0 0 1-1.48 2.562l-2.53 1.489-2.555 1.448a3 3 0 0 1-2.959 0l-2.554-1.448-2.531-1.489a3 3 0 0 1-1.48-2.562L.73 9.275l.023-2.936a3 3 0 0 1 1.48-2.562l2.53-1.489z"
    />
  </Svg>
);
export default SvgGoldHexagon;
