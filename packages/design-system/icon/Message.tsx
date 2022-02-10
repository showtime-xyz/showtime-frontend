import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgMessage(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.993 19H12c4.621 0 8-3.327 8-7s-3.379-7-8-7-8 3.327-8 7c0 1.331.425 2.585 1.185 3.663a2 2 0 01.24 1.847l-.302.817 1.752-.355a2 2 0 011.262.157 8.845 8.845 0 003.856.87zM12 21c-1.635.006-3.25-.36-4.728-1.068l-3.512.712a1 1 0 01-1.136-1.328l.926-2.501C2.569 15.422 2 13.771 2 12c0-4.97 4.478-9 10-9s10 4.03 10 9-4.478 9-10 9z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgMessage;
