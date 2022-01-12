import * as React from 'react';
import Svg, { SvgProps, Defs, ClipPath, Path, G, Rect } from 'react-native-svg';

function IconCheck(props: SvgProps) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 13 10"
      {...props}
    >
      <Defs>
        <ClipPath id="iconCheck_svg__a">
          <Path d="M4.55 10L0 5.562l1.82-1.75 2.73 2.626L11.18 0 13 1.813zm0 0" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#iconCheck_svg__a)" clipRule="evenodd">
        <Rect
          x="0"
          y="0"
          width="13"
          height="10"
          fill={props.color}
          fillOpacity={1}
          stroke="none"
        />
      </G>
    </Svg>
  );
}

export { IconCheck };
