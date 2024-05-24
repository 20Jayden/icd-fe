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
			// 건물 노후도 레이어 일경우
			if (props.layer.layerSequence == 10) {
				return `/gis/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=${props.layer.layerWorkSpace}:${props.layer.layerId}&RULE=40`
			} else if (props.layer.layerVectorCode == 'AB003') {
				return `/gis/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=${props.layer.layerWorkSpace}:${props.layer.layerId}`
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
