import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgFlash = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.398 1.083a1 1 0 0 1 .594 1.041L13.132 9H21a1 1 0 0 1 .768 1.64l-10 12a1 1 0 0 1-1.76-.764l.86-6.876H3a1 1 0 0 1-.768-1.64l10-12a1 1 0 0 1 1.166-.277ZM5.135 13H12a1 1 0 0 1 .992 1.124l-.577 4.615L18.865 11H12a1 1 0 0 1-.992-1.124l.577-4.616L5.135 13Z"
      fill={props.color}
    />
  </Svg>
);

export default SvgFlash;
