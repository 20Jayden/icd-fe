import { defineStore } from 'pinia'

export const useOverlayStore = defineStore({
	id: 'overlay',
	state: () => ({
		type: '1',
		title: 'Title',
		category: 'Category',
		addr: 'Address',
		lon: '',
		lat: '',
		isShow: false,
		pnu: '',
		geometries: [],
	}),
	getters: {},
	actions: {
		mergeState(param) {
			this.$state.isShow = false
			setTimeout(() => {
				Object.assign(this.$state, param)
				console.log('>>>>>')
			}, 0)
		},
	},
})
