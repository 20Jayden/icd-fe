import { $api } from './api.config'
import { LOGTABLE } from './api.url'

export default {
	log: async (target, action, message) =>
		await $api.post(LOGTABLE.LOG_TABLE.REGIST.LOGDATA, null, { params: { target, action, message } }),
	nLog: async (id, target, action, message) =>
		await $api.post(LOGTABLE.LOG_TABLE.REGIST.noTokenDATA, null, { params: { id, target, action, message } }),
}
