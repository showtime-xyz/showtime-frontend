import * as React from "react";

import Svg, { Path, SvgProps } from "react-native-svg";

function CollectorList(props: SvgProps) {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none" {...props}>
      <Path
        d="M10.193 1.238l5.018 2.228c1.445.638 1.445 1.692 0 2.33l-5.018 2.228c-.57.255-1.505.255-2.075 0L3.101 5.796c-1.446-.638-1.446-1.692 0-2.33l5.017-2.228c.57-.255 1.506-.255 2.075 0z"
        fill={props.color}
        stroke={props.color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M1.68 8.11c0 .714.537 1.538 1.191 1.828l5.775 2.568a1.69 1.69 0 001.377 0l5.774-2.568c.655-.29 1.19-1.114 1.19-1.829"
        stroke={props.color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M1.68 12.361c0 .791.469 1.505 1.191 1.829l5.775 2.568a1.69 1.69 0 001.377 0l5.774-2.568a2.004 2.004 0 001.19-1.829"
        stroke={props.color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default CollectorList;
