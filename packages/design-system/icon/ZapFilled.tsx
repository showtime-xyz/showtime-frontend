import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgZapFilled(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.398 1.083a1 1 0 01.594 1.041L13.132 9H21a1 1 0 01.768 1.64l-10 12a1 1 0 01-1.76-.764l.86-6.876H3a1 1 0 01-.768-1.64l10-12a1 1 0 011.166-.277z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgZapFilled;
