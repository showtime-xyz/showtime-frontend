import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgEthereum(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.998.003l7.365 12.22-7.365 4.353-7.365-4.353L11.998.002zm0 23.994L4.633 13.619l7.365 4.351 7.369-4.35-7.37 10.377z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgEthereum;
