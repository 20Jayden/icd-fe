import { $api } from './api.config'
import { MONITOR } from './api.url'

export const monitorBottom = {
	list: async (standDate) => await $api.get(MONITOR.LIST.PLCY.replace('{stand-date}', standDate)),
	getGeometryByPnu: async (pnu) => await $api.get(MONITOR.GEOMETRY.replace('{pnu}', pnu)),
	getGeometryListByPnu: async (pnuList) => await $api.post(MONITOR.LIST.GEOMETRY, pnuList),
	sendMail: async () => await $api.get(MONITOR.EMAIL.SEND),
	updateUserEmlInfo: async (userId) => await $api.get(MONITOR.EMAIL.UPDATE.replace('{userId}', userId)),
	kabInsDt: async () => await $api.get(MONITOR.DATE.KAB_LATEST),
	kabTradeInsDt: async () => await $api.get(MONITOR.DATE.KAB_TRADE_LATEST),
}

// 실거래 모니터링
export const rtmsMonitoring = {
	list: async (payload, pagination) =>
		await $api.get(MONITOR.RTMS.LIST, {
			params: { ...payload, ...pagination },
			arrayFormat: 'repeat',
		}),
	summary: async (level, payload) => await $api.get(MONITOR.RTMS.SUMMARY, { params: { level, ...payload } }),
	summaryDetail: async (pnu, payload, pagination) =>
		await $api.get(MONITOR.RTMS.SUMMARY_DETAIL.replace('{pnu}', pnu), { params: { ...payload, ...pagination } }),
}

// 아파트 모니터링
export const aptMonitoring = {
	// 목록 조회
	list: async (payload, pagination, sggCd, umdCd) =>
		await $api.get(MONITOR.APT.LIST, {
			params: { ...payload, ...pagination, sggCd, umdCd },
			arrayFormat: 'repeat',
		}),
	// 지도 circle 요약정보 조회
	summary: async (level, payload) => await $api.get(MONITOR.APT.SUMMARY, { params: { level, ...payload } }),
	// 지도 pnu레벨 상세정보 팝업 조회
	summaryDetail: async (pnu, gapRtLevel, payload, pagination) =>
		await $api.get(MONITOR.APT.SUMMARY_DETAIL.replace('{pnu}', pnu), {
			params: { gapRtLevel, ...payload, ...pagination },
		}),
	// 임계치 선택시 거래목록 조회 (좌측 리스트)
	summaryDeals: async (gapRtLevel, sggCd, umdCd, payload, pagination) =>
		await $api.get(MONITOR.APT.SUMMARY_DEALS, {
			params: { gapRtLevel, sggCd, umdCd, ...payload, ...pagination },
		}),
	// 임계치 선택시 거래목록 엑셀 다운로드
	summaryDealsExcel: async (gapRtLevel, sggCd, umdCd, payload) =>
		await $api.get(MONITOR.APT.SUMMARY_DEALS_EXCEL, {
			params: { gapRtLevel, sggCd, umdCd, ...payload },
			responseType: 'blob',
		}),
	// 임계치 선택시 위치 및 건수 피쳐정보 조회
	summaryDealsCoord: async (gapRtLevel, sggCd, umdCd, payload) =>
		await $api.get(MONITOR.APT.SUMMARY_DEALS_COORD, {
			params: { gapRtLevel, sggCd, umdCd, ...payload },
		}),
}

// 전월세 모니터링
export const rentMonitoring = {
	list: async (payload, pagination) =>
		await $api.get(MONITOR.RENT.LIST, {
			params: { ...payload, ...pagination },
			arrayFormat: 'repeat',
		}),
	summary: async (level, payload) => await $api.get(MONITOR.RENT.SUMMARY, { params: { level, ...payload } }),
	summaryDetail: async (pnu, payload, pagination) =>
		await $api.get(MONITOR.RENT.SUMMARY_DETAIL.replace('{pnu}', pnu), { params: { ...payload, ...pagination } }),
}

// 부동산시장 모니터링
export const marketMonitoring = {
	list: async (payload, pagination) =>
		await $api.get(MONITOR.MARKET.LIST, {
			params: { ...payload, ...pagination },
			arrayFormat: 'repeat',
		}),
	summary: async (level, payload) => await $api.get(MONITOR.MARKET.SUMMARY, { params: { level, ...payload } }),
	summaryDetail: async (pnu, id, level, payload) =>
		await $api.get(MONITOR.MARKET.SUMMARY_DETAIL.replace('{pnu}', pnu), { params: { id, level, ...payload } }),
	summaryDetailStat: async (pnu, id, level, payload) =>
		await $api.get(MONITOR.MARKET.SUMMARY_DETAIL_STAT.replace('{pnu}', pnu), { params: { id, level, ...payload } }),
}
