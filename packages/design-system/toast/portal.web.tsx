import { createPortal } from 'react-dom'
import { View, StyleSheet } from 'react-native'

export const Portal = (props: any) => {
	return createPortal(
		<View style={[{ position: 'absolute' }, StyleSheet.absoluteFill]} pointerEvents="box-none">
			{props.children}
		</View>,
		document.body
	)
}
