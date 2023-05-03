import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgCloseLarge = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <Path
      fill={props.color}
      fillRule="evenodd"
      d="M21.582 4.439a1.429 1.429 0 1 0-2.02-2.02L12 9.978 4.439 2.42a1.429 1.429 0 0 0-2.02 2.02L9.978 12l-7.56 7.561a1.429 1.429 0 1 0 2.02 2.02L12 14.022l7.561 7.56a1.429 1.429 0 1 0 2.02-2.02L14.022 12l7.56-7.561Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgCloseLarge;
