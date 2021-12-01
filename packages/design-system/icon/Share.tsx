import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

function SvgShare(props: SvgProps) {
	return (
		<Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
			<Path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M11.293 2.293a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L13 5.414V16a1 1 0 11-2 0V5.414L8.707 7.707a1 1 0 01-1.414-1.414l4-4z"
				fill={props.color}
			/>
			<Path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M6 12a1 1 0 00-1 1v6a1 1 0 001 1h12a1 1 0 001-1v-6a1 1 0 00-1-1h-2a1 1 0 110-2h2a3 3 0 013 3v6a3 3 0 01-3 3H6a3 3 0 01-3-3v-6a3 3 0 013-3h2a1 1 0 110 2H6z"
				fill={props.color}
			/>
		</Svg>
	)
}

export default SvgShare
