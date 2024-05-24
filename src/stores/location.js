import { defineStore } from 'pinia'

export const useLocationStore = defineStore({
	id: 'location',
	state: () => ({
		umdOptions: [],
		selectedSgg: {},
		selectedUmd: {},
	}),
	getters: {},
	actions: {
		setViewState(param) {
			Object.assign(this.$state, param)
		},
	},
})
