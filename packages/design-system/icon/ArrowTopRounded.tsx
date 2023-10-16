import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgArrowTopRounded = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <Path
      fill={props.color}
      fillRule="evenodd"
      d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12ZM12 5.89l.806.807 4.498 4.497-1.612 1.613-2.552-2.552v8.127h-2.28v-8.127l-2.552 2.552-1.612-1.613 4.498-4.497L12 5.89Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgArrowTopRounded;
