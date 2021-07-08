import AppContext from '@/context/app-context'
import axios from '@/lib/axios'
import { useContext } from 'react'
import useSWR from 'swr'

export default function useProfile() {
	const { myProfile, setMyProfile } = useContext(AppContext)

	return { profile: myProfile, loading: !myProfile, revalidate: setMyProfile }
}

export const useMyInfo = () => useSWR('/api/profile', url => axios.get(url).then(({ data: { data } }) => data), { revalidateOnFocus: false, shouldRetryOnError: false, initialData: { profile: null, likes_nft: [], likes_comment: [], follows: [], comments: [] }, revalidateOnMount: true })
