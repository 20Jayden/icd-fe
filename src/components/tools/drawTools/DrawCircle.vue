<template>
	<li :class="{ active: toolStore.activeName === 'circle' }">
		<a @click="onActiveChange"> 원</a>
	</li>
</template>

<script>
import Draw from '@/composition/draw'
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
		const toolStore = useToolStore()
		let circleDraw

		watch(
			() => toolStore.activeName,
			() => {
				if (toolStore.activeName === 'circle') {
					drawCircle()
				} else {
					if (circleDraw) {
						circleDraw.inactive()
					}
				}
			}
		)

		const onActiveChange = () => {
			if (toolStore.activeName != 'circle') {
				// emit('change-name', 'circle')
				toolStore.activeName = 'circle'
			} else {
				// emit('change-name', '')
				toolStore.activeName = ''
			}
		}

		// 원 그리기
		const drawCircle = () => {
			const drawLayer = WGMap.getLayerById('drawLayer')
			const drawSource = drawLayer.getSource()
			const typeName = toolStore.activeName === 'rectangle' ? 'Circle' : toolStore.activeName

			circleDraw = new Draw({
				source: drawSource,
				type: 'LineString',
				maxPoints: 3,
				geometryFunction: function (coordinates, geometry) {
					var center = coordinates[0]
					var first = coordinates[1]
					var dx = center[0] - first[0]
					var dy = center[1] - first[1]
					var radius1 = Math.sqrt(dx * dx + dy * dy)
					if (coordinates.length > 2) {
						var last = coordinates[2]
						dx = center[0] - last[0]
						dy = center[1] - last[1]
					}
					var radius2 = Math.sqrt(dx * dx + dy * dy)
					var rotation = Math.atan2(dy, dx)
					var circle = new wg.geom.Circle(center, radius1)
					var polygon = new wg.geom.Polygon.fromCircle(circle, 64)
					polygon.scale(radius2 / radius1, 1)
					polygon.rotate(rotation, center)
					if (!geometry) {
						geometry = polygon
					} else {
						geometry.setCoordinates(polygon.getCoordinates())
					}
					return geometry
				},
				style: drawStyle,
			})
			console.log('styleName', toolStore.activeName.toLowerCase())
			// Esc 클릭 시 Interaction 초기화
			$(document).keydown(function (event) {
				if (event.keyCode == 27) {
					circleDraw.abortDrawing()
				}
			})

			circleDraw.active()
		}

		const drawStyle = function (feature) {
			var styles = []
			if (feature.getGeometry().getType() == 'Polygon') {
				// 내부 채우기
				styles.push(
					new wg.style.Style({
						fill: new wg.style.Fill({
							color: 'rgba(255, 255, 255, 0.4)', // 채우기 색상 설정
						}),
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

		return { toolStore, onActiveChange, drawStyle }
	},
}
</script>

<style scoped></style>
