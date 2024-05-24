import { defineStore } from 'pinia'

export const useUserInfoStore = defineStore({
	id: 'userInfo',
	state: () => ({
		userInfo: {},
	}),
	// actions: {
	// 	setSelectUserInfo(user) {
	// 		this.selectUserInfo = user
	// 	},
	// },
})
