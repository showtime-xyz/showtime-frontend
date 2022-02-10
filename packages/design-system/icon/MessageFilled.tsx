import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgMessageFilled(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 21c-1.635.006-3.25-.36-4.728-1.068l-3.512.712a1 1 0 01-1.136-1.328l.926-2.501C2.569 15.422 2 13.771 2 12c0-4.97 4.478-9 10-9s10 4.03 10 9-4.478 9-10 9z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgMessageFilled;
