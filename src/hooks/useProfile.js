import axios from '@/lib/axios'
import useSWR from 'swr'

export default function useProfile() {
	const {
		data: profile,
		error,
		revalidate,
		mutate,
	} = useSWR(
		'/api/profile',
		url =>
			axios.get(url).then(
				({
					data: {
						data: { profile },
					},
				}) => ({
					...profile,
					notifications_last_opened: profile.notifications_last_opened ? new Date(profile.notifications_last_opened) : null,
					links: profile.links.map(link => ({
						name: link.type__name,
						prefix: link.type__prefix,
						icon_url: link.type__icon_url,
						type_id: link.type_id,
						user_input: link.user_input,
					})),
				})
			),
		{ revalidateOnFocus: false, shouldRetryOnError: false }
	)

	return { profile, error, loading: !profile && !error, revalidate, mutate }
}
