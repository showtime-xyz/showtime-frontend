import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgCheck1(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.573 6.18a1 1 0 01.246 1.393l-7 10a1 1 0 01-1.526.134l-4-4a1 1 0 111.414-1.414l3.157 3.157 6.317-9.023a1 1 0 011.392-.246z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgCheck1;
