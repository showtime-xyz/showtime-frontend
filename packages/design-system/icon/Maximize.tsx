import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgMaximize(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.879 2.879A3 3 0 015 2h3a1 1 0 010 2H5a1 1 0 00-1 1v3a1 1 0 01-2 0V5a3 3 0 01.879-2.121zM15 3a1 1 0 011-1h3a3 3 0 013 3v3a1 1 0 11-2 0V5a1 1 0 00-1-1h-3a1 1 0 01-1-1zM3 15a1 1 0 011 1v3a1 1 0 001 1h3a1 1 0 110 2H5a3 3 0 01-3-3v-3a1 1 0 011-1zm18 0a1 1 0 011 1v3a3 3 0 01-3 3h-3a1 1 0 110-2h3a1 1 0 001-1v-3a1 1 0 011-1z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgMaximize;
