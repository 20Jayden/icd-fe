<template>
	<div class="search">
		<div class="tit">부동산 시장 모니터링 리스트</div>
		<div class="result-list">
			<div v-if="list.length === 0" class="none"><span>결과가 없습니다.</span></div>
			<ul v-else>
				<li v-for="(item, index) in list" :key="index">
					<div class="info">
						<strong v-if="item.complexName" class="name">{{ item.complexName }}</strong>
						<strong v-else class="name" style="color: #ccc">(물건명 없음)</strong>
						<span class="type">{{ item.totalArticleCount }}건</span>
						<span class="type text-danger">{{ numberToKorean(item.medianPrice * 10000) }}</span>
						<span class="addr">{{ item.addressFull }}</span>
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
		<MarketMonitoringCondition @search="onSearch" />
		<MarketSummaryDetail
			v-if="isActiveDetail"
			:level="level"
			:detail="summaryDetail"
			:params="summaryDetailParams"
			@close="() => (summaryDetail = {})"
		/>
	</Teleport>
</template>

<script>
//basic
import { computed, onMounted, onUnmounted, ref, reactive } from 'vue'
//api
import { marketMonitoring as monitoringApi, monitorBottom as pnuApi } from '@/api/monitor'
import locationApi from '@/api/location'
//components
import MarketMonitoringCondition from '@/components/popup/monitoringCondition/MarketMonitoringCondition.vue'
import MarketSummaryDetail from '@/components/popup/monitoringDetail/MarketSummaryDetail.vue'
import Pagination from '@/components/Pagination.vue'
import CommonUtil from '@/api/logTable'
//composition
import { useUtil } from '@/composition/util'
//stores
import { useLoadingStore } from '@/stores/loading'
import { useOverlayStore } from '@/stores/overlay'
import { useUserStore } from '@/stores/user'
import { useLog } from '@/stores/log'
import { useMenuStore } from '@/stores/menu'

export default {
	components: {
		MarketMonitoringCondition,
		MarketSummaryDetail,
		Pagination,
	},
	setup() {
		const loadingStore = useLoadingStore()
		const overlayStore = useOverlayStore()
		const userStore = useUserStore()
		const menuStore = useMenuStore()
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

			const { data, status } = await monitoringApi.list(payload, pagination)
			if (status.code == 200) {
				CommonUtil.log(log.TARGET.MARKETMONITORING, log.ACTION.SUCCESS, null)
			} else {
				CommonUtil.log(log.TARGET.MARKETMONITORING, log.ACTION.FAIL, null)
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
			const { data } = await monitoringApi.summary(level.value, payload)

			if (menuStore.lnbActive !== 'monitoring') {
				return
			}

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
			// 오버레이 생성
			summaryDetailParams.value = payload // 오버레이 생성기준 검색조건
			// isLoading.value = false
		}

		/**
		 * summary 오버레이 생성
		 * @param {*} item
		 */
		const createSummaryOverlay = (item) => {
			const div = document.createElement('div')
			div.classList.add('balloon')
			div.style.width = 'auto'
			div.style.cursor = 'pointer'
			div.style.userSelect = 'none'
			div.classList.add('lv-' + numberToLevel(item.medianPriceAvrg))

			const strong = document.createElement('strong')
			strong.classList.add('txt-lg')
			strong.style.fontSize = '0.825rem'
			strong.innerText = item.bjdNm
			div.appendChild(strong)

			const span = document.createElement('span')
			span.classList.add('txt-sm')
			span.style.fontSize = '0.665rem'
			// span.innerText = `${d.dealCnt}/${numberToKorean(d.objAmt)}`
			const tmpAmt = (item.medianPriceAvrg / 10000).toFixed(1)
			if (item.totalArticleCount === 0 || item.totalArticleCount === null) {
				span.innerHTML = ``
				div.appendChild(span)
			} else {
				span.innerHTML = `${new Intl.NumberFormat().format(item.totalArticleCount || 0)}건/${tmpAmt}억`
				div.appendChild(span)
			}

			const i = document.createElement('i')
			if (item.totalArticleCount > item.preArticleCount) {
				i.classList.add('up')
			} else if (item.totalArticleCount < item.preArticleCount) {
				i.classList.add('down')
			}
			div.appendChild(i)

			const DELAY = 300
			let timer = null
			let isDrag = false
			div.addEventListener('mousedown', () => (isDrag = false))
			div.addEventListener('mousemove', () => (isDrag = true))
			div.addEventListener('mouseup', async (e) => {
				isDrag && console.log('drag')
				if (!isDrag) {
					// 클릭
					if (!timer) {
						timer = setTimeout(() => {
							e.stopPropagation()
							e.preventDefault()

							// 상세정보 조회
							summaryDetail.value = item // 상세기본정보
							console.log('summaryDetail', summaryDetail.value)
							clearTimeout(timer)
							timer = null
						}, DELAY)
					} else {
						console.log('item', item)
						clearTimeout(timer)
						timer = null
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

			if (level.value === 'pnu') {
				const [lon, lat] = wg.proj.transform([item.longitude, item.latitude], 'EPSG:4326', 'EPSG:3857')
				popUp.setPosition([lon, lat])
			} else {
				popUp.setPosition([item.lon, item.lat])
			}

			// popUp.setPosition([item.lon, item.lat])
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
				console.log(zoom)
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
			const num = number / 10000

			if (num == 0) {
				return 0
			} else if (num < 1) {
				return 1
			} else if (num >= 1 && num < 3) {
				return 2
			} else if (num >= 3 && num < 7) {
				return 3
			} else if (num >= 7 && num < 15) {
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
			console.log(item)
			// if (item.pnu.length === 19) {
			// const { data } = await pnuApi.getGeometryByPnu(item.pnu)~

			overlayStore.mergeState({
				type: '1',
				title: item.complexName,
				category: item.bldgUseNm,
				addr: item.addressFull,
				lon: item.longitude,
				lat: item.latitude,
				isShow: true,
				pnu: item.pnu,
				geometries: [], //location.geometry,
			})
			// } else if (item.pnu.length === 10) {
			// 	const { data } = await locationApi.getUMDCenterCoord(item.pnu)
			// 	WGMap.getView().setCenter([data.lon, data.lat])
			// 	WGMap.getView().setZoom(15)
			// }
		}
		return {
			summaryDetail,
			summaryDetailParams,
			isActiveDetail,
			list,
			level,
			pagination,
			onSearch,
			// onMonitoringCheckChange,
			numberToKorean,
			onLocationClick,
		}
	},
}
</script>

<style scoped></style>
