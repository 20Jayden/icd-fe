<template>
	<li :class="{ active: toolStore.activeName === 'freehand' }">
		<a @click="onActiveChange">펜</a>
	</li>
</template>

<script>
// basic
import { watch } from 'vue'
// composition
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
		let penDraw
		const toolStore = useToolStore()

		watch(
			() => toolStore.activeName,
			() => {
				if (toolStore.activeName === 'freehand') {
					console.log('freehand 활성화')
					drawPen()
				} else {
					if (penDraw) {
						penDraw.inactive()
						console.log('freehand 비활성화')
					}
				}
			}
		)

		const onActiveChange = () => {
			if (toolStore.activeName != 'freehand') {
				// emit('change-name', 'freehand')
				toolStore.activeName = 'freehand'
			} else {
				// emit('change-name', '')
				toolStore.activeName = ''
			}
		}

		// pen 생성
		const drawPen = () => {
			const drawLayer = WGMap.getLayerById('drawLayer')
			const drawSource = drawLayer.getSource()
			const isFreehand = toolStore.activeName === 'freehand' ? true : false

			penDraw = new Draw({
				source: drawSource,
				type: 'LineString',
				freehand: isFreehand,
				styleName: 'linestring',
				style: drawStyle,
			})

			// Esc 클릭 시 Interaction 초기화
			$(document).keydown(function (event) {
				if (event.keyCode == 27) {
					penDraw.abortDrawing()
				}
			})
			penDraw.active()
		}

		const drawStyle = function (feature) {
			var styles = []
			//점선
			if (feature.getGeometry().getType() == 'LineString') {
				styles.push(
					new wg.style.Style({
						stroke: new wg.style.Stroke({
							color: '#ff008e',
							lineDash: [2, 15],
							width: 3,
							lineCap: 'round',
							lineJoin: 'round',
							lineDashOffset: 10,
						}),
					})
				)
			}
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

		return { onActiveChange, toolStore, drawStyle }
	},
}
</script>

<style scoped></style>
