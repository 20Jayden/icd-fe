import { defineStore } from 'pinia'

export const useViewStore = defineStore({
	id: 'view',
	state: () => ({
		// basemap: 'Base',
		basemap: 'smapBase',
		isSatellite: false, // 영상지도 여부
		isSmapSatellite: false,
		isHybrid: false, // 하이브리드 여부
		lon: undefined, // 경도
		lat: undefined, // 위도
		zoom: undefined, // 줌레벨(2D)
		rotate: undefined, // 회전 (2D)
		disableZoomChange: true, //마우스 휠 고정
	}),
	getters: {
		getLevel() {
			const { zoom } = this.$state
			if (zoom >= 11 && zoom < 14) {
				return { value: 'sgg', text: '시군구' }
			} else if (zoom >= 14 && zoom < 16) {
				return { value: 'umd', text: '읍면동' }
			} else {
				return { value: '', text: '' }
			}
		},
	},
	actions: {
		setViewState(param) {
			Object.assign(this.$state, param)
		},
	},
})
