import * as React from 'react';
import Svg, { SvgProps, Defs, ClipPath, Path, G } from 'react-native-svg';

function IconClose(props: SvgProps) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 14 14"
      {...props}
    >
      <Defs>
        <ClipPath id="iconClose_svg__a">
          <Path d="M8.965 7l4.894-4.895a.476.476 0 000-.675L12.57.14a.476.476 0 00-.675 0L7 5.036 2.105.141a.476.476 0 00-.675 0L.14 1.43a.476.476 0 000 .675L5.036 7 .141 11.895a.476.476 0 000 .675l1.289 1.29a.476.476 0 00.675 0L7 8.964l4.895 4.894a.476.476 0 00.675 0l1.29-1.289a.476.476 0 000-.675zm0 0" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#iconClose_svg__a)">
        <Path d="M0 0h14v14H0z" fill={props.color} />
      </G>
    </Svg>
  );
}

export { IconClose };
