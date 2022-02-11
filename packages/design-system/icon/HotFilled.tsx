import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgHotFilled(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.467 0c1.102.018 5.555 2.549 6.386 8.558.905-.889 1.409-3.664 1.147-4.843 3.952 2.969 6 6.781 6 11.034C21 19.843 17.57 24 12.037 24 6.309 24 3 20.247 3 15.724 3 9.464 8.052 8.104 7.467 0zm3.262 19.743c-.749.848-.368 1.945.763 2.045 1.035.093 1.759-.812 2.032-1.792.273-.978.09-2.02-.369-2.893-.998 1.515-1.52 1.64-2.426 2.64z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgHotFilled;
