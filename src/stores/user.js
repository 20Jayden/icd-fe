import { defineStore } from 'pinia'
import authApi from '@/api/auth'
import router from '@/router'

export const useUserStore = defineStore({
	id: 'user',
	state: () => ({
		loginUser: {
			id: '',
			name: '',
			org: '',
			eml: '',
			auth: '',
			ogdpCd: '',
			taskTkcgCd: '',
			ogdpNm: '',
		},
	}),
	getters: {
		async getLoginUser(state) {
			let ret = {}
			if (!state.loginUser.id) {
				const token = localStorage.getItem('spta-t')
				if (token) {
					await this.reqLoginUser()
					ret = state.loginUser
				}
			}
			return ret
		},
	},
	actions: {
		setLoginUser(payload) {
			this.loginUser = payload
		},
		async reqLoginUser() {
			const response = await authApi.loginInfo()

			if (response) {
				const { status, data } = response
				const { id, name, org, eml, auth, ogdpCd, taskTkcgCd, ogdpNm } = data
				this.setLoginUser({ id, name, org, eml, auth, ogdpCd, taskTkcgCd, ogdpNm })
			} else {
				// alert('세션이 종료되었습니다.\n로그인페이지로 돌아갑니다.')
				// localStorage.removeItem('egis-t')
				// router.push({ name: 'login' })
			}
		},
	},
})
