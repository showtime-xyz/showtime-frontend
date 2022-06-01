import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgPlay = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M6 18.13V5.87a.5.5 0 0 1 .752-.431l10.508 6.13a.5.5 0 0 1 0 .863l-10.508 6.13A.5.5 0 0 1 6 18.128Z"
      fill={props.color}
    />
  </Svg>
);

export default SvgPlay;
