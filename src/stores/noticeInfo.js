import { defineStore } from 'pinia'

export const useNoticeInfoStore = defineStore({
	id: 'noticeInfo',
	state: () => ({
		noticeInfo: {},
	}),
})
