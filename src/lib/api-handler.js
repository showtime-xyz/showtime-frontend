import nc from 'next-connect'
import { withSentry } from '@sentry/nextjs'
import Iron from '@hapi/iron'
import CookieService from '@/lib/cookie'

export default () =>
	nc({
		onError: (err, req, res, next) => {
			// Due to how the Sentry integration works, successful requests throw the request as an exception. Weird, I know.
			if (err == req) return next()

			if (process.env.NODE_ENV === 'development') {
				console.error(err)
				if (err.response.data.error.code === 429) return res.status(429).json(err.response.data.error)
				return res.status(500).json(err.response)
			}

			if (err.response.data.error.code === 429) return res.status(429).send(err.response.data.error)
			res.status(500).send('Internal Server Error')
		},
	})
		.use((req, res, next) => withSentry(next)(req, res))
		.use(async (req, _, next) => {
			await Iron.unseal(CookieService.getAuthToken(req.cookies), process.env.ENCRYPTION_SECRET_V2, Iron.defaults)
				.then(user => (req.user = user))
				.catch(() => null)

			next()
		})

export const middleware = {
	auth: ({ user }, res, next) => {
		if (!user) return res.status(401).json({ error: 'Unauthenticated.' })

		next()
	},
	guest: ({ user }, res, next) => {
		if (user) return res.status(401).json({ error: 'User is already authenticated.' })

		next()
	},
}
