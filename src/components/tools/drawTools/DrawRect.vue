<template>
	<li :class="{ active: toolStore.activeName === 'rectangle' }">
		<a @click="onActiveChange">사각형</a>
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
		let rectDraw

		watch(
			() => toolStore.activeName,
			() => {
				if (toolStore.activeName === 'rectangle') {
					drawRect()
				} else {
					if (rectDraw) {
						rectDraw.inactive()
					}
				}
			}
		)

		const onActiveChange = () => {
			if (toolStore.activeName != 'rectangle') {
				// emit('change-name', 'rectangle')
				toolStore.activeName = 'rectangle'
			} else {
				// emit('change-name', '')
				toolStore.activeName = ''
			}
		}

		// 면 그리기
		const drawRect = () => {
			const drawLayer = WGMap.getLayerById('drawLayer')
			const drawSource = drawLayer.getSource()
			const typeName = toolStore.activeName === 'rectangle' ? 'Circle' : toolStore.activeName

			rectDraw = new Draw({
				source: drawSource,
				type: typeName,
				geometryFunction: wg.interaction.Draw.createBox(),
				styleName: 'polygon',
				style: drawStyle,
			})

			// Esc 클릭 시 Interaction 초기화
			$(document).keydown(function (event) {
				if (event.keyCode == 27) {
					rectDraw.abortDrawing()
				}
			})

			rectDraw.active()
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

		return { onActiveChange, toolStore, drawStyle }
	},
}
</script>

<style scoped></style>
