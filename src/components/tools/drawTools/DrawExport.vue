<template>
	<li :class="{ active: toolStore.activeName === 'export' }">
		<a @click="onActiveChange">저장</a>
	</li>
</template>

<script>
import { useToolStore } from '@/stores/tool'

export default {
	props: {
		active: {
			type: Boolean,
			default: false,
		},
		activeName: {
			type: String,
			default: '',
		},
	},
	emits: ['change-name'],
	setup(props, { emit }) {
		const toolStore = useToolStore()
		const onActiveChange = () => {
			// emit('change-name', '')
			toolStore.activeName = ''
			onSaveFeature()
		}

		// Export Action
		const onSaveFeature = () => {
			const drawLayer = WGMap.getLayerById('drawLayer')
			const drawSource = drawLayer.getSource()

			drawSource.getFeatures().forEach((feature) => {
				console.log('feature', feature)

				const style = feature.getStyle()
				if (style) {
					let property = {}
					let styleName = feature.get('styleName')

					if (styleName === 'point') {
						const image = style.getImage()
						property = {
							'stroke-color': image.getStroke().getColor(),
							'fill-color': image.getFill().getColor(),
							radius: image.getRadius(),
						}
					} else if (styleName === 'lineString') {
						property = {
							'stroke-color': style.getStroke().getColor(),
							'stroke-width': style.getStroke().getWidth(),
						}
					} else if (styleName === 'polygon') {
						property = {
							'fill-color': style.getFill().getColor(),
							'stroke-color': style.getStroke().getColor(),
							'stroke-width': style.getStroke().getWidth(),
						}
					} else if (styleName === 'text') {
						const text = style.getText()
						property = {
							font: text.getFont(),
							'fill-color': text.getFill().getColor(),
							'stroke-color': text.getStroke().getColor(),
							'stroke-width': text.getStroke().getWidth(),
						}
					} else if (styleName === 'circle') {
						property = {
							'fill-color': style.getFill().getColor(),
							'stroke-color': style.getStroke().getColor(),
							'stroke-width': style.getStroke().getWidth(),
						}
					}

					feature.set('style', JSON.stringify(property))
				}
			})

			const geoJson = new wg.format.GeoJSON().writeFeatures(drawSource.getFeatures())
			console.log(geoJson)
			const blob = new Blob([JSON.stringify(geoJson)], { type: 'application/json' })
			saveAs(blob, 'draw.json')
		}
		return { onActiveChange, toolStore }
	},
}
</script>

<style scoped></style>
