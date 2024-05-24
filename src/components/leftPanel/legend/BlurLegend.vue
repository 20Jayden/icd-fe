<template>
	<i class="legend-blur-icon"><img src="/assets/images/legend_blur.jpg" /></i>
</template>

<script>
import { computed } from 'vue'
export default {
	props: {
		layer: {
			type: Object,
			default: () => {},
		},
	},
	setup(props) {
		return {}
	},
}
</script>

<style scoped>
.legend-blur-icon {
	width: 22px !important;
	height: 20px !important;
	bottom: 1px;
}
</style>
