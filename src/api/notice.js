import { $api } from './api.config'
import { NOTICE } from './api.url'

export default {
	getNoticeList: async (condition1, condition2, condition3, startDate, endDate, keyword, pagination) =>
		await $api.get(NOTICE.INFO, {
			params: { condition1, condition2, condition3, startDate, endDate, keyword, ...pagination },
		}),
	inseartNotice: async (noticeDate) => await $api.post(NOTICE.INSEART, noticeDate),
	updateNotice: async (id, noticeDate) => await $api.put(NOTICE.UPDATE.replace('{id}', id), noticeDate),
	deleteNotice: async (id) => await $api.delete(NOTICE.DELETE.replace('{id}', id)),
	noticeList: async () => await $api.get(NOTICE.LIST),
	delteCheckList: async (id) => await $api.delete(NOTICE.DELETECHECK.replace('{id}', id)),
}
