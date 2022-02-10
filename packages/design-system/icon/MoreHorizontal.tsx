import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgMoreHorizontal(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.778 12a2.222 2.222 0 114.444 0 2.222 2.222 0 01-4.444 0zM4.222 9.778a2.222 2.222 0 100 4.444 2.222 2.222 0 000-4.444zm15.556 0a2.222 2.222 0 100 4.444 2.222 2.222 0 000-4.444z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgMoreHorizontal;
