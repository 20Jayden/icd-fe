import { defineStore } from 'pinia'
import { watch } from 'vue'

export const useDrawStore = defineStore({
	id: 'draw',
	state: () => ({
		drawInteraction: {},
		selectInteraction: {},
		textValue: '',
	}),
	actions: {
		setViewState(param) {
			watch(this.$state.drawInteraction, (state) => {
				if (state) {
					this.$state.drawInteraction.active()
				}
			})
			Object.assign(this.$state, param)
		},
	},
})
