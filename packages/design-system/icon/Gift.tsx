import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgGift = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 8v13m0-13V6a2 2 0 1 1 2 2h-2Zm0 0V5.5A2.5 2.5 0 1 0 9.5 8H12Zm-7 4h14M5 12a2 2 0 1 1 0-4h14a2 2 0 1 1 0 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"
      stroke={props.color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default SvgGift;
