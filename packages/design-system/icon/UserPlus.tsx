import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

function SvgUserPlus(props: SvgProps) {
	return (
		<Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
			<Path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M8.5 2a5 5 0 100 10 5 5 0 000-10zm-3 5a3 3 0 116 0 3 3 0 01-6 0z"
				fill={props.color}
			/>
			<Path
				d="M5 14a5 5 0 00-5 5v2a1 1 0 102 0v-2a3 3 0 013-3h7a3 3 0 013 3v2a1 1 0 102 0v-2a5 5 0 00-5-5H5zM20 7a1 1 0 011 1v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2h-2a1 1 0 110-2h2V8a1 1 0 011-1z"
				fill={props.color}
			/>
		</Svg>
	)
}

export default SvgUserPlus
