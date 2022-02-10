import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgMail(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 5.983V18c0 1.652 1.348 3 3 3h16c1.652 0 3-1.348 3-3V6.012v-.03A3.006 3.006 0 0020 3H4a3.006 3.006 0 00-3 2.983zm2.107-.429C3.272 5.227 3.612 5 4 5h16c.388 0 .728.227.893.554L12 11.779 3.107 5.554zM21 7.921V18c0 .548-.452 1-1 1H4c-.548 0-1-.452-1-1V7.92l8.427 5.9a1 1 0 001.146 0L21 7.92z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgMail;
