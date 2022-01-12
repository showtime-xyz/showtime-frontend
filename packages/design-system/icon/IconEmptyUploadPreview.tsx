import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function IconEmptyUploadPreview(props: SvgProps) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 26 18.123"
      {...props}
    >
      <Path
        d="M22.602 2.441a2.442 2.442 0 01-4.883 0 2.442 2.442 0 014.883 0zM26 13.332v4.793H0v-6.344l8.445-7.687 6.899 6.265 3.562-2.968zm0 0"
        fillRule="evenodd"
        fill={props.color}
      />
    </Svg>
  );
}

export { IconEmptyUploadPreview };
