import { defineStore } from 'pinia'

export const useLoadingStore = defineStore({
	id: 'loading',
	state: () => ({
		isLoading: false,
	}),
	actions: {
		setViewState(param) {
			Object.assign(this.$state, param)
		},
	},
})
