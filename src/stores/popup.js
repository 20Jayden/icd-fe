import { defineStore } from 'pinia'

export const usePopupStore = defineStore({
	id: 'popup',
	// state => store의 상태 데이터를 정의, 객체를 반환
	state: () => ({
		printPopupVisible: false,
		screenshotLegendVisible: false,
	}),
	actions: {
		setPopupState(param) {
			Object.assign(this.$state, param)
			//	'param'객체에는 상태 변수들의 값을 변경하기 위한 정보가 담겨있어야함.
		},
	},
})
