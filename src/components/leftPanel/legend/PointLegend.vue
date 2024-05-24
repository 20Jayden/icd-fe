<template>
	<i><img :src="legendSrc" :alt="layer.layerDescription" /></i>
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
		const legendSrc = computed(() => {
			if (props.layer.layerVectorCode == 'AB001') {
				return `/gis/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=13&HEIGHT=13&LAYER=${props.layer.layerWorkSpace}:${props.layer.layerId}`
			} else {
				return null
			}
		})
		return { legendSrc }
	},
}
</script>

<style scoped>
img {
	width: 14px;
	height: 14px;
}
</style>
