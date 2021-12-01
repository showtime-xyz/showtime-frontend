import { MMKV } from 'react-native-mmkv'

export function setLogout(logout: string) {
	const storage = new MMKV()
	storage.set('logout', logout)
}

export function getLogout() {
	const storage = new MMKV()
	return storage.getString('logout')
}

export function deleteLogout() {
	const storage = new MMKV()
	storage.delete('logout')
}
