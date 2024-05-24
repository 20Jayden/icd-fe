import { defineStore } from 'pinia'
export const useMenuStore = defineStore({
	id: 'menu',
	state: () => ({
		lnbActive: 'search',
		analysisActive: '',
		settingActive: 'manageUser',
		clickActive: true,
		isAreaMenu: false, // 허가구역 접근 권한 유무 (분석기능 - 허가구역 분석 기능 표시 용도)
		rtmsTab: '',
	}),
	getters: {},
	actions: {
		setLnbActive(name) {
			this.$state.lnbActive = name
		},
		setAnalysisActive(name) {
			this.$state.analysisActive = name
		},
		setSettingActive(name) {
			this.$state.settingActive = name
		},
		setClickActive(flag) {
			this.$state.clickActive = flag
		},
		setIsAreaMenu(flag) {
			this.$state.isAreaMenu = flag
		},
		setRtmsTab(name) {
			this.$state.rtmsTab = name
		},
	},
})
