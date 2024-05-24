import { $api } from './api.config'

import { AUTH } from './api.url'

export default {
	login: async (payload) => await $api.post(AUTH.LOGIN, payload),
	loginRefresh: async () => await $api.post(AUTH.LOGIN_REFRESH, { token: localStorage.getItem('spta-t') }),
	loginInfo: async () => await $api.get(AUTH.LOGIN_INFO),
	signup: async (payload) => await $api.post(AUTH.SIGNUP, payload),
	signupIdCheck: async (id) => await $api.get(AUTH.SIGNUP_ID_CHECK, { params: { id } }),
	is3DAuth: async () => await $api.get(AUTH.IS3DAUTH),
	databoardAuth: async () => await $api.get(AUTH.DATABOARD_AUTH),
}
