import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgPlus(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 5a1 1 0 10-2 0v6H5a1 1 0 100 2h6v6a1 1 0 102 0v-6h6a1 1 0 100-2h-6V5z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgPlus;
