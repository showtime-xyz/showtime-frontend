import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgLinkOut(props: SvgProps) {
  return (
    <Svg
      width={props.width}
      height={props.height}
      viewBox="0 0 14 13"
      fill="none"
      {...props}
    >
      <Path
        d="M7.793 6.135l4.62-4.62M12.413 4.676v-3.16M12.413 11.95V8.79M12.413 1.516h-3.16M4.972 1.516h-3.16M12.413 11.945H1.812M1.812 11.945V1.515"
        stroke={props.color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default SvgLinkOut;
