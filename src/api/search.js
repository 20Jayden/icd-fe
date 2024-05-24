import { $api } from './api.config'
import { SEARCH } from './api.url'

export default {
	// 실거래 공개 목록 조회
	getKabList: async (payload, pagination) =>
		await $api.get(SEARCH.DEAL.LIST.KAB, {
			params: { ...payload, ...pagination },
			arrayFormat: 'repeat',
		}),
	// 자치구 실거래 목록 조회
	getPlcyList: async (payload, pagination) =>
		await $api.get(SEARCH.DEAL.LIST.PLCY, {
			params: { ...payload, ...pagination },
			arrayFormat: 'repeat',
		}),
	// 실거래공개 상세정보
	getKabInfo: async (id) => await $api.get(SEARCH.DEAL.INFO.KAB, { params: { id } }),
	// 자치구실거래 상세정보
	getPlcyInfo: async (id) => await $api.get(SEARCH.DEAL.INFO.PLCY, { params: { id } }),
}
