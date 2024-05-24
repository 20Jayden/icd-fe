import { $api } from './api.config'
import { LANDTREND } from './api.url'

export default {
	// 지가변동률 현황 조회
	getPriceRate: async (payload) => await $api.get(LANDTREND.PRICE_RATE, { params: { ...payload } }),
	// 토지, 건축물 거래 현황 조회
	getDealIndex: async (payload) => await $api.get(LANDTREND.DEAL_INDEX, { params: { ...payload } }),
	// 가격변동률 현황 요약 (서울,수도권)
	getPriceRateSummary: async (payload) => await $api.get(LANDTREND.PRICE_RATE_SUMMARY, { params: { ...payload } }),
	// 지가변동률 시계열 추이
	getTimelineLandPriceRate: async (payload) => await $api.get(LANDTREND.TMLN_PRICE_RATE, { params: { ...payload } }),
	// 지가변동률 지수 시계열 추이
	getTimelineLandPriceIndex: async (payload) => await $api.get(LANDTREND.TMLN_PRICE_INDEX, { params: { ...payload } }),
	// 지역별 토지, 건축물 거래
	getTimelineLandDealIndex: async (payload) => await $api.get(LANDTREND.TMLN_DEAL_INDEX, { params: { ...payload } }),
}
