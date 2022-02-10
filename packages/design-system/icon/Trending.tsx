import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgTrending(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM3 12a9 9 0 113.382 7.032L14 11.414V16a1 1 0 102 0V9a1 1 0 00-1-1H8a1 1 0 100 2h4.586l-7.618 7.618A8.962 8.962 0 013 12z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgTrending;
