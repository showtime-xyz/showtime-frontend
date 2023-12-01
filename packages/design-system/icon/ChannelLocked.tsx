import * as React from "react";

import Svg, { Path, G, Rect, SvgProps } from "react-native-svg";

function ChannelLocked(props: SvgProps) {
  return (
    <Svg
      width={props.height}
      height={props.width}
      viewBox="0 0 31 28"
      fill="none"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.22 27.08a16.268 16.268 0 01-7.092-1.601L2.111 27.08A1.5 1.5 0 01.407 25.09l2.138-4.286C1.073 18.713.22 16.236.22 13.58c0-7.455 6.716-13.5 15-13.5 8.283 0 15 6.045 15 13.5s-6.717 13.5-15 13.5z"
        fill="#fff"
      />
      <G stroke="#121212">
        <Rect
          x={9.90695}
          y={12.656}
          width={10.3896}
          height={7.2864}
          rx={0.986423}
          fill="#121212"
          strokeWidth={1.45062}
        />
        <Path
          d="M18.725 12.746V9.735c.016-1.219-.681-3.656-3.6-3.656-2.588 0-3.454 1.916-3.617 3.2v3.23"
          strokeWidth={2.17593}
        />
      </G>
    </Svg>
  );
}

export default ChannelLocked;
