<template>
	<div class="search">
		<div class="tit">전월세 모니터링 리스트</div>
		<div class="result-list">
			<div v-if="list.length === 0" class="none"><span>결과가 없습니다.</span></div>
			<ul v-else>
				<li v-for="(item, index) in list" :key="index">
					<div class="info">
						<strong v-if="item.objTitle" class="name">{{ item.objTitle }}</strong>
						<strong v-else class="name" style="color: #ccc">(물건명 없음)</strong>
						<span v-if="item.rentGbn === '1'" class="residence color-1">전</span>
						<span v-else-if="item.rentGbn === '2' || '3' || '4'" class="residence color-2">월</span>
						<span class="type text-danger"
							>{{ numberToKorean(item.rentGtn * 10000) }}
							{{
								item.rentFee === 0 || item.rentFee === null ? '' : ' / ' + numberToKorean(item.rentFee * 10000)
							}}</span
						>
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
			@movePage="onSearch"
		/>
	</div>
	<Teleport to="#popupContainer">
		<RentMonitoringCondition @search="onSearch" />
		<RentSummaryDetail
			v-if="isActiveDetail"
			:detail="summaryDetail"
			:params="summaryDetailParams"
			@close="() => (summaryDetail = {})"
		/>
	</Teleport>
</template>

<script>
import { computed, onMounted, onUnmounted, ref, reactive } from 'vue'
import {
	rtmsMonitoring as monitoringApi,
	rentMonitoring as rentMonitoringApi,
	monitorBottom as pnuApi,
} from '@/api/monitor'
import locationApi from '@/api/location'
import { useUtil } from '@/composition/util'
import { useLoadingStore } from '@/stores/loading'
import { useOverlayStore } from '@/stores/overlay'
import { useUserStore } from '@/stores/user'
import { useLayerStore } from '@/stores/layer'
import { useLog } from '@/stores/log'
import RentMonitoringCondition from '@/components/popup/monitoringCondition/RentMonitoringCondition.vue'
import RtmsSummaryDetail from '@/components/popup/monitoringDetail/RtmsSummaryDetail.vue'
import RentSummaryDetail from '@/components/popup/monitoringDetail/RentSummaryDetail.vue'
import Pagination from '@/components/Pagination.vue'
import CommonUtil from '@/api/logTable'
export default {
	components: {
		RentMonitoringCondition,
		// RtmsSummaryDetail,
		RentSummaryDetail,
		Pagination,
	},
	setup() {
		const loadingStore = useLoadingStore()
		const overlayStore = useOverlayStore()
		const userStore = useUserStore()
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

		let latestPayload = reactive({})

		// 페이징 정보
		let pagination = reactive({
			page: 1,
			size: 7,
			unitPage: 5,
			totalCount: 0,
		})

		onMounted(async () => {
			await userStore.getLoginUser
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
			WGMap.getView().un('change:resolution', onZoomChange)
			WGMap.un('moveend', onMoveEnd)
		})

		/**
		 * 목록 조회
		 * @param {*} pageNum
		 * @param {*} payload
		 */
		const searchList = async (pageNum = 1, payload = latestPayload) => {
			if (payload.dataGbn === 'plcy') {
				latestPayload.userSggCd = userStore.loginUser.ogdpCd
			}
			loadingStore.isLoading = true

			pagination.page = pageNum

			const { data, status } = await rentMonitoringApi.list(payload, pagination)
			if (status.code == 200) {
				CommonUtil.log(log.TARGET.RENTMONITORING, log.ACTION.SUCCESS, null)
			} else {
				CommonUtil.log(log.TARGET.RENTMONITORING, log.ACTION.FAIL, null)
			}
			list.value = data.contents
			pagination.totalCount = 0 // 페이징 초기화
			pagination = Object.assign(pagination, data.pagination)

			setTimeout(() => (loadingStore.isLoading = false), 1000)
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
			const { data } = await rentMonitoringApi.summary(level.value, payload)

			clearSummaryOverlay() // 오버레이 삭제
			if (payload.dataGbn === 'plcy' && userStore.loginUser.ogdpCd !== '11000') {
				data.forEach((d) => {
					if (d.bjdCd && d.bjdCd.substr(0, 5) === userStore.loginUser.ogdpCd) {
						createSummaryOverlay(d)
					}
					if (d.pnu && d.pnu.substr(0, 5) === userStore.loginUser.ogdpCd) {
						createSummaryOverlay(d)
					}
				})
			} else {
				data.forEach(createSummaryOverlay)
			}
			summaryDetailParams.value = payload // 오버레이 생성기준 검색조건
			// isLoading.value = false
		}

		/**
		 * summary 오버레이 생성
		 * @param {*} item
		 */
		const createSummaryOverlay = (item) => {
			console.log('$$ item ::', item)
			const div = document.createElement('div')
			div.classList.add('balloon')
			div.style.width = 'auto'
			div.style.cursor = 'pointer'

			if (latestPayload.rentGbn.includes('1') && !latestPayload.rentGbn.includes('2')) {
				div.classList.add('lv-' + numberToLevel(item.rentGtnAvrg))
			} else if (!latestPayload.rentGbn.includes('1') && latestPayload.rentGbn.includes('2')) {
				div.classList.add('lv-' + numberToLevel(item.rentDepositAvrg))
			} else {
				div.classList.add('lv-' + numberToLevel(item.rentGtnAvrg + item.rentDepositAvrg))
			}

			const strong = document.createElement('strong')
			strong.classList.add('txt-lg')
			strong.style.fontSize = '0.825rem'
			strong.innerText = item.bjdNm

			div.appendChild(strong)

			// span.innerText = `${d.dealCnt}/${numberToKorean(d.objAmt)}`

			/**
			 *  평균 전세/건수 Text
			 */
			if (latestPayload.rentGbn.includes('1')) {
				const span = document.createElement('span')
				span.classList.add('txt-sm')
				span.style.fontSize = '0.665rem'
				span.style.whiteSpace = 'nowrap'

				// 전세건수가 없을 경우
				if (item.dealGtnCnt === 0 || item.dealGtnCnt === null) {
					span.innerHTML = ``
					div.appendChild(span)
				} else {
					const tmpGtnAmt = (item.rentGtnAvrg / 10000).toFixed(1)
					span.innerHTML += `전세 ${new Intl.NumberFormat().format(item.dealGtnCnt || 0)}건/${tmpGtnAmt}억`

					div.appendChild(span)
				}
			}

			/**
			 *  평균 월세/건수 Text
			 */
			if (latestPayload.rentGbn.includes('2')) {
				const span = document.createElement('span')
				span.classList.add('txt-sm')
				span.style.fontSize = '0.665rem'
				span.style.whiteSpace = 'nowrap'

				// 월세건수가 없을 경우
				if (item.dealFeeCnt === 0 || item.dealFeeCnt === null) {
					span.innerHTML = ``
					div.appendChild(span)
				} else {
					const tmpDepositAmt = (item.rentDepositAvrg / 10000).toFixed(1)
					const tmpFeeAmt = numberToKorean(item.rentFeeAvrg) || 0

					span.innerHTML = `월세 ${new Intl.NumberFormat().format(
						item.dealFeeCnt || 0
					)}건/${tmpDepositAmt}억/${tmpFeeAmt}만`

					div.appendChild(span)
				}
			}

			let isDrag = false
			div.addEventListener('mousedown', () => (isDrag = false))
			div.addEventListener('mousemove', () => (isDrag = true))
			div.addEventListener('mouseup', async () => {
				isDrag && console.log('drag')
				if (!isDrag) {
					// 상세정보 조회
					if (level.value === 'pnu') {
						summaryDetail.value = item // 상세기본정보
						// summaryDetailParams.value = payload
					} else {
						WGMap.getView().animate({
							center: [item.lon, item.lat],
							zoom: level.value === 'sgg' ? 14 : 16,
							duration: 500,
						})
					}
				}
			})

			const popUp = new wg.Overlay({
				id: 'monitoring-summary-' + item.bjdCd,
				element: div,
				positioning: 'center-center',
				// className: 'monitoring-summary-overlay',
				offset: [-50, 0],
				stopEvent: false,
				type: 'monitoring-summary',
			})
			popUp.setPosition([item.lon, item.lat])
			WGMap.addOverlay(popUp)
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
		 * 조회 이벤트 핸들러
		 * @param {*} pageNum
		 * @param {*} payload
		 */
		const onSearch = async (pageNum = 1, payload) => {
			if (payload) {
				Object.assign(latestPayload, payload)
				layerStore.setUmdLayer(payload.dongGbn)
				searchSummary(latestPayload)
			}
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
		 * 오버레이 색상 레벨 계산
		 * @param {*} number
		 */
		const numberToLevel = (number) => {
			const num = number / 1000

			if (num == 0) {
				return 0
			} else if (num < 1) {
				return 1
			} else if (num >= 1 && num < 10) {
				return 2
			} else if (num >= 10 && num < 50) {
				return 3
			} else if (num >= 50 && num < 100) {
				return 4
			} else {
				return 5
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
			pagination,
			onSearch,
			// onMonitoringCheckChange,
			numberToKorean,
			onLocationClick,
		}
	},
}
</script>

<style scoped>
.custom-text {
	margin: 0 0 10px 10px;
	padding: 4px;
	border: 2px solid #007dfb;
	border-radius: 50%;
	box-sizing: border-box;
	line-height: 1;
	text-align: center;
	font-weight: 500;
	font-size: 1rem;
	white-space: nowrap;
	vertical-align: baseline;
	display: inline-block;
}
.balloon.lv-4 {
	width: 150px;
}

.search .result-list .info .residence {
	width: 19px;
	height: 18px;
	line-height: initial;
	padding-top: 1px;
	padding-right: 1px;
}
</style>
