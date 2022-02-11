import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgBellFilled(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M7.05 3.05A7 7 0 0119 8c0 3.353.717 5.435 1.378 6.646.332.608.655 1.007.88 1.244a3.042 3.042 0 00.306.284l.002.002A1 1 0 0121 18H3a1 1 0 01-.566-1.824l.003-.002.052-.042c.053-.044.141-.123.254-.242.224-.237.547-.636.88-1.244C4.282 13.435 5 11.353 5 8a7 7 0 012.05-4.95zM11.135 20.498a1 1 0 00-1.73 1.004 3 3 0 005.19 0 1 1 0 00-1.73-1.004 1 1 0 01-1.73 0z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgBellFilled;
