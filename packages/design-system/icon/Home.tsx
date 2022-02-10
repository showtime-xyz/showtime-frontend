import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgHome(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 22a3 3 0 01-3-3v-8.358a3 3 0 011.22-2.415l7-5.158a3 3 0 013.56 0l7 5.158A3 3 0 0122 10.642V19a3 3 0 01-3 3H5zm6.407-17.32a1 1 0 011.186 0l7 5.157a1 1 0 01.407.805V19a1 1 0 01-1 1h-3v-5a3 3 0 00-3-3h-2a3 3 0 00-3 3v5H5a1 1 0 01-1-1v-8.358a1 1 0 01.407-.805l7-5.158zM10 20h4v-5a1 1 0 00-1-1h-2a1 1 0 00-1 1v5z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgHome;
