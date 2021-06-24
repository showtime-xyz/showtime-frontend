import handler from '@/lib/api-handler'

export default handler().get(async ({ user }, res) => {
	if (!user) return res.status(401).json({ error: 'Unauthenticated.' })

	res.json(user)
})
