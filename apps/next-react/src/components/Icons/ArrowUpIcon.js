export const ArrowUpIconOutline = ({ className = '' }) => (
	<svg
		className={className}
		viewBox="0 0 24 24"
		fill="currentColor"
		xmlns="http://www.w3.org/2000/svg"
		fillRule="evenodd"
		clipRule="evenodd"
	>
		<path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM3 12a9 9 0 113.382 7.032L14 11.414V16a1 1 0 102 0V9a1 1 0 00-1-1H8a1 1 0 100 2h4.586l-7.618 7.618A8.962 8.962 0 013 12z" />
	</svg>
)

export const ArrowUpIconSolid = ({ className = '' }) => (
	<svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
		<path d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11c-2.678 0-5.132-.957-7.04-2.547L14 11.414V16a1 1 0 102 0V9a1 1 0 00-1-1H8a1 1 0 000 2h4.586l-9.04 9.04A10.956 10.956 0 011 12z" />
	</svg>
)

const ArrowUpIcon = ArrowUpIconOutline

export default ArrowUpIcon
