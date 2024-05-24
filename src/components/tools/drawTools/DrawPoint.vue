<template>
	<li :class="{ active: toolStore.activeName === 'Point' }">
		<a @click="onActiveChange">점</a>
	</li>
</template>

<script>
import { watch } from 'vue'
import Draw from '@/composition/draw'
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
		// store
		const toolStore = useToolStore()
		let pointDraw

		watch(
			() => toolStore.activeName,
			() => {
				if (toolStore.activeName === 'Point') {
					console.log('Point 활성화')
					drawPoint()
				} else {
					if (pointDraw) {
						pointDraw.inactive()
						console.log('Point 비활성화')
					}
				}
			}
		)

		const onActiveChange = () => {
			if (toolStore.activeName != 'Point') {
				// emit('change-name', 'Point')
				toolStore.activeName = 'Point'
			} else {
				// emit('change-name', '')
				toolStore.activeName = ''
			}
		}

		// point 생성
		const drawPoint = () => {
			const drawLayer = WGMap.getLayerById('drawLayer')
			const drawSource = drawLayer.getSource()

			pointDraw = new Draw({
				source: drawSource,
				type: 'Point',
				styleName: toolStore.activeName.toLowerCase(),
				style: drawStyle,
			})

			pointDraw.active()
		}

		const drawStyle = function (feature) {
			var styles = []
			// 마우스 포인터 스타일 추가
			styles.push(
				new wg.style.Style({
					image: new wg.style.Circle({
						radius: 5,
						fill: new wg.style.Fill({
							color: 'white',
						}),
						stroke: new wg.style.Stroke({
							color: '#ff008e',
							width: 2,
						}),
					}),
					geometry: new wg.geom.Point(feature.getGeometry().getLastCoordinate()),
				})
			)

			return styles
		}

		return { onActiveChange, toolStore }
	},
}
</script>

<style scoped></style>
