<template>
	<li :class="{ active: toolStore.activeName === 'distance' }">
		<a @click="onActiveChange()">거리</a>
	</li>
</template>

<script>
import { useToolStore } from '@/stores/tool'
import { watch } from 'vue'

export default {
	props: {
		active: {
			type: Boolean,
			default: true,
		},
		activeName: {
			type: String,
			default: '',
		},
	},

	emits: ['change-name'],
	setup() {
		const toolStore = useToolStore()

		watch(
			() => toolStore.activeName,
			() => {
				if (toolStore.activeName === 'distance') {
					distance()
				} else {
					clearDistanceAnalysis2d()
				}

				if (toolStore.activeName === '') {
					WGMap.removeInteraction(distanceDraw)
				}
			}
		)

		const onActiveChange = () => {
			if (toolStore.activeName != 'distance') {
				toolStore.activeName = 'distance'
				// emit('change-name', 'distance')
			} else {
				// emit('change-name', '')
				toolStore.activeName = ''
				WGMap.removeOverlay()
			}
		}

		let sketch, listener, measureTooltip, measureLayer, distanceDraw
		let popupElements = []
		let pointPopups = []

		const distance = () => {
			let source = new wg.source.Vector()

			distanceDraw = new wg.interaction.Draw({
				source: source,
				type: 'LineString',
				style: drawStyle,
			})

			// Esc 클릭 시 draw 초기화
			$(document).keydown(function (event) {
				if (event.keyCode == 27) {
					distanceDraw.finishDrawing()
				}
			})

			WGMap.addInteraction(distanceDraw)

			measureLayer = new wg.layer.Vector({
				id: 'measureDistanceLayer',
				source: new wg.source.Vector(),
				style: new wg.style.Style({
					stroke: new wg.style.Stroke({
						color: '#ff008e',
						width: 2.5,
					}),
				}),
				zIndex: 2,
			})

			distanceDraw.on('drawstart', (evt) => {
				measureDrawStart(evt)
			})

			distanceDraw.on('drawend', (event) => {
				measureDrawEnd(event.feature)
			})

			//중간거리 팝업 생성
			WGMap.on('click', () => {
				displayDistancePopup()
			})

			WGMap.addLayer(measureLayer)
		}

		//distanceDraw style속성
		const drawStyle = function (feature) {
			var styles = []
			//점선
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
				//포인트 객체
				styles.push(
					new wg.style.Style({
						geometry: new wg.geom.MultiPoint(coordinates),
						image: new wg.style.RegularShape({
							points: 10,
							radius: 6,
							// angle: Math.PI / 4,
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
				//실선
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

		const measureDrawStart = (evt) => {
			sketch = evt.feature // Draw하는 feature
			let tooltipCoord = evt.coordinate

			measureTooltip = createMeasureTooltip()
			const measureTooltipElement = measureTooltip.getElement()
			listener = sketch.getGeometry().on('change', function (evt) {
				const geom = evt.target
				const output = formatLength(geom)
				tooltipCoord = geom.getLastCoordinate()
				measureTooltipElement.innerHTML = output
				measureTooltip.setPosition(tooltipCoord)
			})
		}

		const measureDrawEnd = (feature) => {
			const measureTooltipElement = measureTooltip.getElement()
			let _output = measureTooltipElement.innerHTML
			measureTooltipElement.className = 'wg-tooltip wg-tooltip-static'
			measureTooltip.setOffset([0, -7])

			//원만들기
			feature
				.getGeometry()
				.getCoordinates()
				.forEach((coord) => {
					const circleFeature = new wg.Feature({
						geometry: new wg.geom.Point(coord),
					})

					const circleStyle = new wg.style.Style({
						image: new wg.style.Circle({
							radius: 6,
							fill: new wg.style.Fill({
								color: 'white',
							}),
							stroke: new wg.style.Stroke({
								color: 'rgba(255, 0, 142, 0.8)',
								width: 2,
							}),
						}),
					})

					circleFeature.setStyle(circleStyle)
					measureLayer.getSource().addFeature(circleFeature)
				})

			// 도보
			const walkingInfo = calculateWalkingDistance(feature.getGeometry())
			const walkingTime = walkingInfo.time

			// 자전거
			const cyclingInfo = calculateCyclingDistance(feature.getGeometry())
			const cyclingTime = cyclingInfo.time

			// 도보 표출
			let walkingDistanceOutput = ''
			if (walkingTime >= 3600) {
				const hours = Math.floor(walkingTime / 3600)
				const minutes = Math.round((walkingTime % 3600) / 60) // 분으로 변환 및 반올림
				walkingDistanceOutput = `도보: <span style="color: #ff008e;">${hours}시간</span> <span style="color: #ff008e;">${minutes}분</span>`
			} else if (walkingTime >= 60) {
				const minutes = Math.round(walkingTime / 60) // 분으로 변환 및 반올림
				walkingDistanceOutput = `도보: <span style="color: #ff008e;">${minutes}분</span>`
			} else {
				const minutes = Math.max(1, Math.round(walkingTime / 60)) // 1분 이상으로 반올림
				walkingDistanceOutput = `도보: <span style="color: #ff008e;">${minutes}분</span>`
			}

			// 자전거 표출
			let cyclingDistanceOutput = ''
			if (cyclingTime >= 3600) {
				const hours = Math.floor(cyclingTime / 3600)
				const minutes = Math.round((cyclingTime % 3600) / 60) // 분으로 변환 및 반올림
				cyclingDistanceOutput = `자전거: <span style="color: #ff008e;">${hours}시간</span> <span style="color: #ff008e;">${minutes}분</span>`
			} else if (cyclingTime >= 60) {
				const minutes = Math.round(cyclingTime / 60) // 분으로 변환 및 반올림
				cyclingDistanceOutput = `자전거: <span style="color: #ff008e;">${minutes}분</span>`
			} else {
				const minutes = Math.max(1, Math.round(cyclingTime / 60)) // 1분 이상으로 반올림
				cyclingDistanceOutput = `자전거: <span style="color: #ff008e;">${minutes}분</span>`
			}

			//총거리
			const totalDistanceOutput = '총거리: <span style="color: #ff008e;">' + _output + '</span>' // 총거리는 소수점에서 반올림

			measureTooltipElement.innerHTML =
				// '<div class=""><button class="overlayDistance" /button></div>' +
				// '<div class="overlay-distance"><button /button></div>' +
				// '<h3>' +
				// totalDistanceOutput +
				// '</h3>' +
				// '<h3>' +
				// walkingDistanceOutput +
				// '</h3>' +
				// '<h3>' +
				// cyclingDistanceOutput +
				// '</h3>'
				'<div  class="overlay-distance">' +
				'<div><button /button></div>' +
				'<h3 class="entire-distance">' +
				totalDistanceOutput +
				'</h3>' +
				'<h3 class="walk-distance">' +
				walkingDistanceOutput +
				'</h3>' +
				'<h3 class="cycle-distance">' +
				cyclingDistanceOutput +
				'</h3>' +
				'</div>'
			sketch = null
			measureTooltip.set('feature', feature)
			measureLayer.getSource().addFeature(feature)
			wg.Observable.unByKey(listener) // DrawEnd 시 Draw 이벤트 리스너 삭제

			const overlayDistance = document.getElementsByClassName('overlay-distance')

			console.log(overlayDistance)

			for (let i = 0; i < overlayDistance.length; i++) {
				console.log(overlayDistance[i])
			}
		}

		//중간거리 팝업 생성
		const createRealPopupElement = (content) => {
			const popupContent = document.createElement('div')
			popupContent.innerHTML = content
			popupElements.push(popupContent)
			// 스타일 적용
			popupContent.style.backgroundColor = 'white'
			popupContent.style.border = '2px solid #ff008e'

			// 팝업을 pointPopups 배열에 추가
			const pointPopup = new wg.Overlay({
				id: 'distance-measure-popup',
				element: popupContent,
				position: [0, 0], // 실제 위치는 이후 설정
				positioning: 'bottom-center',
				offset: [5, -15],
				stopEvent: true,
			})

			pointPopups.push(pointPopup)

			return popupContent
		}

		// 중간거리 계산 함수
		const calculateRealDistance = (point1, point2) => {
			const lineString = new wg.geom.LineString([point1, point2])
			const length = wg.sphere.getLength(lineString)
			return length
		}

		// 중간거리 팝업 표출
		const createRealPopupContent = (distance) => {
			const formattedDistance =
				distance > 1000
					? (Math.round((distance / 1000) * 100) / 100).toFixed(2) + ' km'
					: (Math.round(distance * 100) / 100).toFixed(2) + ' m'
			return formattedDistance
		}

		// 중간거리 생성 함수
		const displayDistancePopup = () => {
			if (sketch) {
				const lineCoordinates = sketch.getGeometry().getCoordinates()

				for (let i = 1; i < lineCoordinates.length; i++) {
					const startPoint = lineCoordinates[i - 1]
					const endPoint = lineCoordinates[i]
					const distance = calculateRealDistance(startPoint, endPoint)
					// 거리가 0인 경우 팝업 생성을 건너뜀
					if (distance === 0) {
						continue
					}
					const popupContent = createRealPopupContent(distance)

					const pointPopup = new wg.Overlay({
						id: 'distance-measure-point',
						element: createRealPopupElement(popupContent),
						position: endPoint,
						positioning: 'bottom-center',
						offset: [5, -15],
						stopEvent: true,
					})

					WGMap.addOverlay(pointPopup)
				}
			}
		}

		//총거리 계산 함수
		const formatLength = (line) => {
			const length = wg.sphere.getLength(line)
			let output
			if (length > 1000) {
				output = Math.round((length / 1000) * 100) / 100 + ' km' // km
			} else {
				output = Math.round(length * 100) / 100 + ' m' // m
			}
			return output
		}

		//도보 거리 계산 함수
		const calculateWalkingDistance = (line) => {
			const walkingSpeed = 1.04 // 초당 이동 속도 (미터)
			const walkingTime = wg.sphere.getLength(line) / walkingSpeed // 걷는데 걸린 시간 (초)
			return {
				time: Math.round(walkingTime), // 시간을 올림 처리
			}
		}

		// 자전거 거리 계산 함수
		const calculateCyclingDistance = (line) => {
			const cyclingSpeed = 4.16 // 초당 이동 속도 (미터)
			const cyclingTime = wg.sphere.getLength(line) / cyclingSpeed // 자전거로 이동하는 데 걸린 시간 (초)
			return {
				time: Math.round(cyclingTime),
			}
		}

		const createMeasureTooltip = () => {
			let measureTooltipElement = document.createElement('div')
			measureTooltipElement.className = 'wg-tooltip wg-tooltip-measure'

			let measureTooltip = new wg.Overlay({
				id: 'distance-measure-' + WGMap.getOverlays().getLength(),
				element: measureTooltipElement,
				offset: [0, -15],
				positioning: 'bottom-center',
				stopEvent: true,
				insertFirst: false,
			})

			WGMap.addOverlay(measureTooltip)

			measureTooltipElement.onclick = () => {
				const feature = measureTooltip.get('feature')
				measureLayer.getSource().removeFeature(feature)

				//포인트 객체 삭제
				const circleFeatures = measureLayer
					.getSource()
					.getFeatures()
					.filter((f) => {
						if (f.getGeometry().getType() === 'Point') {
							const lineCoordinates = feature.getGeometry().getCoordinates()
							const circleCoordinates = f.getGeometry().getCoordinates()
							return lineCoordinates.some((coord) => coord.toString() === circleCoordinates.toString())
						}
						return false
					})

				circleFeatures.forEach((circleFeature) => {
					measureLayer.getSource().removeFeature(circleFeature)
				})
				for (const circleFeature of circleFeatures) {
					const circleCoordinates = circleFeature.getGeometry().getCoordinates()
					const popupsToRemove = WGMap.getOverlays()
						.getArray()
						.filter((overlay) => {
							const position = overlay.getPosition()
							return position && position.toString() === circleCoordinates.toString()
						})
					//팝업 삭제
					for (const popupToRemove of popupsToRemove) {
						WGMap.removeOverlay(popupToRemove)
					}
				}

				WGMap.removeOverlay(measureTooltip)
			}
			return measureTooltip
		}

		const clearDistanceAnalysis2d = () => {
			if (distanceDraw) {
				distanceDraw.finishDrawing()
			}
			WGMap.removeInteraction(distanceDraw)
			WGMap.removeLayer(measureLayer)

			// 거리 오버레이 전체 삭제
			let overlays = WGMap.getOverlays().getArray() // 오버레이 전체 리스트 가져오기

			let overlaysToRemove = overlays.filter((overlay) => {
				let overlayId = overlay.getId()
				return overlayId && overlayId.includes('distance')
			})
			overlaysToRemove.forEach((overlay) => {
				WGMap.removeOverlay(overlay)
			})
		}

		return { onActiveChange, toolStore }
	},
}
</script>

<style></style>
