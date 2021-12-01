import { MMKV } from 'react-native-mmkv'

export function setRefreshToken(token: string) {
	const storage = new MMKV()
	storage.set('refresh-token', token)
}

export function getRefreshToken() {
	const storage = new MMKV()
	return storage.getString('refresh-token')
}

export function deleteRefreshToken() {
	const storage = new MMKV()
	storage.delete('refresh-token')
}
