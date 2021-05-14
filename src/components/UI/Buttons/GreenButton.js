const GreenButton = ({ loading, children, type = 'button', className = '', disabled = loading, ...props }) => (
	<button {...props} type={type} disabled={disabled} className={`bg-green-500 dark:bg-green-600 ${disabled ? (loading ? 'cursor-wait' : 'cursor-not-allowed') : 'hover:bg-green-400 dark:hover:bg-green-500 hover:border-green-400 dark:hover:border-green-500'} border-2 border-green-500 dark:border-green-600 text-green-100 transition px-4 py-2 float-right rounded-full w-36 ${className}`}>
		{loading ? (
			<div className="flex items-center justify-center">
				<div className="inline-block w-6 h-6 border-2 border-gray-100 dark:border-green-800 border-t-gray-800 dark:border-t-green-300 rounded-full animate-spin" />
			</div>
		) : (
			children
		)}
	</button>
)

export default GreenButton
