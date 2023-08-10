import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgLink(props: SvgProps) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill={props.color}
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.57 2a5.488 5.488 0 0 0-3.86 1.54h-.001l-.01.01-1.572 1.564a.915.915 0 0 0 1.29 1.297l1.567-1.56a3.658 3.658 0 0 1 5.174 5.173l-2.738 2.738a3.66 3.66 0 0 1-5.517-.395.915.915 0 0 0-1.465 1.095 5.489 5.489 0 0 0 8.276.593l2.744-2.744.01-.01A5.488 5.488 0 0 0 16.57 2Zm-6.01 6.35a5.488 5.488 0 0 0-4.274 1.595l-2.744 2.744-.01.01a5.488 5.488 0 0 0 7.759 7.76l.011-.01 1.564-1.565a.915.915 0 1 0-1.293-1.293l-1.558 1.558a3.658 3.658 0 0 1-5.173-5.173l2.738-2.738a3.66 3.66 0 0 1 5.517.395.915.915 0 0 0 1.465-1.095 5.487 5.487 0 0 0-4.003-2.187Z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgLink;
