import { $api } from './api.config'
import { USERINFO } from './api.url'

export default {
	// 로그인한 사용자 정보 조회
	getUserInfo: async (id) => await $api.get(USERINFO.LOGIN_USER_INFO.replace('{id}', id)),
	updatePassword: async (user) => await $api.post(USERINFO.UPDATE_PASSWORD, user),
}
