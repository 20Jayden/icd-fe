<template>
	<div class="search">
		<div class="tit">아파트 모니터링 리스트</div>
		<div class="result-list">
			<div v-if="list.length === 0" class="none"><span>결과가 없습니다.</span></div>
			<ul v-else>
				<li v-for="(item, index) in list" :key="index" @click="() => console.log(item)">
					<div class="info">
						<strong v-if="item.objTitle" class="name">{{ item.objTitle }}</strong>
						<strong v-else class="name" style="color: #ccc">(물건명 없음)</strong>
						<span class="type text-danger">{{ numberToKorean(item.objAmt * 10000) }}</span>
						<span class="addr">{{ item.addr }}</span>
					</div>
					<button type="button" class="btn btn-marker" @click="onLocationClick(item)"></button>
				</li>
			</ul>
		</div>
		<Pagination
			:currPage="pagination.page"
			:countPerPage="pagination.size"
			:unitPage="pagination.unitPage"
			:totalCount="pagination.totalCount"
			@movePage="(pageNum) => (isGapRtList ? searchGapRtList(pageNum) : searchList(pageNum))"
		/>
		<a v-if="pagination.totalCount > 0" @click="onExcelClick">엑셀다운로드</a>
	</div>
	<Teleport to="#popupContainer">
		<AptMonitoringCondition @search="onSearch" />
		<AptSummaryDetail
			v-if="isActiveDetail"
			:detail="summaryDetail"
			:params="summaryDetailParams"
			@close="() => (summaryDetail = {})"
		/>
	</Teleport>
	<div ref="localOverlayElement" class="marker-balloon">
		<div class="location-pop">
			<a href="#" class="btn-close" @click="() => WGMap.removeOverlay(localOverlay)"> <span>닫기</span></a>
			<ul>
				<li class="name"></li>
			</ul>
			<div class="addr"></div>
		</div>
	</div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref, reactive } from 'vue'
import { aptMonitoring as monitoringApi, monitorBottom as pnuApi } from '@/api/monitor'
import { useUtil } from '@/composition/util'
import useStep from '@/composition/step'
import { useLoadingStore } from '@/stores/loading'
import { useOverlayStore } from '@/stores/overlay'
import Pagination from '@/components/Pagination.vue'
import AptMonitoringCondition from '@/components/popup/monitoringCondition/AptMonitoringCondition.vue'
import AptSummaryDetail from '@/components/popup/monitoringDetail/AptSummaryDetail.vue'
import { useLayerStore } from '@/stores/layer'
import { useLog } from '@/stores/log'
import CommonUtil from '@/api/logTable'
export default {
	components: {
		AptMonitoringCondition,
		AptSummaryDetail,
		Pagination,
	},
	setup() {
		const loadingStore = useLoadingStore()
		const overlayStore = useOverlayStore()
		const layerStore = useLayerStore()
		const { numberToKorean } = useUtil()
		const log = useLog()

		// 상세정보 팝업
		let summaryDetail = ref({})
		let summaryDetailParams = ref({})
		const isActiveDetail = computed(() => Object.keys(summaryDetail.value).length > 0)

		// 레벨
		let level = ref('sgg')

		// 검색결과
		let list = ref([])

		// 임계치목록 여부
		let isGapRtList = ref(false)
		let gapRtItem = ref({})
		let gapRtMenu = ref({})

		let latestPayload = reactive({})

		// 임계치 건수 레이어 관련
		let hoverFeature = null
		let localOverlay = null
		let localOverlayElement = ref(null)

		// 페이징 정보
		let pagination = reactive({
			page: 1,
			size: 7,
			unitPage: 5,
			totalCount: 0,
		})

		let sizeStep = null

		onMounted(() => {
			WGMap.getView().on('change:resolution', onZoomChange)
			WGMap.on('moveend', onMoveEnd)
			$('.side-panel .body').slimScroll({
				height: 'calc(100% - 75px)',
				railVisible: true,
				wheelStep: 50,
				allowPageScroll: false,
				disableFadeOut: false,
			})
		})

		onUnmounted(() => {
			clearSummaryOverlay()
			clearGapFeature()
			WGMap.getView().un('change:resolution', onZoomChange)
			WGMap.un('moveend', onMoveEnd)
		})

		/**
		 * 목록 조회
		 * @param {*} pageNum
		 * @param {*} payload
		 */
		const searchList = async (pageNum = 1, payload = latestPayload) => {
			loadingStore.isLoading = true

			isGapRtList.value = false
			pagination.page = pageNum

			const { data, status } = await monitoringApi.list(payload, pagination)
			if (status.code == 200) {
				CommonUtil.log(log.TARGET.APTMONITORING, log.ACTION.SUCCESS, null)
			} else {
				CommonUtil.log(log.TARGET.APTMONITORING, log.ACTION.FAIL, null)
			}
			console.log('아파트 ', status.code)
			list.value = data.contents
			pagination.totalCount = 0 // 페이징 초기화
			pagination = Object.assign(pagination, data.pagination)
			gapRtMenu.value = null
			gapRtItem.value = null

			setTimeout(() => (loadingStore.isLoading = false), 1000)
		}

		/**
		 * 임계치 목록조회
		 * @param {*} pageNum 페이지번호
		 * @param {*} menu 임계치메뉴
		 * @param {*} item 요약아이템
		 * @param {*} payload 검색조건
		 */
		const searchGapRtList = async (pageNum = 1, payload = latestPayload) => {
			isGapRtList.value = true
			pagination.page = pageNum

			let data
			// 임계치(정상~이상)를 클릭한 경우
			if (gapRtMenu.value?.level) {
				const res = await monitoringApi.summaryDeals(
					gapRtMenu.value.level,
					gapRtItem.value.sggCd,
					gapRtItem.value.umdCd,
					payload,
					pagination
				)
				data = res.data
			} else {
				const res = await monitoringApi.list(payload, pagination, gapRtItem.value.sggCd, gapRtItem.value.umdCd)
				data = res.data
			}

			list.value = data.contents
			pagination.totalCount = 0 // 페이징 초기화
			pagination = Object.assign(pagination, data.pagination)
		}

		const onExcelClick = async () => {
			// if (gapRtMenu.value?.level) {
			// 	const res = await monitoringApi.summaryDealsExcel(
			// 		gapRtMenu.value.level,
			// 		gapRtItem.value.sggCd,
			// 		gapRtItem.value.umdCd,
			// 		payload
			// 	)
			// 	data = res.data
			// } else {
			// 	const res = await monitoringApi.summaryDealsExcel(
			// 		gapRtMenu.value.level,
			// 		gapRtItem.value.sggCd,
			// 		gapRtItem.value.umdCd,
			// 		payload
			// 	)
			// 	data = res.data
			// }
			loadingStore.isLoading = true
			const { data } = await monitoringApi.summaryDealsExcel(
				gapRtMenu.value?.level,
				gapRtItem.value?.sggCd,
				gapRtItem.value?.umdCd,
				latestPayload
			)

			loadingStore.isLoading = false
			const url = window.URL.createObjectURL(data)
			var link = document.createElement('a')

			link.href = url
			link.download = '아파트 모니터링.xlsx'
			link.click()
		}

		/**
		 * 지도 오버레이 조회 (시군구,읍면동,필지 오버레이)
		 * @param {*} payload
		 */
		const searchSummary = async (payload = latestPayload) => {
			// isLoading.value = true
			// pnu 레벨인 경우 bbox 파라미터 추가
			if (level.value === 'pnu') {
				Object.assign(payload, {
					bbox: WGMap.getView().calculateExtent().join(','),
				})
			}
			const { data } = await monitoringApi.summary(level.value, payload)

			// 원 크기 3단계 스텝 생성
			sizeStep = useStep(data, {
				property: 'dealCnt',
				steps: 3,
			})

			summaryDetailParams.value = payload // 오버레이 생성기준 검색조건
			clearSummaryOverlay() // 오버레이 삭제
			data.forEach(createSummaryOverlay) // 오버레이 생성
			// isLoading.value = false
		}

		/**
		 * 지도 임계치 건수 피쳐 조회
		 * @param {*} pageNum
		 * @param {*} payload
		 */
		const searchSummaryFeatures = async (payload = latestPayload) => {
			console.log('피쳐조회', gapRtMenu.value?.level, gapRtItem.value.sggCd, gapRtItem.value.umdCd)
			const { data } = await monitoringApi.summaryDealsCoord(
				gapRtMenu.value.level,
				gapRtItem.value.sggCd,
				gapRtItem.value.umdCd,
				payload
			)
			console.log('피처조회결과', data)
			clearGapFeature()
			// createGapFeature(gapRtMenu.value.level, data)
			createGapFeature(gapRtMenu.value, data)
		}

		/**
		 * 오버레이 생성
		 * @param {*} item
		 */
		const createSummaryOverlay = (item) => {
			const circleSizeStep = sizeStep.getStep(item.dealCnt)
			const circleSize = getCircleSize(circleSizeStep)

			const div = document.createElement('div')
			div.classList.add('balloon')
			div.classList.add('circle')
			// div.style.width = '95px'
			// div.style.height = '95px'
			div.style.width = circleSize
			div.style.height = circleSize
			div.style.userSelect = 'none'
			const stepColor = getColor(item.gapRtLevel || '0')

			div.style.backgroundColor = stepColor
			div.style.cursor = 'pointer'

			const strong = document.createElement('strong')
			strong.style.fontSize = '0.925rem'
			strong.classList.add('txt-lg')
			strong.innerText = item.bjdNm

			const span1 = document.createElement('span')
			span1.classList.add('txt-sm')
			span1.style.fontSize = '0.775rem'
			span1.title = '거래건수/평균거래금액'
			const tmpAmt = (item.objAmtAvrg / 10000).toFixed(1)
			span1.innerHTML = `${new Intl.NumberFormat().format(item.dealCnt || 0)}건/${tmpAmt}억`

			const span2 = document.createElement('span')
			span2.classList.add('txt-sm')
			span2.title = '임계치건수/평균임계치'
			span2.style.fontSize = '0.775rem'
			if (!item.gapRt || item.gapRt == 0) {
				span2.innerHTML = (item.gapRtCnt || 0) + '/0%'
			} else {
				span2.innerHTML = `${item.gapRt > 0 ? '▲' : '▼'} ${item.gapRtCnt || 0}/${item.gapRt}%`
			}

			div.appendChild(strong)
			div.appendChild(span1)
			div.appendChild(span2)

			let menuItems = [
				{
					id: 'normal',
					title: `정상`,
					subTitle: `${item.level0Cnt || 0}건`,
					count: item.level0Cnt,
					level: '0',
					color: getColor('0'),
				},
				{
					id: 'plus1',
					title: `주의`,
					subTitle: `${item.level1Cnt || 0}건`,
					count: item.level1Cnt,
					level: '1',
					color: getColor('1'),
				},
				{
					id: 'plus2',
					title: `경고`,
					subTitle: `${item.level2Cnt || 0}건`,
					count: item.level2Cnt,
					level: '2',
					color: getColor('2'),
				},
				{
					id: 'plus3',
					title: `이상`,
					subTitle: `${item.level3Cnt || 0}건`,
					count: item.level3Cnt,
					level: '3',
					color: getColor('3'),
				},
				{
					id: 'minus3',
					title: `이상`,
					subTitle: `${item.levelM3Cnt || 0}건`,
					count: item.levelM3Cnt,
					level: '-3',
					color: getColor('-3'),
				},
				{
					id: 'minus2',
					title: `경고`,
					subTitle: `${item.levelM2Cnt || 0}건`,
					count: item.levelM2Cnt,
					level: '-2',
					color: getColor('-2'),
				},
				{
					id: 'minus1',
					title: `주의`,
					subTitle: `${item.levelM1Cnt || 0}건`,
					count: item.levelM1Cnt,
					level: '-1',
					color: getColor('-1'),
				},
			]

			// 정상 미포함인경우
			if (summaryDetailParams.value.statsGbn === '2') {
				menuItems.shift()
			}

			let svgMenu = new RadialMenu({
				parent: div,
				size: 250,
				step: circleSizeStep,
				closeOnClick: false,
				menuItems: menuItems,
				// 서클 메뉴 클릭 (중앙클릭X)
				onClick: async function (menu) {
					if (level.value === 'pnu') {
						console.log('임계치레벨 선택:', menu.level, menu.title)
						item.menu = menu
						summaryDetail.value = item
					} else {
						gapRtMenu.value = menu // 선택된 임계치메뉴
						gapRtItem.value = item // 선택된 요약아이템
						searchGapRtList(1, summaryDetailParams.value)
						searchSummaryFeatures(summaryDetailParams.value)
					}
				},
			})

			const popup = new wg.Overlay({
				id: 'monitoring-summary-' + item.bjdCd,
				element: div,
				positioning: 'center-center',
				// className: 'monitoring-summary-overlay',
				offset: [-50, -50],
				stopEvent: false,
				type: 'monitoring-summary',
			})
			popup.setPosition([item.lon, item.lat])

			const DELAY = 300
			let timer = null
			let isDrag = false
			div.addEventListener('mousedown', () => (isDrag = false))
			div.addEventListener('mousemove', () => (isDrag = true))
			div.addEventListener('mouseup', (e) => {
				isDrag && console.log('drag')
				if (!isDrag) {
					// 클릭
					if (!timer) {
						// 메뉴가 열려있는지 여부
						let isOpen = svgMenu.currentMenu != null
						timer = setTimeout(() => {
							e.stopPropagation()
							e.preventDefault()

							// 임계치 메뉴 오픈
							// 오버레이를 부모의 가장 마지막으로 이동하여 화면 맨앞에 표시되도록

							const targetEl = $(e.target).closest('.balloon.circle').parent()

							$(e.target).closest('.balloon.circle').parent().parent().append(targetEl)
							if (!isOpen) {
								svgMenu.open()

								// 좌측 리스트 시군구/읍면동 조건으로 조회
								if (level.value !== 'pnu') {
									gapRtMenu.value = null
									gapRtItem.value = item // 선택된 요약아이템
									searchGapRtList(1, latestPayload)
								}
							}

							clearTimeout(timer)
							timer = null
						}, DELAY)
					}
					// 더블클릭
					else {
						if (level.value === 'pnu') {
							// 임계치 메뉴가 아닌 중앙원 선택
							item.menu = {
								color: 'black',
								count: item.gapRtCnt,
							}
							summaryDetail.value = item
						} else {
							clearTimeout(timer)
							timer = null
							WGMap.getView().animate({
								center: [item.lon, item.lat],
								zoom: level.value === 'sgg' ? 14 : 16,
								duration: 500,
							})
						}
					}
				}
			})

			WGMap.addOverlay(popup)
		}

		/**
		 * summary 오버레이 삭제
		 */
		const clearSummaryOverlay = () => {
			WGMap.getOverlays()
				.getArray()
				.filter((o) => o.options.type === 'monitoring-summary')
				.forEach((o) => WGMap.removeOverlay(o))
		}

		/**
		 * 임계치 피쳐 레이어 생성
		 * @param {*} item
		 */
		const createGapFeature = (menu, data) => {
			let source = new wg.source.Vector()
			let layer = new wg.layer.Vector({
				id: 'apt-monitoring-gap',
				source: source,
			})

			// 임계치 건수 피쳐 생성 (사각형 숫자)
			data.forEach((item) => {
				let feature = new wg.Feature(new wg.geom.Point([item.lon, item.lat]))
				let style = new wg.style.Style({
					image: new wg.style.RegularShape({
						fill: new wg.style.Fill({ color: getColor(menu.level) }),
						points: 4,
						radius: 15,
						angle: Math.PI / 4,
					}),
					text: new wg.style.Text({
						font: '1rem sans-serif',
						fill: new wg.style.Fill({ color: 'white' }),
						offsetY: 2,
						text: item.sumGapRtLevelCnt.toString(),
					}),
				})
				item.menu = menu
				feature.setStyle(style)
				feature.setProperties(item)
				source.addFeature(feature)
			})

			WGMap.addLayer(layer)

			WGMap.on('pointermove', onFeatureHover)
			WGMap.on('click', onFeatureClick)
		}

		/**
		 * 임계치 피쳐 레이어 삭제
		 */
		const clearGapFeature = () => {
			WGMap.removeLayer(WGMap.getLayerById('apt-monitoring-gap'))
			WGMap.un('pointermove', onFeatureHover)
			WGMap.un('click', onFeatureClick)
		}

		/**
		 * 임계치 피처 클릭 이벤트 핸들러
		 * @param {*} e
		 */
		const onFeatureClick = (e) => {
			WGMap.forEachFeatureAtPixel(
				e.pixel,
				(f) => {
					console.log('피쳐클릭', f)
					summaryDetail.value = f.getProperties()
				},
				{
					layerFilter: (layer) => layer.get('id') === 'apt-monitoring-gap',
				}
			)
		}

		/**
		 * 임계치 피쳐 마우스오버 이벤트 핸들러
		 * @param {*} e
		 */
		const onFeatureHover = (e) => {
			if (hoverFeature !== null) {
				hoverFeature = null
			}

			WGMap.forEachFeatureAtPixel(
				e.pixel,
				(f) => {
					hoverFeature = f
					return true
				},
				{
					layerFilter: (layer) => layer.get('id') === 'apt-monitoring-gap',
				}
			)

			if (hoverFeature) {
				const [lon, lat] = wg.proj.transform(hoverFeature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326')
				const template = localOverlayElement.value
				template.querySelector('.name').innerText = hoverFeature.get('objTitle')
				template.querySelector('.addr').innerText = hoverFeature.get('addr')
				localOverlay = new wg.Overlay({
					element: template,
					positioning: 'center-center',
					offset: [5, 240],
					type: 'marker_overlay',
				})
				let coordinate = wg.proj.fromLonLat([lon, lat])
				localOverlay.setPosition(coordinate)
				WGMap.addOverlay(localOverlay)
				WGMap.getTargetElement().style.cursor = 'pointer'
			} else {
				WGMap.removeOverlay(localOverlay)
				WGMap.getTargetElement().style.cursor = ''
			}
		}
		/**
		 * 검색
		 * @param {*} pageNum
		 * @param {*} payload
		 */
		const onSearch = async (pageNum = 1, payload) => {
			if (payload) {
				Object.assign(latestPayload, payload)
			}
			searchSummary(latestPayload)
			searchList(pageNum, latestPayload)
		}

		/**
		 * 줌 변경 이벤트 핸들러
		 */
		const onZoomChange = () => {
			const getLevel = (zoom) => {
				if (zoom <= 13) {
					return 'sgg'
				} else if (zoom > 13 && zoom < 16) {
					return 'umd'
				} else {
					return 'pnu'
				}
			}
			if (Number.isInteger(WGMap.getView().getZoom())) {
				const zoom = WGMap.getView().getZoom()
				const currentLevel = getLevel(zoom)
				if (level.value !== currentLevel) {
					level.value = currentLevel
					console.log('레벨변경 재조회' + zoom, level.value)
					searchSummary(latestPayload)
				}
			}
		}

		/**
		 * 지도 이동 이벤트 핸들러
		 */
		const onMoveEnd = () => {
			// 필지레벨인 경우 오버레이 재조회
			if (level.value === 'pnu') {
				searchSummary(latestPayload)
			}
		}

		/**
		 * 리스트 위치버튼 클릭 이벤트 핸들러
		 * @param {*} item
		 */
		const onLocationClick = async (item) => {
			if (item.pnu.length === 19) {
				const { data } = await pnuApi.getGeometryByPnu(item.pnu)

				const [lon, lat] = wg.proj.transform([data.lon, data.lat], 'EPSG:3857', 'EPSG:4326')

				overlayStore.mergeState({
					type: '1',
					title: item.objTitle,
					category: item.bldgUseNm,
					addr: item.addr,
					lon: lon,
					lat: lat,
					isShow: true,
					pnu: item.pnu,
					geometries: [], //location.geometry,
				})
			} else if (item.pnu.length === 10) {
				const { data } = await locationApi.getUMDCenterCoord(item.pnu)
				WGMap.getView().setCenter([data.lon, data.lat])
				WGMap.getView().setZoom(15)
			}
		}

		return {
			summaryDetail,
			summaryDetailParams,
			isActiveDetail,
			list,
			isGapRtList, // 리스트가 임계치목록인지 여부
			pagination,
			localOverlayElement,
			onSearch,
			onLocationClick,
			createSummaryOverlay,
			numberToKorean,
			searchList,
			searchGapRtList,
			onExcelClick,
		}
	},
}

function getColor(step) {
	return {
		'-3': 'rgba(0, 100, 148, 0.8)',
		'-2': 'rgba(5, 130, 202, 0.8)',
		'-1': 'rgba(0, 166, 251, 0.8)',
		'0': 'rgba(112, 224, 0, 0.8)',
		'1': 'rgba(252, 191, 73, 0.8)',
		'2': 'rgba(247, 127, 0, 0.8)',
		'3': 'rgba(214, 40, 40, 0.8)',
	}[step]
}

function getCircleSize(step) {
	return {
		0: '95px',
		1: '110px',
		2: '125px',
	}[step]
}
</script>

<style scoped>
a {
	cursor: pointer;
}
div.menuHolder {
	position: absolute !important;
}
.location-pop {
	width: 200px;
	height: 50px;
}
.location-pop .name {
	white-space: nowrap;
}
</style>
