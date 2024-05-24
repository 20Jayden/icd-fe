import { defineStore } from 'pinia'
import { useLoadingStore } from './loading'

export const useWmsStore = defineStore({
	id: 'wms',
	state: () => ({
		tileLoadCount: 0,
	}),
	actions: {
		setViewState(param) {
			Object.assign(this.$state, param)
		},
	},
})
