import AppContext from '@/context/app-context'
import { useContext } from 'react'

export default function useProfile() {
	const { myProfile, setMyProfile } = useContext(AppContext)

	return { myProfile, setMyProfile }
}
