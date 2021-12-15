import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import { useRef, useMemo, useCallback, useEffect } from 'react'
import { View } from '../view'
import { tw } from '../tailwind'

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
			handleIndicatorStyle={tw.style(`bg-gray-300 dark:bg-gray-700 w-12 h-1`)}
			backgroundStyle={useMemo(
				() => [tw.style(`bg-white dark:bg-black`), { borderTopLeftRadius: 32, borderTopRightRadius: 32 }],
				[]
			)}
			snapPoints={snapPoints}
		>
			<View tw="pt-6 px-4" sx={{ flex: 1 }}>
				{children}
			</View>
		</BottomSheetModal>
	)
}
