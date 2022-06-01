import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgShare = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M3.341 19.181c-.384.34-1.004-.01-.847-.497C5.59 9.08 14.222 7.277 14.222 7.277V4.68a.5.5 0 0 1 .848-.36l6.56 6.345a.5.5 0 0 1 .002.717l-6.56 6.401a.5.5 0 0 1-.85-.358v-2.59s-5.78-.164-10.881 4.347Z"
      fill={props.color}
    />
  </Svg>
);

export default SvgShare;
