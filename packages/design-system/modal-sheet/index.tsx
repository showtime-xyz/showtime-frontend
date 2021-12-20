import { useCallback, useMemo, useState } from 'react'
import { useWindowDimensions } from 'react-native'
import { Modal } from '../modal'
import { BottomSheet } from '../bottom-sheet'
import { Header } from '../modal/header'

type Props = {
	children: React.ReactElement
	title?: string
	visible?: boolean,
	close?: () => void;
	onClose?: () => void
}

export function ModalSheet({ visible = true, ...props}: Props) {
	const { width } = useWindowDimensions()

	const renderHandleComponent = useCallback(
		handleProps => <Header title={props.title} close={props.close} {...handleProps} />,
		[props.title, props.close]
	)

	if (width >= 1024) {
		return (
			<Modal key={`modalsheet-${props.title}`} title={props.title} close={props.onClose}>
				{props.children}
			</Modal>
		)
	}

	return (
		<BottomSheet
			key={`modalsheet-${props.title}`}
			visible={visible}
			handleComponent={renderHandleComponent}
			onDismiss={props.onClose}
		>
			{props.children}
		</BottomSheet>
	)
}
