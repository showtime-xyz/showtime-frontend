import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

function SvgUnhidden(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 8a4 4 0 100 8 4 4 0 000-8zm-2 4a2 2 0 114 0 2 2 0 01-4 0z"
        fill={props.color}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.894 11.552L23 12l.894.448-.002.003-.003.007-.011.022a10.615 10.615 0 01-.192.354 20.672 20.672 0 01-2.831 3.85C18.895 18.774 15.899 21 12 21c-3.9 0-6.896-2.226-8.855-4.316a20.67 20.67 0 01-2.831-3.85 12.375 12.375 0 01-.192-.354l-.011-.022-.003-.007-.002-.002s0-.002.894-.449l-.894-.448.002-.003.003-.007.011-.022a8.242 8.242 0 01.192-.354 20.673 20.673 0 012.831-3.85C5.105 5.226 8.1 3 12 3c3.9 0 6.895 2.226 8.855 4.316a20.675 20.675 0 012.831 3.85 11.81 11.81 0 01.192.354l.011.022.003.007.002.003zm-21.32 1.155c-.18-.277-.324-.518-.433-.707a18.678 18.678 0 012.464-3.316C6.395 6.774 8.9 5 12 5c3.1 0 5.605 1.774 7.395 3.684A18.681 18.681 0 0121.86 12a18.684 18.684 0 01-2.464 3.316C17.605 17.226 15.101 19 12 19c-3.1 0-5.604-1.774-7.395-3.684a18.68 18.68 0 01-2.03-2.609zM23 12l.894-.448c.14.282.14.614 0 .896L23 12z"
        fill={props.color}
      />
      <Path
        d="M.106 11.552L1 12l-.894.447a1.001 1.001 0 010-.895z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgUnhidden;
