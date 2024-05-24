<template>
	<li :class="{ active: toolStore.activeName === 'Polygon' }">
		<a @click="onActiveChange">다각형</a>
	</li>
</template>

<script>
import Draw from '@/composition/draw'
import { useToolStore } from '@/stores/tool'
import { watch } from 'vue'

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
		let polygonDraw

		watch(
			() => toolStore.activeName,
			() => {
				if (toolStore.activeName === 'Polygon') {
					console.log('Polygon 활성화')
					drawPolygon()
				} else {
					if (polygonDraw) {
						polygonDraw.inactive()
						console.log('Polygon 비활성화')
					}
				}
			}
		)

		const onActiveChange = () => {
			if (toolStore.activeName != 'Polygon') {
				// emit('change-name', 'Polygon')
				toolStore.activeName = 'Polygon'
			} else {
				// emit('change-name', '')
				toolStore.activeName = ''
			}
		}

		// polygon 생성
		const drawPolygon = () => {
			const drawLayer = WGMap.getLayerById('drawLayer')
			const drawSource = drawLayer.getSource()
			// const isFreehand = props.activeName === 'freehand' ? true : false

			polygonDraw = new Draw({
				source: drawSource,
				type: 'Polygon',
				// freehand: isFreehand,
				styleName: toolStore.activeName.toLowerCase(),
				style: drawStyle,
			})

			// Esc 클릭 시 Interaction 초기화
			$(document).keydown(function (event) {
				if (event.keyCode == 27) {
					polygonDraw.finishDrawing()
				}
			})

			polygonDraw.active()
		}

		const drawStyle = function (feature) {
			var styles = []

			if (feature.getGeometry().getType() == 'LineString') {
				var coordinates = feature.getGeometry().getCoordinates()

				// 마지막 좌표와 그 앞에 좌표를 연결하는 선 스타일(점선)
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

				// 처음과 마지막 좌표를 연결하는 선 스타일(점선)
				styles.push(
					new wg.style.Style({
						geometry: new wg.geom.LineString([coordinates[0], coordinates[coordinates.length - 1]]),
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
			} else if (feature.getGeometry().getType() == 'Polygon') {
				// 내부 채우기
				styles.push(
					new wg.style.Style({
						fill: new wg.style.Fill({
							color: 'rgba(255, 255, 255, 0.5)',
						}),
					})
				)
			}
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
				})
			)
			return styles
		}

		return { onActiveChange, toolStore, drawStyle }
	},
}
</script>

<style scoped></style>
