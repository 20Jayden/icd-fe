import { $api } from './api.config'
import { HOUSETREND } from './api.url'

export default {
	// 가격변동률 현황
	getPriceRate: async (payload) => await $api.get(HOUSETREND.PRICE_RATE, { params: { ...payload } }),
	// 가격지수 현황
	getPriceIndex: async (payload) => await $api.get(HOUSETREND.PRICE_INDEX, { params: { ...payload } }),
	// 실거래 가격변동률 현황
	getRtmsPriceRate: async (payload) => await $api.get(HOUSETREND.RTMS_PRICE_RATE, { params: { ...payload } }),
	// 실거래 가격지수 현황
	getRtmsPriceIndex: async (payload) => await $api.get(HOUSETREND.RTMS_PRICE_INDEX, { params: { ...payload } }),
	// 아파트 가격변동률 현황
	getAptPriceRate: async (payload) => await $api.get(HOUSETREND.APT_PRICE_RATE, { params: { ...payload } }),
	// 재건축vs아파트 가격변동률 현황
	getRebuildAptPriceRate: async (payload) => await $api.get(HOUSETREND.RBLD_APT_PRICE_RATE, { params: { ...payload } }),

	// 가격변동률 현황 요약 (서울,수도권)
	getPriceRateSummary: async (payload) => await $api.get(HOUSETREND.PRICE_RATE_SUMMARY, { params: { ...payload } }),
	// 가격지수 현황 요약 (서울,수도권)
	getPriceIndexSummary: async (payload) => await $api.get(HOUSETREND.PRICE_INDEX_SUMMARY, { params: { ...payload } }),
	// 실거래 가격변동률 현황
	getRtmsPriceRateSummary: async (payload) =>
		await $api.get(HOUSETREND.RTMS_PRICE_RATE_SUMMARY, { params: { ...payload } }),
	// 실거래 가격지수 현황
	getRtmsPriceIndexSummary: async (payload) =>
		await $api.get(HOUSETREND.RTMS_PRICE_INDEX_SUMMARY, { params: { ...payload } }),
	// 아파트 가격변동률 현황
	getAptPriceRateSummary: async (payload) =>
		await $api.get(HOUSETREND.APT_PRICE_RATE_SUMMARY, { params: { ...payload } }),
	// 재건축vs아파트 가격변동률 현황
	getRebuildAptPriceRateSummary: async (payload) =>
		await $api.get(HOUSETREND.RBLD_APT_PRICE_RATE_SUMMARY, { params: { ...payload } }),

	// 시계열 가격변동률 추이
	getTimelinePriceRate: async (payload) => await $api.get(HOUSETREND.TMLN_PRICE_RATE, { params: { ...payload } }),
	// 시계열 가격변동률(가격지수) 비교 추이
	getTimelinePriceRateCompare: async (payload) =>
		await $api.get(HOUSETREND.TMLN_PRICE_RATE_CMPR, { params: { ...payload } }),

	// 시계열 실거래 가격변동률 추이
	getTimelineRtmsPriceRate: async (payload) =>
		await $api.get(HOUSETREND.TMLN_RTMS_PRICE_RATE, { params: { ...payload } }),
	// 시계열 가격변동률(가격지수) 비교 추이
	getTimelineRtmsPriceRateCompare: async (payload) =>
		await $api.get(HOUSETREND.TMLN_RTMS_PRICE_RATE_CMPR, { params: { ...payload } }),

	// 시계열 아파트 가격변동률 추이
	getTimelineAptPriceRate: async (payload) =>
		await $api.get(HOUSETREND.TMLN_APT_PRICE_RATE, { params: { ...payload } }),

	// 시계열 재건축vs일반아파트 가격변동률 추이
	getTimelineRebuildAptPriceRate: async (payload) =>
		await $api.get(HOUSETREND.TMLN_RBLD_APT_PRICE_RATE, { params: { ...payload } }),
}
