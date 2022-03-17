import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgCheckFilled(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zm6.82-16.427a1 1 0 00-1.64-1.146l-6.316 9.023-3.157-3.157a1 1 0 00-1.414 1.414l4 4a1 1 0 001.526-.134l7-10z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgCheckFilled;
