<template>
	<div class="stat-board show">
		<div class="head">
			<div class="tit">메모</div>
			<!-- <a :class="['btn-fold', { 'active': !isFold }]" @click="onFoldClick"><span>접기/펼치기</span></a> -->
			<a :class="['btn-fold', { 'active': !isFold }]" @click="onFoldClick"><span>접기/펼치기</span></a>
			<!-- <a class="btn-close" @click="$emit('close')"><span>팝업창 닫기</span></a> -->
		</div>
		<div id="statBody" class="body">
			<div class="marker-list">
				<div class="marker-item slim-scroll">
					<table class="table data-table mb-20">
						<colgroup>
							<col style="width: 20px" />
							<col style="width: 50px" />
							<col style="width: 30px" />
						</colgroup>
						<thead>
							<tr>
								<th scope="col">
									<input type="checkbox" v-model="allCheck" @change="onAllCheckChange($event)" />
								</th>
								<th scope="col">메모</th>
								<th scope="col">삭제</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(data, index) in pinMarkerList" :key="index">
								<td>
									<input
										type="checkbox"
										:id="data.markerId"
										v-model="checkFeature[data.markerId]"
										@change="onCheckStateChange($event, data)"
									/>
								</td>
								<td class="text-left">
									<div class="marker-title">
										<a href="#" @click="movePinMarker(data)">{{ data.markerTitle }}</a>
									</div>
								</td>
								<td>
									<label class="marker-location-icon">
										<a href="#" @click="onRemoveClick(data.markerId)"
											><i><img src="/public/assets/images/delete-icon.png" /></i
										></a>
									</label>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<!-- <div class="marker-item">
					<div class="marker-title">재개발 허가구역 메모11111111111</div>
					<label class="marker-location-icon">
						<a href="#"
							><i><img src="/public/assets/images/marker_small.png" /></i
						></a>
					</label>
				</div>
				<div class="marker-item">
					<div class="marker-title">재개발 허가구역 메모2222222222222222</div>
					<label class="marker-location-icon">
						<a href="#"
							><i><img src="/public/assets/images/marker_small.png" /></i
						></a>
					</label>
				</div>
				<div class="marker-item">
					<div class="marker-title">재개발 허가구역 메모333333333333333333333333333333333333333333333333333</div>
					<label class="marker-location-icon">
						<a href="#"
							><i><img src="/public/assets/images/marker_small.png" /></i
						></a>
					</label>
				</div> -->
			</div>
			<div class="bottom">
				<button
					type="button"
					:class="['btn', { 'btn-dark': interactionActive }, { 'btn-primary': !interactionActive }]"
					@click="pinMarkerIntraction"
				>
					{{ interactionActive ? '메모 종료' : '메모 입력' }}
				</button>
				<button type="button" class="btn btn-dark" @click="$emit('close')">닫기</button>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import pinMarkApi from '@/api/pinMarker'
import { useModalStore } from '@/stores/modal'
import layer from '@/api/layer'
import { useToolStore } from '@/stores/tool'
export default {
	emits: ['close'],
	setup({ emit }) {
		const modalStore = useModalStore()
		const toolStore = useToolStore()

		const pinMarkerList = ref([])
		const isFold = ref(false)

		const allCheck = ref(false)

		let createMarkerOverlay // 마커 생성 오버레이
		let selectMarkerOverlay
		let createMarkerContainer = document.createElement('div')
		let selectMarkerContainer = document.createElement('div')

		let interactionActive = ref(false)

		let createStatus = false

		let featureId

		let checkFeature = ref([])
		let checkFeatureOverlay = []

		let markerInfo = ref({
			markerId: '',
			markerTitle: '',
			lon: 0.0,
			lat: 0.0,
		})

		let coordinate, marker

		watch(
			() => toolStore.activeName,
			() => {
				if (toolStore.activeName !== 'Pin') {
					if (interactionActive.value) {
						pinMarkerIntraction()
						console.log('Pin 비활성화')
					}
				}
			}
		)

		let addMarker = (event) => {
			// 클릭한 좌표
			coordinate = event.coordinate

			// coordinates가 유효한 배열인지 확인합니다
			if (coordinate && coordinate.length === 2) {
				if (createStatus) {
					WGMap.getLayerById('pinMarker').getSource().removeFeature(marker)
				}
				marker = new wg.Feature({
					geometry: new wg.geom.Point(coordinate),
				})

				// 마커 피처 추가
				WGMap.getLayerById('pinMarker').getSource().addFeature(marker)

				if (!createMarkerOverlay) {
					createMarkerInfoOverlay()
					addEventHandler()
				}

				createMarkerOverlay.setPosition(coordinate)
				document.getElementById('titleInput').value = ''
				createStatus = true
			} else {
				console.error('유효하지 않은 좌표:', coordinates)
			}
		}

		onMounted(() => {
			createMarkerInfoOverlay()
			selectMarkerInfoOverlay()
			addEventHandler()
			getPinMarkerList()
		})

		onUnmounted(() => {
			const checkLayer = WGMap.getLayerById('pinMarker')

			if (checkLayer) {
				WGMap.removeLayer(checkLayer)
				WGMap.un('pointermove', callbackFeatureClickEvent)
			}

			WGMap.removeOverlay(createMarkerOverlay)

			createMarkerOverlay = null
			if (interactionActive.value) {
				pinMarkerIntraction()
			}
		})

		/**
		 * 메모 리스트 조회
		 */
		const getPinMarkerList = async () => {
			const checkLayer = WGMap.getLayerById('pinMarker')

			if (checkLayer) {
				WGMap.removeLayer(checkLayer)
				WGMap.un('pointermove', callbackFeatureClickEvent)
			}

			// 메모 리스트 조회
			const { data } = await pinMarkApi.listPinMarker()
			pinMarkerList.value = data

			markerInfo.value.markerTitle = document.getElementById('titleInput') // 메모 상세팝업 > 제목(Title)

			const features = [] // 메모 피처 리스트

			// 맵 위에 메모 Features 생성
			for (let i = 0; i < data.length; i++) {
				const _Data = data[i]

				const feature = new wg.Feature({
					id: 'markerFeature',
					markerId: _Data.markerId,
					geometry: new wg.geom.Point(wg.proj.fromLonLat([_Data.lon, _Data.lat])),
				})
				features.push(feature)
			}

			// 메모 레이어
			const markers = new wg.layer.Vector({
				id: 'pinMarker',
				source: new wg.source.Vector({
					features: features,
				}),
				style: new wg.style.Style({
					image: new wg.style.Icon({
						src: '/assets/images/pin-marker.png',
					}),
				}),
				zIndex: 200,
			})

			WGMap.addLayer(markers) // 맵에 메모 레이어 추가

			// 메모 클릭 이벤트
			WGMap.on('pointermove', callbackFeatureClickEvent)
		}

		/**
		 * 메모 인터랙션
		 */
		const pinMarkerIntraction = () => {
			interactionActive.value = !interactionActive.value

			let mapContainer = document.getElementById('map') // 지도 컨테이너의 ID

			// 인터랙션 on
			if (interactionActive.value) {
				toolStore.activeName = 'Pin'
				console.log('메모 인터랙션 on')
				WGMap.on('singleclick', addMarker)
				mapContainer.classList.add('map-marker-cursor')
			}
			// 인터랙션 off
			else {
				console.log('메모 인터랙션 off')
				if (toolStore.activeName === 'Pin') {
					toolStore.activeName = ''
				}
				WGMap.un('singleclick', addMarker)
				mapContainer.classList.remove('map-marker-cursor')
			}
		}

		/**
		 * 메모 클릭 이벤트
		 * @param {*} evt
		 */
		const callbackFeatureClickEvent = async (evt) => {
			// 메모 생성 진행 중 클릭 이벤트 X
			if (interactionActive.value) {
				return
			}

			const feature = WGMap.forEachFeatureAtPixel(evt.pixel, function (feature) {
				return feature
			})
			if (feature) {
				if (feature.get('id') != 'markerFeature') {
					return
				}

				featureId = feature.get('markerId')

				if (checkFeature.value[featureId]) {
					return
				}

				if (!selectMarkerOverlay) {
					selectMarkerInfoOverlay()
					addEventHandler()
				} else {
					const { data } = await pinMarkApi.pinMarkerDetail(feature.get('markerId'))

					const coordinates = feature.getGeometry().getCoordinates()

					document.getElementById('markerDescription').innerText = data.markerTitle

					selectMarkerOverlay?.setPosition(coordinates)
				}
			} else {
				WGMap.removeOverlay(selectMarkerOverlay)
				selectMarkerOverlay = null
			}
		}

		/**
		 * 메모 생성팝업 저장버튼 클릭 이벤트
		 */
		const callbackSaveEvent = async () => {
			console.log('마커 저장 버튼 클릭 완료')

			if (document.getElementById('titleInput').value === '') {
				modalStore.showAlert('최소 1자 이상의 문자 입력이 필요합니다.')
				return
			}

			markerInfo.value.markerId = featureId
			markerInfo.value.markerTitle = document.getElementById('titleInput').value
			markerInfo.value.lon = wg.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326')[0]
			markerInfo.value.lat = wg.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326')[1]

			const { data, status } = await pinMarkApi.savePinMarker(markerInfo.value)

			if (status.code === 200) {
				modalStore.showToast('success', '저장을 완료하였습니다.')
				pinMarkerIntraction()
				getPinMarkerList()
				callbackCloseEvent()
			} else {
				modalStore.showToast('error', '저장을 실패하였습니다.')
			}

			createStatus = false
		}

		/**
		 * 메모 리스트 삭제버튼 클릭 이벤트
		 */
		const onRemoveClick = async (id) => {
			console.log('마커 삭제 버튼 클릭 완료')

			// 마커 정보 저장 확인 여부
			modalStore.showConfirm('선택하신 메모를 삭제하시겠습니까?', async () => {
				const { data, status } = await pinMarkApi.removePinMarker(id)

				if (status.code === 200) {
					modalStore.showToast('success', '삭제를 완료하였습니다.')
					WGMap.removeOverlay(checkFeatureOverlay[`marker-overlay-${id}`])
					getPinMarkerList()
				} else {
					modalStore.showToast('error', '삭제를 실패하였습니다.')
				}
			})
		}

		/**
		 * 메모 생성팝업 닫기버튼 클릭 이벤트
		 */
		const callbackCloseEvent = () => {
			document.getElementById('titleInput').value = ''
			// overlay.setVisible(false)
			WGMap.removeOverlay(createMarkerOverlay)
			createMarkerOverlay = null
			WGMap.getLayerById('pinMarker').getSource().removeFeature(marker)
			createStatus = false
		}

		/**
		 * 마커가 위치한 곳으로 이동
		 */
		const movePinMarker = (marker) => {
			WGMap.getView().setCenter(wg.proj.transform([marker.lon, marker.lat], 'EPSG:4326', 'EPSG:3857'))
		}

		/**
		 * 메모 생성팝업 오버레이 생성
		 */
		const createMarkerInfoOverlay = () => {
			/**
			 * Elements that make up the popup.
			 */
			createMarkerContainer.innerHTML = `<div class="create-pinMarker-overlay" id="pinMarkerDetailOverlay">
						<div class="content">
							<div class="head">
								<div class="tit">메모 입력</div>
								<a id="btnClose" class="btn-close"><span>닫기</span></a>
							</div>
							<div class="body">
								<div class="title">
									<textarea id="titleInput"></textarea>
								</div>
							</div>
							<div class="buttonGroup" style="text-align: center; margin: 0px 10px 15px 10px;">
							<input id="markerSaveBtn" type="button"  value="저장">
						</div>
						</div>
					</div>`

			/**
			 * Create an overlay to anchor the popup to the map.
			 */
			createMarkerOverlay = new wg.Overlay({
				id: 'createMarkerPopup',
				element: createMarkerContainer,
				autoPan: {
					animation: {
						duration: 250,
					},
				},
				tartget: undefined,
			})

			WGMap.addOverlay(createMarkerOverlay)

			// document.getElementById('markerSaveBtn').removeEventListener('click', callbackSaveEvent)
			// document.getElementById('btnClose').removeEventListener('click', callbackCloseEvent)

			document.getElementById('markerSaveBtn').addEventListener('click', callbackSaveEvent) // 저장 이벤트
			document.getElementById('btnClose').addEventListener('click', callbackCloseEvent) // 상세정보 팝업 닫기 이벤트
		}

		/**
		 * 메모 조회팝업 오버레이 생성
		 */
		const selectMarkerInfoOverlay = () => {
			/**
			 * Elements that make up the popup.
			 */
			selectMarkerContainer.innerHTML = `<div class="select-pinMarker-overlay" id="pinMarkerDetailOverlay" style="font-size: 0.764rem;">
						<div class="content">
							<div class="body">
								<p id="markerDescription"></p>
							</div>
						</div>
					</div>`

			/**
			 * Create an overlay to anchor the popup to the map.
			 */
			selectMarkerOverlay = new wg.Overlay({
				id: 'selectMarkerPopup',
				element: selectMarkerContainer,
				autoPan: {
					animation: {
						duration: 250,
					},
				},
				positioning: 'bottom-center',
				offset: [0, -25],
				tartget: undefined,
			})

			WGMap.addOverlay(selectMarkerOverlay)
		}

		/**
		 * 체크박스 클릭 시
		 */
		const onCheckStateChange = async (event, data) => {
			if (!checkFeatureOverlay[`marker-overlay-${data.markerId}`]) {
				createOverlay(data)
			}
			const coordinates = wg.proj.transform([data.lon, data.lat], 'EPSG:4326', 'EPSG:3857')

			let overlay = checkFeatureOverlay[`marker-overlay-${data.markerId}`]
			if (event.target.checked) {
				document.getElementById(`checkMarkerDescription-${data.markerId}`).innerText = data.markerTitle
				// 체크 시 오버레이 표시
				overlay.setPosition(coordinates) // 위치 설정
			} else {
				if (allCheck.value) {
					allCheck.value = false
				}
				// 체크 해제 시 오버레이 숨김
				overlay.setPosition(undefined) // 위치 제거
			}
		}

		const createOverlay = (data) => {
			// 오버레이용 div 생성
			let overlayElement = document.createElement('div')
			overlayElement.id = `checkOverlay-${data.markerId}`

			overlayElement.innerHTML = `<div class="select-pinMarker-overlay" style="font-size: 0.764rem;">
						<div class="content">
							<div class="body">
								<p id="checkMarkerDescription-${data.markerId}"></p>
							</div>
						</div>
					</div>`

			// OpenLayers 오버레이 객체 생성
			let overlay = new wg.Overlay({
				id: 'selectMarkerPopup' + data.markerId,
				element: overlayElement,
				autoPan: {
					animation: {
						duration: 250,
					},
				},
				positioning: 'bottom-center',
				offset: [0, -25],
				tartget: undefined,
			})

			// 오버레이 객체 저장
			checkFeatureOverlay[`marker-overlay-${data.markerId}`] = overlay

			// 지도에 오버레이 추가 (이 코드는 지도 초기화 후 실행되어야 함)
			WGMap.addOverlay(overlay)

			return overlayElement
		}

		/**
		 * 통계보드 접기/펼치기
		 */
		const onFoldClick = () => {
			isFold.value = !isFold.value
			$('.stat-board .body').slideToggle(100)
		}

		/**
		 * 팝업 마우스 드래그 이동
		 */
		const addEventHandler = () => {
			$(function () {
				$('.stat-board').draggable({ containment: 'body', scroll: false, handle: '.head' })
				$('.create-pinMarker-overlay').draggable({ containment: 'body', scroll: false, handle: '.head' })
				$('.marker-list').slimScroll({
					height: '460px',
					railVisible: true,
					wheelStep: 50,
					allowPageScroll: false,
					disableFadeOut: false,
				})
			})
		}

		/**
		 * 일괄 표시 이벤트
		 * @param {*} event
		 */
		const onAllCheckChange = (event) => {
			if (event.target.checked) {
				for (let i = 0; i < pinMarkerList.value.length; i++) {
					checkFeature.value[pinMarkerList.value[i].markerId] = true
					onCheckStateChange(event, pinMarkerList.value[i])
				}
			} else {
				for (let i = 0; i < pinMarkerList.value.length; i++) {
					checkFeature.value[pinMarkerList.value[i].markerId] = false
					onCheckStateChange(event, pinMarkerList.value[i])
				}
			}
		}

		return {
			isFold,
			allCheck,
			pinMarkerList,
			interactionActive,
			checkFeature,
			onFoldClick,
			onRemoveClick,
			movePinMarker,
			pinMarkerIntraction,
			onCheckStateChange,
			onAllCheckChange,
		}
	},
}
</script>

<style scoped>
.body {
	height: 500px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 10px 15px 15px 15px !important;
}

.body > .bottom {
	bottom: 0;
	text-align: center;
}

.body > .bottom button {
	margin: 0 5px;
}

.marker-item {
	display: flex;
	justify-content: space-between;
	width: 100%;
	height: 30px;
	padding: 5px 0;
}
.marker-title {
	margin: 5px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	word-break: break-all;
}
.marker-title a {
	color: #000;
}
table tr td {
	text-overflow: ellipsis;
	white-space: nowrap;
	max-width: 230px;
}
.marker-location-icon img {
	width: 25px;
	height: 25px;
}
.stat-board .head .btn-fold {
	right: 0px;
}
</style>
