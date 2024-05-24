<template>
	<li>
		<a @click="setDirectNorth()">정북전환</a>
	</li>
</template>

<script>
import { useViewStore } from '@/stores/view'

export default {
	props: {
		active: {
			type: Boolean,
			default: false,
		},
	},
	setup() {
		const viewStore = useViewStore()

		const setDirectNorth = () => {
			WGMap.getView().setRotation(0)
			viewStore.setViewState({ direct: 0, rotate: 0 })
		}
		return { setDirectNorth }
	},
}
</script>

<style></style>
