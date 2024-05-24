import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useColorStore = defineStore({
	id: 'colors',
	state: () => ({
		selectedColorList: [], // Db에 저장된 list
		colors: [], // json에 있는 색상 list
		activeIndex: -1,
		colorRange: [], // 범례 범위
		valueMins: [], // 음수 포함되어 있는 범례 Min(start) 리스트
		valueMaxs: [] // 음수 포함되어 있는 범례 Max(end) 리스트
	}),
	actions: {
		setSelectedColorList(color) {
			this.$state.selectedColorList = color
		},
		setColors(colors) {
			this.$state.colors = colors
		},
		setActiveIndex(index) {
			this.$state.activeIndex = index
		},
		setRange(data) {
			this.$state.colorRange = data
		},
	},
})
