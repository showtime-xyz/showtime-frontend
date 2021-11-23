import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

function SvgFile(props: SvgProps) {
	return (
		<Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
			<Path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M3.879 1.879A3 3 0 016 1h7a1 1 0 01.707.293l7 7A1 1 0 0121 9v11a3 3 0 01-3 3H6a3 3 0 01-3-3V4a3 3 0 01.879-2.121zM6 3a1 1 0 00-1 1v16a1 1 0 001 1h12a1 1 0 001-1V10h-6a1 1 0 01-1-1V3H6zm8 1.414L17.586 8H14V4.414z"
				fill={props.color}
			/>
		</Svg>
	)
}

export default SvgFile
