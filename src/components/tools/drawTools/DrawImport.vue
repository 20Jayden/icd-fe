<template>
	<li :class="{ active: toolStore.activeName === 'import' }">
		<a @click="onActiveChange">로드</a>
	</li>
</template>

<script>
import { draw as drawStyle, label as labelStyle } from '@/composition/drawStyle'
import { useToolStore } from '@/stores/tool'
import wgTools from '@/composition/wgTools'
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
			onLoadFeature()
		}

		const onLoadFeature = () => {
			const drawLayer = WGMap.getLayerById('drawLayer')
			const drawSource = drawLayer.getSource()
			// 기존에 fileinput 엘리먼트 있다면 삭제
			document.getElementById('drawImport')?.remove()
			// file input 엘리먼트 생성
			const input = document.createElement('input')
			input.id = 'drawImport'
			input.setAttribute('type', 'file')
			input.setAttribute('accept', 'application/json')
			input.style.display = 'none'
			// file input 이벤트 추가
			input.addEventListener('change', (fileChangeEvent) => {
				const file = fileChangeEvent.target.files[0] // 사용자가 선택한 파일
				const reader = new FileReader()
				// 파일 read 이벤트
				reader.onload = (fileLoadEvt) => {
					// 파일 읽어서 json 생성
					const geojson = JSON.parse(fileLoadEvt.target.result)
					let features = new wg.format.GeoJSON().readFeatures(geojson)
					features.forEach((f) => {
						// 커스텀 스타일 체크하여 적용
						const styleName = f.get('styleName')
						const styleJsonStr = f.get('style') || '{}'
						const styleJson = JSON.parse(styleJsonStr)
						console.log(styleJson)

						let style = drawStyle.clone()

						if (Object.keys(styleJson).length > 0) {
							if (styleName === 'point') {
								style = new wg.style.Style({
									image: new wg.style.Circle({
										radius: styleJson['radius'] || 5,
										fill: new wg.style.Fill({
											color: styleJson['fill-color'] || style.getImage().getFill().getColor(),
										}),
										stroke: new wg.style.Stroke({
											color: styleJson['stroke-color'] || style.getImage().getStroke().getColor(),
											width: style.getImage().getStroke().getWidth(),
										}),
									}),
								})
							} else if (styleName === 'linestring') {
								style = new wg.style.Style({
									stroke: new wg.style.Stroke({
										color: styleJson['stroke-color'] || style.getStroke().getColor(),
										width: styleJson['stroke-width'] || style.getStroke().getWidth(),
									}),
								})
							} else if (styleName === 'polygon') {
								style = new wg.style.Style({
									fill: new wg.style.Fill({
										color: styleJson['fill-color'] || style.getFill().getColor(),
									}),
									stroke: new wg.style.Stroke({
										color: styleJson['stroke-color'] || style.getStroke().getColor(),
										width: styleJson['stroke-width'] || style.getStroke().getWidth(),
									}),
								})
							} else if (styleName === 'circle') {
								style = new wg.style.Style({
									fill: new wg.style.Fill({
										color: styleJson['fill-color'] || style.getFill().getColor(),
									}),
									stroke: new wg.style.Stroke({
										color: styleJson['stroke-color'] || style.getStroke().getColor(),
										width: styleJson['stroke-width'] || style.getStroke().getWidth(),
									}),
								})
							} else if (styleName === 'text') {
								style = labelStyle.clone()
								console.log('>>>>>>>>>>>>', style.getText().getText())

								style = new wg.style.Style({
									text: new wg.style.Text({
										font: styleJson['font'] || style.getText().getFont(),
										text: f.get('name') || style.getText().getText(),
										placement: 'Point',
										fill: new wg.style.Fill({
											color: styleJson['fill-color'] || style.getText().getFill().getColor(),
										}),
										stroke: new wg.style.Stroke({
											color: styleJson['stroke-color'] || style.getText().getStroke().getColor(),
											width: styleJson['stroke-width'] || style.getText().getStroke().getWidth(),
										}),
									}),
								})
							}
						}

						f.setStyle(style)
					})
					// draw소스에 피쳐 추가
					drawSource.addFeatures(features)

					// 피쳐범위로 fit
					wgTools.fitAnim(drawSource.getExtent())
				}
				// 파일 read 실행
				reader.readAsText(file)
			})
			// 클릭 트리깅
			input.click()
		}
		return { onActiveChange, toolStore }
	},
}
</script>

<style lang="scss" scoped></style>
