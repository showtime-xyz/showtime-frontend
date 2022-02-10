import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgLink(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.996 1.067a6 6 0 00-4.22 1.684l-.011.01-1.72 1.71a1 1 0 001.41 1.418l1.715-1.704a4 4 0 015.656 5.654l-2.993 2.994a3.999 3.999 0 01-6.032-.432 1 1 0 00-1.602 1.198 6 6 0 009.048.648l3-3 .012-.012a6 6 0 00-4.263-10.168zM10.425 8.01a6 6 0 00-4.672 1.743l-3 3-.012.012a6 6 0 008.484 8.484l.012-.012 1.71-1.71a1 1 0 00-1.414-1.414l-1.704 1.703a4 4 0 01-5.655-5.655l2.993-2.994a4 4 0 016.032.432 1 1 0 001.602-1.198 6.001 6.001 0 00-4.376-2.39z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgLink;
