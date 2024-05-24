<template>
	<li :class="{ active: toolStore.activeName === 'area' }" data-toggle="tooltip">
		<a @click="onActiveChange()">면적</a>
	</li>
</template>

<script>
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
		const toolStore = useToolStore()

		watch(
			() => toolStore.activeName,
			() => {
				if (toolStore.activeName === 'area') {
					area()
				} else {
					clearAreaAnlysis2d()
				}
				if (toolStore.activeName === '') {
					WGMap.removeInteraction(areaDraw)
				}
			}
		)

		const onActiveChange = () => {
			if (toolStore.activeName != 'area') {
				toolStore.activeName = 'area'
				emit('change-name', 'area')
			} else {
				toolStore.activeName = ''
				emit('change-name', '')
			}
		}

		let sketch, listener, measureTooltip, measureLayer, areaDraw

		const area = () => {
			let source = new wg.source.Vector()

			areaDraw = new wg.interaction.Draw({
				source: source,
				type: 'Polygon',
				style: drawStyle,
			})

			// Esc 클릭 시 Interaction 초기화
			$(document).keydown(function (event) {
				if (event.keyCode == 27) {
					areaDraw.finishDrawing()
				}
			})

			WGMap.addInteraction(areaDraw)

			measureLayer = new wg.layer.Vector({
				id: 'measureAreaLayer',
				source: new wg.source.Vector(),
				style: new wg.style.Style({
					stroke: new wg.style.Stroke({
						color: '#ff008e',
						width: 2.5,
					}),
					fill: new wg.style.Fill({
						color: 'rgba(255, 255, 255, 0.5)',
					}),
				}),
				zIndex: 2,
			})

			areaDraw.on('drawstart', (evt) => {
				measureDrawStart(evt)
			})
			areaDraw.on('drawend', (drawInfo) => {
				measureDrawEnd(drawInfo.feature)
			})
			WGMap.addLayer(measureLayer)
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

		const measureDrawStart = (evt) => {
			sketch = evt.feature
			let tooltipCoord = evt.coordinate

			measureTooltip = createMeasureTooltip()
			const measureTooltipElement = measureTooltip.getElement()
			listener = sketch.getGeometry().on('change', (evt) => {
				const geom = evt.target
				const output = formatArea(geom)

				tooltipCoord = geom.getInteriorPoint().getCoordinates()
				measureTooltipElement.innerHTML = output
				measureTooltip.setPosition(tooltipCoord)
			})
		}

		const measureDrawEnd = (feature) => {
			const measureTooltipElement = measureTooltip.getElement()
			const _output = measureTooltipElement.innerHTML

			measureTooltipElement.className = 'wg-tooltip wg-tooltip-static'
			measureTooltipElement.innerHTML = '<div><button class="overlayDistance" /button></div> <h3>' + _output + '</h3>'
			measureTooltip.set('feature', feature)
			measureLayer.getSource().addFeature(feature)
			wg.Observable.unByKey(listener)
		}

		const formatArea = (polygon) => {
			const area = wg.sphere.getArea(polygon)
			let output
			if (area > 1000000) {
				output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>'
			} else {
				output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>'
			}
			return output
		}

		const createMeasureTooltip = () => {
			let measureTooltipElement = document.createElement('div')
			measureTooltipElement.className = 'wg-tooltip wg-tooltip-measure'

			let measureTooltip = new wg.Overlay({
				id: 'area-measure-' + WGMap.getOverlays().getLength(),
				element: measureTooltipElement,
				offset: [0, -30],
				positioning: 'center-center',
				stopEvent: true,
				insertFirst: false,
			})

			WGMap.addOverlay(measureTooltip)

			measureTooltipElement.onclick = () => {
				if (measureTooltipElement.querySelector('.overlayDistance')) {
					const feature = measureTooltip.get('feature')
					measureLayer.getSource().removeFeature(feature)
					WGMap.removeOverlay(measureTooltip)
				}
			}
			return measureTooltip
		}

		const clearAreaAnlysis2d = () => {
			WGMap.removeInteraction(areaDraw)
			WGMap.removeLayer(measureLayer)

			// 면적 오버레이 전체 삭제
			let overlays = WGMap.getOverlays().getArray()
			let overlaysToRemove = overlays.filter((overlay) => {
				let overlayId = overlay.getId()
				return overlayId && overlayId.includes('area')
			})
			overlaysToRemove.forEach((overlay) => {
				WGMap.removeOverlay(overlay)
			})
		}

		return { toolStore, onActiveChange }
	},
}
</script>

<style>
.wg-tooltip {
	position: relative;
	background: rgba(0, 0, 0, 0.5);
	border-radius: 12px;
	color: white;
	padding: 4px 8px;
	white-space: nowrap;
	font-size: 12px;
	cursor: default;
	user-select: none;
}

.wg-tooltip.hidden {
	display: none;
}

.wg-tooltip-measure {
	opacity: 1;
	font-weight: bold;
}

.wg-tooltip-static {
	background-color: #fff;
	padding: 0px;
	width: 130px;
	text-align: center;
	border: 1px solid rgba(0, 0, 0, 0.2);
	color: #24292e;
}

.wg-tooltip-measure:before,
.wg-tooltip-static:before {
	border-top: 6px solid rgba(0, 0, 0, 0.5);
	border-right: 6px solid transparent;
	border-left: 6px solid transparent;
	content: '';
	position: absolute;
	bottom: -6px;
	margin-left: -7px;
	left: 50%;
}

.wg-tooltip-static:before {
	border-top-color: #fff;
}

.wg-tooltip.wg-tooltip-static h3 {
	margin-bottom: 9px;
	margin-top: -12px;
}
.overlayDistance {
	border: none;
	outline: none;
	box-shadow: none;
	background-color: rgb(255 255 255 / 0%);
	cursor: pointer;
	margin-right: -100px;
	height: 17px;
}
.overlayDistance:after {
	display: inline-block;
	content: '\00d7';
	font-size: 15pt;
	color: #666;
}
.wg-tooltip.wg-tooltip-static h3 {
	margin-bottom: 10px;
	margin-top: -10px;
	font-size: 0.925rem;
}
</style>
