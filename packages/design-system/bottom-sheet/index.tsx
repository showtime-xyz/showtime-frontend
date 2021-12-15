import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import { useEffect } from 'react'
import { useRef, useMemo, useCallback } from 'react'
import { StyleSheet } from 'react-native'
import { View } from '../view'

type BottomSheetProps = {
	children?: React.ReactElement
	visible?: boolean
	onDismiss?: () => void
}

export const BottomSheet = (props: BottomSheetProps) => {
	const { children, visible, onDismiss } = props

	const bottomSheetModalRef = useRef<BottomSheetModal>(null)

	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present()
	}, [])

	useEffect(() => {
		if (visible) {
			bottomSheetModalRef.current?.present()
		} else {
			bottomSheetModalRef.current?.close()
		}
	}, [visible])

	const snapPoints = useMemo(() => ['50%', '75%'], [])

	const renderBackdrop = useCallback(
		props => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
		[]
	)

	return (
		<BottomSheetModal
			backdropComponent={renderBackdrop}
			onDismiss={onDismiss}
			ref={bottomSheetModalRef}
			index={0}
			snapPoints={snapPoints}
		>
			{children}
		</BottomSheetModal>
	)
}
