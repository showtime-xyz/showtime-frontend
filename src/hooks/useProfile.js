import axios from '@/lib/axios'
import useSWR from 'swr'

export default function useProfile() {
	const { data: profile, error, revalidate, mutate } = useSWR('/api/profile', url => axios.get(url).then(res => res.data.data.profile), { revalidateOnFocus: false, shouldRetryOnError: false })

	return { profile, error, loading: !profile && !error, revalidate, mutate }
}
