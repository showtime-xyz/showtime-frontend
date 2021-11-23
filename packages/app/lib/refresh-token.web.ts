export function setRefreshToken(token: string) {
	localStorage.setItem('refresh-token', token)
}

export function getRefreshToken() {
	return localStorage.getItem('refresh-token')
}

export function deleteRefreshToken() {
	localStorage.removeItem('refresh-token')
}
