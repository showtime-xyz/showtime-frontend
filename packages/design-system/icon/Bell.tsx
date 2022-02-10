import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgBell(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 1a7 7 0 00-7 7c0 3.353-.717 5.435-1.378 6.646a5.938 5.938 0 01-.88 1.244 3.036 3.036 0 01-.305.284l-.003.002A1 1 0 003 18h18a1 1 0 00.566-1.824l-.002-.002a3.042 3.042 0 01-.306-.283 5.939 5.939 0 01-.88-1.245C19.718 13.435 19 11.353 19 8a7 7 0 00-7-7zm6.85 15H5.15c.075-.125.152-.257.228-.396C6.218 14.065 7 11.647 7 8a5 5 0 0110 0c0 3.647.783 6.065 1.622 7.604.076.14.153.271.229.396z"
        fill={props.color}
      />
      <Path
        d="M11.135 20.498a1 1 0 00-1.73 1.004 3 3 0 005.19 0 1 1 0 00-1.73-1.004 1 1 0 01-1.73 0z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgBell;
