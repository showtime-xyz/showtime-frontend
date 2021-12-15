import { useRef, useMemo, useCallback, useEffect } from 'react'
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet'

import { View } from 'design-system/view'
import { tw } from 'design-system/tailwind'

type BottomSheetProps = {
	children?: React.ReactElement
	visible?: boolean
	onDismiss?: () => void
}

export const BottomSheet = (props: BottomSheetProps) => {
	const { children, visible, onDismiss } = props

	const bottomSheetModalRef = useRef<BottomSheetModal>(null)

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
			backgroundStyle={tw.style(`bg-white dark:bg-black rounded-t-[32px]`)}
			snapPoints={snapPoints}
		>
			<View tw="flex-1 pt-6 px-4">{children}</View>
		</BottomSheetModal>
	)
}
