import { defineStore } from 'pinia'
import dayjs from 'dayjs'
// 허가 구역 관련 store
export const useAreaStore = defineStore({
	id: 'area',
	state: () => ({
		searchResult: [], // 허가구역 검색 결과
		listOfSgg: [], // 토지거래허가구역 전체 list
		featurePnuList: [], // 변동하는 필지리스트 pnu를 위한 arrayList
		standMonth: '',
		statType: 'price',
		selectedGroup: 'GRP00062',
		isChartVisible: false,
		groupStandMonth: dayjs().format('YYYY-MM'),
		groupPopStandMonth: dayjs().format('YYYY-MM'), // 허가구역 상세 팝업 기준 날짜 (TO)
		groupPopStandPreMonth: dayjs().subtract(11, 'month').format('YYYY-MM'), // 허가구역 상세 팝업 시작 날짜 (FROM)
		analysisPopStandMonth: dayjs().format('YYYY-MM'), // 허가구역 분석 팝업 기준 날짜 (TO)
		analysisPopStandPreMonth: dayjs().subtract(11, 'month').format('YYYY-MM'), // 허가구역 분석 팝업 시작 날짜 (FROM)
		propertyPopStandMonth: dayjs().format('YYYY-MM'), // 부동산 분석 팝업 기준 날짜 (TO)
		propertyPopStandPreMonth: dayjs().subtract(11, 'month').format('YYYY-MM'), // 부동산 분석 팝업 기준 날짜 (FROM)
		additionalPopStandMonth: dayjs().format('YYYY-MM'),
		additionalPopStandPreMonth: dayjs().subtract(11, 'month').format('YYYY-MM'),
		analysisArea: dayjs().format('YYYY-MM'),
		propertyStandMonth: dayjs().format('YYYY-MM'),
		groupStatType: 'price',
		areaStatType: 'price',
		propertyStatType: 'price',
		clickedGroup: '',
		dataOption: 'kab',
		areaOption: 'kab',
		propertyOption: 'kab',
		isSdw: true, // 허가구역 SDW 사업 레이어 ON/OFF 상태
		isInfoSys: true, // 허가구역 부동산종합정보시스템 사업 레이어 ON/OFF 상태
		isStRebuilt: true, // 허가구역 신통 재개발 사업 레이어 ON/OFF 상태
		isPbRebuilt: true, // 허가구역 공공 재개발 사업 레이어 ON/OFF 상태
		isReConstruct: true, // 허가구역 재건축 사업 레이어 ON/OFF 상태
		isStReConstruct: true, // 허가구역 신통 민간 재건축 사업 레이어 ON/OFF 상태
		isAreaEtc: true, // 허가구역 기타 사업 레이어 ON/OFF 상태
		isAreaCheck: false,			// 허가구역 제외 Check
		isOnlyAreaCheck: false,	// 허가구역만 Check
		areaPnuArray: [],
		areaLon: 0,
		areaLat: 0,
		additionStatType: 'price',
		additionOption: 'kab',
		loadingStat: false,
	}),
	getters: {},
	actions: {
		setSearchResult(result) {
			this.$state.searchResult = result
		},
		setStandMonth(month) {
			this.$state.standMonth = month
		},
		setStatType(type) {
			this.$state.statType = type
		},
		setSelectedGroup(group) {
			this.$state.selectedGroup = group
		},
		setIsChartVisible(visible) {
			this.$state.isChartVisible = visible
		},
		setListOfSgg(list) {
			this.$state.listOfSgg = list
		},
		setGroupStandMonth(month) {
			this.$state.groupStandMonth = month
		},
		setGroupStatType(type) {
			this.$state.groupStatType = type
		},
		setClickedGroup(group) {
			this.$state.clickedGroup = group
		},
		setIsInfoSys(isVisible) {
			this.$state.isInfoSys = isVisible
		},
		setIsSdw(isVisible) {
			this.$state.isSdw = isVisible
		},
		setIsStRebuilt(isVisible) {
			this.$state.isStRebuilt = isVisible
		},
		setIsPbRebuilt(isVisible) {
			this.$state.isPbRebuilt = isVisible
		},
		setIsReConstruct(isVisible) {
			this.$state.isReConstruct = isVisible
		},
		setIsStReConstruct(isVisible) {
			this.$state.isStReConstruct = isVisible
		},
		setIsAreaEtc(isVisible) {
			this.$state.isAreaEtc = isVisible
		},
		setDataOption(option) {
			this.$state.dataOption = option
		},
		setAnalysisArea(month) {
			this.$state.analysisArea = month
		},
		setAreaStatType(type) {
			this.$state.areaStatType = type
		},
		setPropertyStandMonth(month) {
			this.$state.propertyStandMonth = month
		},
		setPropertyStatType(type) {
			this.$state.propertyStatType = type
		},
		setAreaOption(option) {
			this.$state.areaOption = option
		},
		setPropertyOption(option) {
			this.$state.propertyOption = option
		},
		setIsAreaCheck(isCheck) {
			this.$state.isAreaCheck = isCheck
		},
		setIsOnlyAreaCheck(isCheck) {
			this.$state.isOnlyAreaCheck = isCheck
		},
		setAreaPnuArray(pnuArray) {
			this.$state.areaPnuArray = pnuArray
		},
		setGroupPopStandMonth(month) {
			this.$state.groupPopStandMonth = month
		},
		setGroupPopStandPreMonth(month) {
			this.$state.groupPopStandPreMonth = month
		},
		setAnalysisPopStandMonth(month) {
			this.$state.analysisPopStandMonth = month
		},
		setAnalysisPopStandPreMonth(month) {
			this.$state.analysisPopStandPreMonth = month
		},
		setPropertyPopStandMonth(month) {
			this.$state.propertyPopStandMonth = month
		},
		setPropertyPopStandPreMonth(month) {
			this.$state.propertyPopStandPreMonth = month
		},
		setAreaLon(lon) {
			this.$state.areaLon = lon
		},
		setAreaLat(lat) {
			this.$state.areaLat = lat
		},
		setAdditionalPopStandMonth(month) {
			this.$state.additionalPopStandMonth = month
		},
		setAdditionalPopStandPreMonth(month) {
			this.$state.additionalPopStandPreMonth = month
		},
		setAdditionStatType(type) {
			this.$state.additionStatType = type
		},
		setAdditionOption(option) {
			this.$state.additionOption = option
		},
		setLoadingStat(flag) {
			this.$state.loadingStat = flag
		},
	},
})
