import { useContext } from 'react'
import AppContext from '@/context/app-context'

const GridTabs = ({ children, title, sortingBar }) => {
	const context = useContext(AppContext)

	return (
		<div className={`w-full ${context.isMobile ? `${sortingBar ? 'mx-4 mb-2.5' : 'mx-4 mb-5'}` : `${sortingBar ? 'mx-3 mb-2' : 'mx-3 mb-7'}`}`}>
			{title && <h3 className="text-2xl md:text-4xl px-2.5">{title}</h3>}
			<div className="flex border-b">{children}</div>
		</div>
	)
}

const GridTab = ({ label, itemCount, isActive, onClickTab }) => {
	const cleanItemCount = () => {
		if (itemCount === null || itemCount === undefined) return null
		if (itemCount === 0) return '0'
		return Number(itemCount) < 150 ? Number(itemCount) : '150+'
	}

	return (
		<div className={`text-sm md:text-base w-max py-3.5 mr-6 whitespace-nowrap cursor-pointer border-b-2 ${isActive ? 'border-stpink' : 'border-transparent hover:opacity-60'} transition`} onClick={onClickTab}>
			{cleanItemCount() && <div className={`${isActive ? '' : 'text-gray-400'} mr-1`}>{cleanItemCount()}</div>}
			<span>{label}</span>
		</div>
	)
}

export { GridTabs, GridTab }
