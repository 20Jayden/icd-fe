import { $api } from './api.config'
import { RTMSTREND } from './api.url'

/**
 * 실거래 동향 api
 */
export default {
	// 실거래 가격변동률 현황
	getRtmsPriceRate: async (payload) => await $api.get(RTMSTREND.RTMS_PRICE_RATE, { params: { ...payload } }),
	// 실거래 거래량변동률 현황
	getRtmsTradeRate: async (payload) => await $api.get(RTMSTREND.RTMS_TRADE_RATE, { params: { ...payload } }),
	// 법원 경매정보 추이
	getRtmsLawAuction: async (payload) => await $api.get(RTMSTREND.LAW_AUCN_INFO, { params: { ...payload } }),
	// 시계열 - 실거래 가격변동률 추이
	getTimelineRtmsPriceRate: async (payload) =>
		await $api.get(RTMSTREND.TMLN_RTMS_PRICE_RATE, { params: { ...payload } }),
	// 시계열 - 실거래 거래량변동률 추이
	getTimelineRtmsTradeRate: async (payload) =>
		await $api.get(RTMSTREND.TMLN_RTMS_TRADE_RATE, { params: { ...payload } }),
	// 시계열 - 법원 경매정보 추이
	getTimelineLawAuction: async (payload) => await $api.get(RTMSTREND.TMLN_LAW_AUCN, { params: { ...payload } }),
	// 실거래 유형별 거래현황
	getRtmsTypeRate: async (payload) => await $api.get(RTMSTREND.RTMS_TYPE_RATE, { params: { ...payload } }),
}
