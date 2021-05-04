import axios from '@/lib/axios'
import useSWR from 'swr'

export default function useAuth() {
	const { data: user, error } = useSWR('/api/auth/user', url => axios.get(url).then(res => res.data || null))

	return { user, error, loading: user === undefined }
}
