const GhostButton = ({ children, loading, type = 'button', className, ...props }) => (
	<button
		type={type}
		className={`border-2 text-gray-800 dark:text-gray-500 border-gray-800 dark:border-gray-500 ${
			loading
				? 'cursor-wait'
				: 'hover:border-gray-500 dark:hover:border-gray-400 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus-visible:ring-1'
		} px-4 py-2 rounded-full transition ${className}`}
		{...props}
	>
		{loading ? (
			<div className="flex items-center justify-center">
				<div className="inline-block w-6 h-6 border-2 border-gray-100 dark:border-gray-800 border-t-gray-800 dark:border-t-gray-300 rounded-full animate-spin" />
			</div>
		) : (
			children
		)}
	</button>
)

export default GhostButton
