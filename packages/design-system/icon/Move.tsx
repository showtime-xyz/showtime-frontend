import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgMove(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 8a1 1 0 011-1h9.999a1 1 0 110 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h9.999a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h9.999a1 1 0 100-2H7z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgMove;
