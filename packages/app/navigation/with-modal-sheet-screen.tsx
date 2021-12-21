import React, { FC, useCallback, useState } from 'react'
import { ModalSheet } from 'design-system/modal-sheet'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { useRouter } from './use-router'

function withModalSheetScreen<P>(Screen: FC<P>, title?: string) {
	return function (props: P) {
		const [visible, setVisible] = useState(true)

		const { pop } = useRouter()

		const close = useCallback(() => setVisible(false), [])
		const onClose = useCallback(() => {
			pop()
		}, [])

		// TODO: extract title from navigation descriptor
		return (
			<BottomSheetModalProvider>
				<ModalSheet title={title} visible={visible} close={close} onClose={onClose}>
					<Screen {...props} />
				</ModalSheet>
			</BottomSheetModalProvider>
		)
	}
}

export { withModalSheetScreen }
