import { useWindowDimensions } from 'react-native'
import { FullWindowOverlay } from 'react-native-screens'

export const Portal = (props: any) => {
	const { width: windowWidth, height: windowHeight } = useWindowDimensions()

	return (
		<FullWindowOverlay
			style={{ position: 'absolute', height: windowHeight, width: windowWidth }}
			pointerEvents="box-none"
		>
			{props.children}
		</FullWindowOverlay>
	)
}
