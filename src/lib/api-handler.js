import nc from 'next-connect'
import { captureException, withScope, Handlers } from '@sentry/nextjs'
import { addExceptionMechanism } from '@sentry/utils'

const { parseRequest } = Handlers

const handler = nc({
	onError: (err, req, res) => {
		// Log the exception on Sentry
		withScope(scope => {
			scope.addEventProcessor(event => {
				addExceptionMechanism(event, { handled: false })

				return parseRequest(event, req)
			})

			captureException(err)
		})

		res.status(500).send('Internal Server Error')
	},
})

export default handler
