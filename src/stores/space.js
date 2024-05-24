import { defineStore } from 'pinia'
import { ref } from 'vue'
import CommonUtil from '@/api/logTable'
import { useLog } from '@/stores/log'

export const useSpaceStore = defineStore('space', () => {
	const modeName = ref('')
	const isVectorLayer = ref(false)
	const isSpaceSelected = ref(false)
	const polygonSpaceCoordinate = ref('')
	const polygonSpaceCoordinateArr = ref([])
	const closeIs = ref(false)
	const isActive = ref(false)
	const log = useLog()

	let draw

	function selectPolygon() {
		modeName.value = 'polygon'

		let source = new wg.source.Vector({ wrapX: false })

		let vector = new wg.layer.Vector({
			id: 'areaSelectLayer',
			source: source,
			style: new wg.style.Style({
				fill: new wg.style.Fill({
					color: 'rgba(255, 255, 255, 0.5)',
				}),
				stroke: new wg.style.Stroke({
					color: '#ff008e',
					width: 2.5,
				}),
			}),
		})

		if (!isVectorLayer.value) {
			WGMap.addLayer(vector)
			isVectorLayer.value = true
		}

		const drawStyle = function (feature) {
			var styles = [
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
				}),
			]

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

			return styles
		}

		draw = new wg.interaction.Draw({
			source: source,
			style: drawStyle,
			type: 'Polygon',
		})

		WGMap.addInteraction(draw)

		// Esc 클릭 시 draw 초기화
		$(document).keydown(function (event) {
			if (event.keyCode == 27) {
				draw.abortDrawing()
			}
		})

		draw.on('drawend', function (event) {
			console.log('드로우 종료')
			// WGMap.removeInteraction(draw)
			const coordinate = event.feature.values_.geometry.flatCoordinates

			let polygonCoordinate = ''
			if (coordinate.length > 0 && coordinate.length % 2 === 0) {
				for (let i = 0; i * 2 < coordinate.length; i++) {
					const sliceCoordinateArr = coordinate.slice(i * 2, i * 2 + 2)

					const sliceCoordinate = new wg.proj.transform(
						sliceCoordinateArr,
						WGMap.getView().getProjection(),
						'EPSG:3857'
					)

					const coordinateStr = sliceCoordinate.join() + ','
					polygonSpaceCoordinateArr.value = sliceCoordinate
					polygonCoordinate += coordinateStr
				}
			}

			polygonSpaceCoordinate.value = polygonCoordinate.slice(0, -1)
			isVectorLayer.value = false
			isActive.value = true
			if (isSpaceSelected.value) {
				// 이전에 true면 false였다가 true로 바꿔줌
				isSpaceSelected.value = false
			} else {
				isSpaceSelected.value = true
			}
			clear2dSelectionLayer()
		})
	}

	/**
	 * 임의영역추출 지도 위의 Layer Clear
	 */
	function clear2dSelectionLayer() {
		if (WGMap.getLayerById('areaSelectLayer')) {
			if (WGMap.getLayerById('areaSelectLayer').getSource()) {
				let selectDrawSource = WGMap.getLayerById('areaSelectLayer').getSource()
				selectDrawSource.clear()
			}
		}
	}

	/**
	 * 임의영역추출 Interaction 비활성화
	 */
	const clearSpaceDrawInteraction = () => {
		WGMap.removeInteraction(draw)
	}

	/**
	 * 임의영역추출 Interaction 활성화
	 */
	const addSpaceDrawInteraction = () => {
		WGMap.addInteraction(draw)
	}

	return {
		modeName,
		isVectorLayer,
		isSpaceSelected,
		polygonSpaceCoordinate,
		polygonSpaceCoordinateArr,
		closeIs,
		isActive,
		clear2dSelectionLayer,
		clearSpaceDrawInteraction,
		addSpaceDrawInteraction,
		selectPolygon,
	}
})
