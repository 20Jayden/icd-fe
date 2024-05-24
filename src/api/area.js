import { $api } from './api.config'
import { MANAGEAREA } from './api.url'

export default {
	// 지가변동률 현황 조회
	getManageArea: async (businessNm) => await $api.get(MANAGEAREA.AREA, { params: { businessNm } }),
	getManageSgg: async (searchInput, businessNm) =>
		await $api.get(MANAGEAREA.SGG, { params: { searchInput, businessNm } }),
	getAreaSearch: async (payload) => await $api.get(MANAGEAREA.AREA_SEARCH, { params: { ...payload } }),
	getAreaCenter: async () => await $api.get(MANAGEAREA.CENTER),
	getGeometryListByGroupCd: async (groupCd) => await $api.get(MANAGEAREA.GEOMETRY.replace('{groupCd}', groupCd)),
	getGroupCenter: async () => await $api.get(MANAGEAREA.GROUP_CENTER),
	getGroupStat: async (payload, monthArray) =>
		await $api.post(MANAGEAREA.GROUP_STAT, monthArray, { params: { ...payload } }),
	getGroupFeatureInfo: async (groupCd, fieldCheck, pagination) =>
		await $api.get(MANAGEAREA.GROUP_FEATURE, {
			params: { groupCd, fieldCheck, ...pagination },
		}),
	getCadaFeatureInfo: async (lon, lat, pagination) =>
		await $api.get(MANAGEAREA.CADA_FEATURE, {
			params: { lon, lat, ...pagination },
		}),
	cadaDetailExcel: async (lon, lat) =>
		await $api.get(MANAGEAREA.CADA_DETAIL_EXCEL, {
			params: { lon, lat },
			responseType: 'blob',
		}),
	getGroupDetailInfo: async (groupCd) => await $api.get(MANAGEAREA.GROUP_DETAIL.replace('{groupCd}', groupCd)),
	groupDetailExcel: async (groupCd, fieldCheck) =>
		await $api.get(MANAGEAREA.GROUP_DETAIL_EXCEL, {
			params: { groupCd, fieldCheck },
			responseType: 'blob',
		}),
	selectStatFromPnu: async (payload) => await $api.post(MANAGEAREA.AREA_ANALYSIS, payload),
	selectStatFromSection: async (payload) => await $api.post(MANAGEAREA.AREA_ANALYSIS_SECTION, payload),
	getSelectedFeatureInfo: async (pnuList, pagination) =>
		await $api.post(MANAGEAREA.AREA_SELECTED_FEATURE, pnuList, { params: { ...pagination } }),
	getSelectedFeatureInfoFromSection: async (subRangeCd, pagination) =>
		await $api.post(MANAGEAREA.AREA_SELECTED_FEATURE_SECTION, subRangeCd, { params: { ...pagination } }),
	pnuDetailExcel: async (pnuList) => await $api.post(MANAGEAREA.PNU_DETAIL_EXCEL, pnuList, { responseType: 'blob' }),
	pnuDetailExcelFromSection: async (rangeCd) =>
		await $api.post(MANAGEAREA.PNU_DETAIL_EXCEL_SECTION, rangeCd, { responseType: 'blob' }),
	BizDetailExcel: async (bizNm) =>
		await $api.get(MANAGEAREA.BIZ_DETAIL_EXCEL, { params: { bizNm }, responseType: 'blob' }),

	selectTradeList: async (requestData, pagination) =>
		await $api.post(MANAGEAREA.TRADE_LIST, requestData, { params: { ...pagination } }),

	selectTradeListFromSection: async (requestData, pagination) =>
		await $api.post(MANAGEAREA.TRADE_LIST_SECTION, requestData, { params: { ...pagination } }),

	selectTradeExcel: async (requestData) =>
		await $api.post(MANAGEAREA.TRADE_EXCEL, requestData, { responseType: 'blob' }),

	selectTradeExcelFromSection: async (requestData) =>
		await $api.post(MANAGEAREA.TRADE_EXCEL_SECTION, requestData, { responseType: 'blob' }),
	selectAreaTradeList: async (requestData, pagination) =>
		await $api.post(MANAGEAREA.AREA_TRADE, requestData, { params: { ...pagination } }),

	selectAreaTradeExcel: async (requestData) =>
		await $api.post(MANAGEAREA.AREA_TRADE_EXCEL, requestData, { responseType: 'blob' }),

	areaStatisticsExcel: async (payload) =>
		await $api.post(MANAGEAREA.AREA_STATISTICS_EXCEL, payload, { responseType: 'blob' }),
	selectStatisticsExcel: async (requestData) =>
		await $api.post(MANAGEAREA.STATISTICS_EXCEL, requestData, { responseType: 'blob' }),
}
