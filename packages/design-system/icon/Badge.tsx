import * as React from "react";

import Svg, { SvgProps, G, Path, Defs, ClipPath } from "react-native-svg";

function SvgBadge(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <G clipPath="url(#Badge_svg__clip0_59:0)">
        <Path
          d="M10.557.472a2.446 2.446 0 012.886 0c2.059 1.506 1.616 1.362 4.166 1.354a2.443 2.443 0 012.334 1.696c.78 2.427.507 2.052 2.575 3.544a2.445 2.445 0 01.892 2.745c-.794 2.417-.798 1.953 0 4.38a2.443 2.443 0 01-.892 2.745c-2.068 1.491-1.794 1.116-2.575 3.544a2.442 2.442 0 01-2.334 1.696c-2.551-.008-2.108-.152-4.166 1.354a2.446 2.446 0 01-2.886 0c-2.059-1.505-1.616-1.363-4.166-1.354a2.443 2.443 0 01-2.334-1.696c-.78-2.43-.511-2.055-2.575-3.544a2.445 2.445 0 01-.892-2.745c.795-2.417.798-1.953 0-4.38a2.444 2.444 0 01.891-2.746c2.062-1.489 1.795-1.111 2.575-3.544A2.442 2.442 0 016.39 1.825c2.545.008 2.096.161 4.167-1.353z"
          fill={props.color}
        />
      </G>
      <Defs>
        <ClipPath id="Badge_svg__clip0_59:0">
          <Path fill={props.color} d="M0 0h24v24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default SvgBadge;
