import { defineStore } from 'pinia'

export const useToolStore = defineStore('tool', {
	state: () => ({
		activeName: '',
		activePinMarker: false,
	}),
})
