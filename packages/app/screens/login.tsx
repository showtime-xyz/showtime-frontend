import React from 'react'

import { Modal } from 'design-system'
import { Login } from 'app/components/login'

export function LoginScreen() {
	return (
		<Modal title="Sign In">
			<Login />
		</Modal>
	)
}
