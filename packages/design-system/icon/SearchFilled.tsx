import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgSearchFilled(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 1C5.477 1 1 5.477 1 11s4.477 10 10 10c2.037 0 3.934-.61 5.515-1.657l3.07 3.071a2 2 0 102.83-2.828l-3.072-3.071A9.957 9.957 0 0021 11c0-5.523-4.477-10-10-10zM5 11a6 6 0 1110.362 4.12 2.02 2.02 0 00-.242.242A6 6 0 015 11z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgSearchFilled;
