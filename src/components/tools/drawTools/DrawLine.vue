<template>
	<li :class="{ active: toolStore.activeName === 'LineString' }">
		<a @click="onActiveChange">선</a>
	</li>
</template>

<script>
import Draw from '@/composition/draw'
import draw from '@/composition/drawStyle'
import { watch } from 'vue'
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
		let lineDraw
		const toolStore = useToolStore()
		watch(
			() => toolStore.activeName,
			() => {
				if (toolStore.activeName === 'LineString') {
					console.log('LineString 활성화')
					drawLine()
				} else {
					if (lineDraw) {
						lineDraw.inactive()
						console.log('Line 비활성화')
					}
				}
			}
		)

		const onActiveChange = () => {
			if (toolStore.activeName != 'LineString') {
				toolStore.activeName = 'LineString'
				emit('change-name', 'LineString')
			} else {
				// emit('change-name', '')
				toolStore.activeName = ''
			}
		}

		// line 생성
		const drawLine = () => {
			const drawLayer = WGMap.getLayerById('drawLayer')
			const drawSource = drawLayer.getSource()

			lineDraw = new Draw({
				source: drawSource,
				type: 'LineString',
				styleName: toolStore.activeName.toLowerCase(),
				style: drawStyle,
			})

			// Esc 클릭 시 Interaction 초기화
			$(document).keydown(function (event) {
				if (event.keyCode == 27) {
					lineDraw.finishDrawing()
				}
			})

			lineDraw.active()
		}

		const drawStyle = function (feature) {
			var styles = []
			// 점선
			if (feature.getGeometry().getType() == 'LineString') {
				var coordinates = feature.getGeometry().getCoordinates()
				styles.push(
					new wg.style.Style({
						geometry: new wg.geom.LineString(coordinates.slice(-2)),
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
				// 실선
				if (coordinates.length > 2) {
					styles.push(
						new wg.style.Style({
							geometry: new wg.geom.LineString(coordinates.slice(0, -1)),
							stroke: new wg.style.Stroke({
								color: '#ff008e',
								width: 2.5,
							}),
						})
					)
				}
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
