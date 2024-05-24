import { defineStore } from 'pinia'

export const useStatsStore = defineStore({
	id: 'stats',
	state: () => ({
		type: '', // 통계구분 (lnb)
		id: '', // 통계id
		name: '', // 통계명
		activeTab: 'chart',
		data: [],
		paramNames: [],
		chart: null,
		hoverFeature: null,
	}),
	getters: {},
	actions: {
		setType(type) {
			this.$state.type = type
		},
		setId(id) {
			this.$state.id = id
		},
		setName(name) {
			this.$state.name = name
		},
		setData(data) {
			this.$state.data = data
		},
		setParamNames(paramNames) {
			this.$state.paramNames = paramNames
		},
		setChart(instance) {
			this.$state.chart = instance
		},
		resetState() {
			this.$state.id = ''
			this.$state.name = ''
			this.$state.data = []
		},
	},
})
