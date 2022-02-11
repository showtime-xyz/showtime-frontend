import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgPercent(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.5 5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM3 6.5a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0zm16.707-.793l-14 14a1 1 0 01-1.414-1.414l14-14a1 1 0 111.414 1.414zM16 17.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm1.5-3.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgPercent;
