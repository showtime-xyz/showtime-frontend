import { useEffect } from 'react'

const ScrollableModal = ({ children, closeModal, contentWidth = '30rem', zIndex = 2 }) => {
	useEffect(() => {
		document.documentElement.style.overflow = 'hidden'

		return () => {
			document.documentElement.style.overflow = 'unset'
		}
	}, [])

	return (
		<div
			className="fixed bg-black bg-opacity-70 inset-0 overflow-auto text-center align-middle"
			onMouseDown={closeModal}
			style={{ zIndex: zIndex }}
		>
			<div
				className="relative outline-none max-w-[90%] my-5 px-auto align-middle inline-block h-[max-content]"
				style={{ zIndex: zIndex + 1, width: contentWidth }}
			>
				<div
					className="text-left bg-white dark:bg-gray-900 w-full gap-5 flex flex-col rounded-lg sm:rounded-2xl "
					onMouseDown={e => e.stopPropagation()}
				>
					{children}
				</div>
			</div>
		</div>
	)
}

export default ScrollableModal
