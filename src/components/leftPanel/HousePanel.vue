<template>
	<div class="content show">
		<div class="head">
			<h3>주택 동향분석</h3>
		</div>
		<div class="body slim-scroll">
			<div class="accordion">
				<a v-if="isHouseVisible" class="tit active" @click="onAccordionClick">주택 가격 동향</a>
				<ul v-if="isHouseVisible" class="house-trend">
					<li v-for="house in houseList" :key="house.id">
						<div class="custom-control">
							<input
								type="checkbox"
								:id="house.id"
								:checked="activeLayer === house.id"
								@change="onCheckedChange(house.id, $event.target.checked)"
							/>
							<label :for="house.id">{{ house.text }}</label>
						</div>
						<a
							v-if="house.isTimeline"
							class="btn btn-sm btn-primary open-timeseries"
							@click="() => (activeTimeline = house.id)"
						>
							시계열
						</a>
					</li>
				</ul>
			</div>
			<div class="accordion">
				<a v-if="isAptVisible" class="tit active" @click="onAccordionClick">주간 아파트 가격동향</a>
				<ul v-if="isAptVisible" class="house-trend">
					<li v-for="apt in aptList" :key="apt.id">
						<div class="custom-control">
							<input
								type="checkbox"
								:id="apt.id"
								:checked="activeLayer === apt.id"
								@change="onCheckedChange(apt.id, $event.target.checked)"
							/>
							<label :for="apt.id" v-html="apt.text"></label>
						</div>
						<a
							v-if="apt.isTimeline"
							class="btn btn-sm btn-primary open-timeseries"
							@click="() => (activeTimeline = apt.id)"
						>
							시계열
						</a>
					</li>
				</ul>
			</div>
		</div>
		<Teleport to="#popupContainer">
			<HouseStatsCondition
				v-if="menuStore.lnbActive === 'house' && activeLayer"
				ref="conditionComponent"
				:activeLayer="activeLayer"
				:latestStatYm="latestStatYm"
				:latestStatWk="latestStatWk"
				@search="onSearch"
			/>
			<HouseTimelinePopup
				v-if="activeTimeline"
				:layerId="activeTimeline"
				:searchParams="searchParams"
				@close="() => (activeTimeline = '')"
			/>
			<TrendSummary
				v-if="menuStore.lnbActive === 'house' && activeLayer && activeLayer !== 'rebuildAptPriceRate'"
				:summaryData="summaryData"
			/>
			<TrendSummaryCompare
				v-if="menuStore.lnbActive === 'house' && activeLayer && activeLayer === 'rebuildAptPriceRate'"
				:summaryData="summaryData"
			/>>
		</Teleport>
	</div>
	<ColorLegend
		v-show="menuStore.lnbActive === 'house' && activeLayer && activeLayer !== 'rebuildAptPriceRate'"
		:isChecked="isChecked"
	/>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick, computed, reactive, watch } from 'vue'
import HouseStatsCondition from '@/components/popup/statsCondition/HouseStatsCondition.vue'
import HouseTimelinePopup from '@/components/popup/statsTimeline/HouseTimelinePopup.vue'
import TrendSummary from '../TrendSummary.vue'
import TrendSummaryCompare from '../TrendSummaryCompare.vue'
import houseTrendApi from '@/api/houseTrend'
import useStep from '@/composition/step'
import useStyle from '@/composition/style'
import { useStatsStore } from '@/stores/stats'
import { useMenuStore } from '@/stores/menu'
import { useLoadingStore } from '@/stores/loading'
import { useUserStore } from '@/stores/user'
import dayjs from 'dayjs'
import * as echarts from 'echarts'
import { layerAuth as layerAuthApi } from '@/api/settings'
import CommonUtil from '@/api/logTable'
import { useLog } from '@/stores/log'
import { useColorStore } from '@/stores/color'
import ColorLegend from '../ColorLegend.vue'
import { useModalStore } from '@/stores/modal'

export default {
	components: {
		HouseStatsCondition,
		HouseTimelinePopup,
		TrendSummary,
		TrendSummaryCompare,
		ColorLegend,
	},
	setup() {
		const loadingStore = useLoadingStore()
		const log = useLog()
		// let isLoading = ref(false)

		// 통계조건 컴포넌트
		const conditionComponent = ref(null)

		// 활성화된 통계레이어
		let activeLayer = ref('')
		// 활성화된 시계열레이어
		let activeTimeline = ref('')

		// 통계 레이어 (공간데이터 시군구)
		let layer = null

		// 대권역/권역/시군구 벡터소스
		let sourceGrtRegion = null
		let sourceRegion = null
		let sourceSgg = null
		// 레이어의 현재 벡터소스
		let currentSource = null

		// 통계검색 조건
		let searchParams = reactive({})

		// 통계 값
		let values = {}

		// step composition
		let step = null
		// style composition
		const style = useStyle()

		// 최근 통계 년월
		let latestStatYm = ref('')
		// 최근 통계 주
		let latestStatWk = ref('')

		// 통계 스토어
		const statsStore = useStatsStore()
		// 메뉴 스토어
		const menuStore = useMenuStore()
		// 유저 스토어
		const userStore = useUserStore()
		// 컬러 스토어
		const colorStore = useColorStore()
		// 모달 스토어
		const modalStore = useModalStore()

		// 서울수도권 요약정보
		let summaryData = ref({})

		let absoluteStep = null

		// 범례를 화면상에 펼치기 위함
		let isChecked = ref(false)

		// 마우스hover 피쳐
		let hoverFeature = null

		// 차트가 렌더링되는 레이어인지 여부 (재건축VS일반 아파트 가격변동률 현황)
		let isChartLayer = computed(() => activeLayer.value === 'rebuildAptPriceRate')

		const isHouseVisible = ref(false)
		const isAptVisible = ref(false)

		let houseList = ref([
			{ id: 'priceRate', text: '가격변동률 현황', isTimeline: true },
			{ id: 'priceIndex', text: '가격지수 현황', isTimeline: true },
			{ id: 'rtmsPriceRate', text: '실거래 가격변동률 현황', isTimeline: true },
			{ id: 'rtmsPriceIndex', text: '실거래 가격지수 현황', isTimeline: true },
		])

		let aptList = ref([
			{ id: 'aptPriceRate', text: '아파트 가격변동률 현황', isTimeline: true },
			{ id: 'rebuildAptPriceRate', text: '재건축VS일반 아파트<br>가격변동률 현황', isTimeline: true },
		])

		const TREND_MAP_CENTER = [14132881.28821598, 4518955.77949531]
		const TREND_MAP_ZOOM = 12

		onMounted(async () => {
			await getUserLayer()
			await initLayer()
		})

		onUnmounted(() => {
			layer.setVisible(false) // visible 해제시 트리깅되는 이벤트 반영
			WGMap.removeLayer(layer)
			WGMap.getOverlays().clear()
			statsStore.resetState()
		})

		// 레이어 색상 변경
		watch(
			() => colorStore.colors,
			() => {
				if (layer) {
					layer.changed()
				}
			}
		)

		// 범례 초기화
		watch(
			() => activeLayer.value,
			(newActiveLayer) => {
				if (!newActiveLayer) {
					colorStore.setRange([])
				}
			}
		)

		/**
		 * 레이어 초기화
		 * 통계레이어 = (시군구/권역/대권역) + 데이터
		 */
		const initLayer = async () => {
			console.log('initLayer')
			// 시군구 벡터 소스
			sourceSgg = new wg.source.Vector({
				name: 'sgg',
				format: new wg.format.GeoJSON(),
				url: () => {
					return (
						'/gis/wfs' +
						'?service=WFS&' +
						'version=1.1.0&request=GetFeature&typename=spta:GIS_TL_SCCO_SIG&' +
						'outputFormat=application/json'
					)
				},
			})
			sourceSgg.setProperties({
				levelNo: 4,
				levelNm: '시군구',
			})
			// 권역 벡터소스
			sourceRegion = new wg.source.Vector({
				name: 'region',
				format: new wg.format.GeoJSON(),
				url: () => {
					return (
						'/gis/wfs' +
						'?service=WFS&' +
						'version=1.1.0&request=GetFeature&typename=spta:GIS_REGION_SEOUL&' +
						'outputFormat=application/json'
					)
				},
			})
			sourceRegion.setProperties({
				levelNo: 3,
				levelNm: '권역',
			})
			// 대권역 벡터 소스
			sourceGrtRegion = new wg.source.Vector({
				name: 'grtRegion',
				format: new wg.format.GeoJSON(),
				url: () => {
					return (
						'/gis/wfs' +
						'?service=WFS&' +
						'version=1.1.0&request=GetFeature&typename=spta:GIS_GRT_REGION_SEOUL&' +
						'outputFormat=application/json'
					)
				},
			})
			sourceGrtRegion.setProperties({
				levelNo: 2,
				levelNm: '대권역',
			})

			// 현재 벡터소스 (줌 레벨에 맞는..)
			currentSource = getSourceByZoom()

			// 주택동향 레이어
			layer = await new wg.layer.Vector({
				id: 'houseTrend',
				source: currentSource,
				style: getStyle,
				opacity: 0.7,
				visible: false,
			})

			// 맵에 주택동향레이어 추가
			WGMap.addLayer(layer)

			// 주택동향 레이어 on/off 변경 이벤트 핸들러 등록
			layer.on('change:visible', (e) => {
				console.log('layer visible change')
				const isVisible = e.target.get(e.key)
				if (isVisible) {
					WGMap.on('pointermove', onPointerMove)
					WGMap.getView().on('change:resolution', onZoomChange)
				} else {
					WGMap.un('pointermove', onPointerMove)
					WGMap.getView().un('change:resolution', onZoomChange)
				}
			})
		}

		// 레이어 표출
		const getUserLayer = async () => {
			const { data } = await layerAuthApi.getUserLayer(userStore.loginUser.id, 'HOUSE')

			let authLayerArray = []
			for (let i = 0; i < data.length; i++) {
				let inputString = data[i]
				let underscoreIndex = inputString.indexOf('_')

				if (underscoreIndex !== -1) {
					let authPrefix = inputString.substring(0, underscoreIndex)
					let authName = inputString.substring(underscoreIndex + 1)

					let authNameLowerCase = authName.toLowerCase()

					authLayerArray.push(authNameLowerCase)
				}
			}
			let houseTempArr = []
			let aptTempArr = []
			for (let j = 0; j < houseList.value.length; j++) {
				for (let i = 0; i < authLayerArray.length; i++) {
					if (authLayerArray[i] === houseList.value[j].id.toLowerCase()) {
						houseTempArr.push(houseList.value[j])
					}
				}
			}
			for (let k = 0; k < aptList.value.length; k++) {
				for (let l = 0; l < authLayerArray.length; l++) {
					if (authLayerArray[l] === aptList.value[k].id.toLowerCase()) {
						aptTempArr.push(aptList.value[k])
					}
				}
			}

			houseList.value = houseTempArr
			aptList.value = aptTempArr
			if (houseList.value.length > 0) {
				isHouseVisible.value = true
			}
			if (aptList.value.length > 0) {
				isAptVisible.value = true
			}
		}
		/**
		 * 스타일 생성
		 * @param {*} feature
		 */
		const getStyle = (feature) => {
			const { stroke, fill, title, subTitle } = style.getStyle()

			if (isChartLayer.value) {
				// 차트가 있을 경우 레이어에 적용되는 색상
				const isChartFillColor = '#fff'
				const isChartFillStyle = new wg.style.Style({
					fill: new wg.style.Fill({
						color: isChartFillColor,
					}),
				})

				return [stroke(), isChartFillStyle]
			} else {
				let code = ''
				let name = ''
				if (feature.get('BJCD')) {
					code = 'BJCD'
					name = 'NAME'
				} else if (feature.get('SIG_CD')) {
					code = 'SIG_CD'
					name = 'SIG_KOR_NM'
				}

				// 범례가 초기화 됐을 경우 레이어에 적용되는 색상
				if (colorStore.colorRange.length === 0) {
					const isFillColor = '#fff'
					const isFillColorStyle = new wg.style.Style({
						fill: new wg.style.Fill({
							color: isFillColor,
						}),
					})

					return [stroke(), isFillColorStyle]
				} else {
					const _value = values[feature.get(code)] ?? '0' // 시군구명
					const _step = step?.getStep(_value) ?? 0 // 스텝
					// const _isNagative = _value < 0
					feature.set('VALUE', _value) // 값
					// return [stroke(), fill(_step, _isNagative), title(feature.get(name)), subTitle(Number(_value).toFixed(2))]
					return [stroke(), fill(_step), title(feature.get(name)), subTitle(Number(_value).toFixed(2))]
				}
			}
		}
		/**
		 * 체크박스 이벤트 핸들러
		 * @param {*} name
		 * @param {*} bool
		 */
		const onCheckedChange = async (name, bool) => {
			activeLayer.value = bool ? name : ''
			latestStatYm.value = ''
			latestStatWk.value = ''
			//로그테이블 주택동향 체크박스 클릭시
			if (activeLayer.value == 'priceRate') {
				await CommonUtil.log(log.TARGET.PRICERATE, log.ACTION.CLICK, null)
				console.log('1 선택')
			}
			if (activeLayer.value == 'priceIndex') {
				await CommonUtil.log(log.TARGET.PRICEINDEX, log.ACTION.CLICK, null)
				console.log('2 선택')
			}
			if (activeLayer.value == 'rtmsPriceRate') {
				await CommonUtil.log(log.TARGET.RTMSPRICERATEBYBUILD, log.ACTION.CLICK, null)
				console.log('3 선택')
			}
			if (activeLayer.value == 'rtmsPriceIndex') {
				await CommonUtil.log(log.TARGET.RTMSPRICEINDEX, log.ACTION.CLICK, null)
				console.log('4 선택')
			}
			if (activeLayer.value == 'aptPriceRate') {
				await CommonUtil.log(log.TARGET.APTPRICERATE, log.ACTION.CLICK, null)
				console.log('5 선택')
			}
			if (activeLayer.value == 'rebuildAptPriceRate') {
				await CommonUtil.log(log.TARGET.REBUILDAPTPRICERATE, log.ACTION.CLICK, null)
				console.log('6 선택')
			}
			if (bool) {
				WGMap.getView().setZoom(TREND_MAP_ZOOM)
				WGMap.getView().setCenter(TREND_MAP_CENTER)
				// 범례 펼치기
				isChecked.value = true
				colorStore.activeIndex = -1

				// 통계조건 컴포넌트의 조회버튼 클릭 이벤트 핸들러 수행
				await nextTick() // 통계 컴포넌트가 마운트되길 기다림
				conditionComponent.value.onSearch()
				// onSearch(searchParams)
				// onZoomChange()
				// activeTimeline.value = name

				// 차트 레이어가 있을 경우 범례 접기
				if (isChartLayer.value) {
					isChecked.value = false
				}
			} else {
				statsStore.resetState()
			}

			// 체크박스 해제 시 오버레이 삭제
			WGMap.getOverlays().clear()

			layer.setVisible(bool)
		}
		/**
		 * 통계 데이터 조회
		 */
		const getData = {
			// 가격변동률 조회
			'priceRate': async (params) => {
				try {
					const { data, status } = await houseTrendApi.getPriceRate(params)
					if (status.code === 200) {
						console.log('1 데이터')
						CommonUtil.log(log.TARGET.PRICERATE, log.ACTION.SUCCESS, null)
					} else {
						console.log('1 데이터 조회 실패')
						CommonUtil.log(log.TARGET.PRICERATE, log.ACTION.FAIL, null)
					}
					return data
				} catch (error) {
					console.error('1 데이터 조회 에러:', error)
					CommonUtil.log(log.TARGET.PRICERATE, log.ACTION.FAIL, null)
					throw error
				}
			},
			// 가격지수 조회
			'priceIndex': async (params) => {
				try {
					const { data, status } = await houseTrendApi.getPriceIndex(params)
					if (status.code === 200) {
						console.log('2 데이터')
						CommonUtil.log(log.TARGET.PRICEINDEX, log.ACTION.SUCCESS, null)
					} else {
						console.log('2 데이터 조회 실패')
						CommonUtil.log(log.TARGET.PRICEINDEX, log.ACTION.FAIL, null)
					}
					return data
				} catch (error) {
					console.error('2 데이터 조회 에러:', error)
					CommonUtil.log(log.TARGET.PRICEINDEX, log.ACTION.FAIL, null)
					throw error
				}
			},
			// 실거래 가격변동률 조회
			'rtmsPriceRate': async (params) => {
				try {
					const { data, status } = await houseTrendApi.getRtmsPriceRate(params)
					if (status.code === 200) {
						console.log('3 데이터')
						CommonUtil.log(log.TARGET.RTMSPRICERATEBYBUILD, log.ACTION.SUCCESS, null)
					} else {
						console.log('3 데이터 조회 실패')
						CommonUtil.log(log.TARGET.RTMSPRICERATEBYBUILD, log.ACTION.FAIL, null)
					}
					return data
				} catch (error) {
					console.error('3 데이터 조회 에러:', error)
					CommonUtil.log(log.TARGET.RTMSPRICERATEBYBUILD, log.ACTION.FAIL, null)
					throw error
				}
			},
			// 실거래 가격지수 조회
			'rtmsPriceIndex': async (params) => {
				try {
					const { data, status } = await houseTrendApi.getRtmsPriceIndex(params)
					if (status.code === 200) {
						console.log('4 데이터')
						CommonUtil.log(log.TARGET.RTMSPRICEINDEX, log.ACTION.SUCCESS, null)
					} else {
						console.log('4 데이터 조회 실패')
						CommonUtil.log(log.TARGET.RTMSPRICEINDEX, log.ACTION.FAIL, null)
					}
					return data
				} catch (error) {
					console.error('4 데이터 조회 에러:', error)
					CommonUtil.log(log.TARGET.RTMSPRICEINDEX, log.ACTION.FAIL, null)
					throw error
				}
			},
			// 아파트 가격변동률 조회
			'aptPriceRate': async (params) => {
				try {
					const { data, status } = await houseTrendApi.getAptPriceRate(params)
					if (status.code === 200) {
						console.log('5 데이터')
						CommonUtil.log(log.TARGET.APTPRICERATE, log.ACTION.SUCCESS, null)
					} else {
						console.log('5 데이터 조회 실패')
						CommonUtil.log(log.TARGET.APTPRICERATE, log.ACTION.FAIL, null)
					}
					return data
				} catch (error) {
					console.error('5 데이터 조회 에러:', error)
					CommonUtil.log(log.TARGET.APTPRICERATE, log.ACTION.FAIL, null)
					throw error
				}
			},
			// 재건축vs아파트 가격변동률 조회
			'rebuildAptPriceRate': async (params) => {
				try {
					const { data, status } = await houseTrendApi.getRebuildAptPriceRate(params)
					if (status.code === 200) {
						console.log('6 데이터')
						CommonUtil.log(log.TARGET.REBUILDAPTPRICERATE, log.ACTION.SUCCESS, null)
					} else {
						console.log('6 데이터 조회 실패')
						CommonUtil.log(log.TARGET.REBUILDAPTPRICERATE, log.ACTION.FAIL, null)
					}
					return data
				} catch (error) {
					console.error('6 데이터 조회 에러:', error)
					CommonUtil.log(log.TARGET.REBUILDAPTPRICERATE, log.ACTION.FAIL, null)
					throw error
				}
			},
		}

		/**
		 * 서울 수도권 데이터 조회
		 */
		const getSummaryData = {
			// 가격변동률 조회
			'priceRate': async (params) => {
				const { data } = await houseTrendApi.getPriceRateSummary(params)
				return data
			},
			// 가격지수 조회
			'priceIndex': async (params) => {
				const { data } = await houseTrendApi.getPriceIndexSummary(params)
				return data
			},
			// 실거래 가격변동률 조회
			'rtmsPriceRate': async (params) => {
				const { data } = await houseTrendApi.getRtmsPriceRateSummary(params)
				return data
			},
			// 실거래 가격지수 조회
			'rtmsPriceIndex': async (params) => {
				const { data } = await houseTrendApi.getRtmsPriceIndexSummary(params)
				return data
			},
			// 아파트 가격변동률 조회
			'aptPriceRate': async (params) => {
				const { data } = await houseTrendApi.getAptPriceRateSummary(params)
				return data
			},
			// 재건축vs아파트 가격변동률 조회
			'rebuildAptPriceRate': async (params) => {
				const { data } = await houseTrendApi.getRebuildAptPriceRateSummary(params)
				return data
			},
		}

		/**
		 * 통계 레이어 조회
		 * @param {*} params
		 */
		const onSearch = async (params) => {
			// isLoading.value = true
			loadingStore.isLoading = true

			// 오버레이 전체 삭제
			WGMap.getOverlays().clear()

			if (activeLayer.value) {
				searchParams = Object.assign(searchParams, params)

				// 대권역,권역,시군구 레이어소스 조회
				const newSource = getSourceByZoom()
				if (currentSource != newSource) {
					currentSource = newSource
					layer.setSource(newSource)
				}
				// levelNo 세팅
				searchParams = Object.assign(searchParams, newSource.getProperties())

				// 밸류 초기화
				values = {}

				// 데이터 조회
				const data = await getData[activeLayer.value](searchParams)

				if (menuStore.lnbActive !== 'house') {
					return
				}

				if (data?.length > 0) {
					isChecked.value = true
					// console.table(data)
					// 차트레이어(재건축vs아파트 비교 레이어)인 경우
					if (isChartLayer.value) {
						// { 시군구코드 : 값 } 형태 오브젝트 생성
						data.forEach((d) => {
							values[d.bjdCd.substr(0, 5)] = {
								'APT': d.aptChgRt,
								'RBLD': d.rebuildChgRt,
							}
						})
						createChartOverlay()
					}
					// 그밖의 레이어
					else {
						// { 시군구코드 : 값 } 형태 오브젝트 생성
						if (data[0].levelNo == '4') {
							data.forEach((d) => (values[d.bjdCd.substr(0, 5)] = d.value))
						} else if (activeLayer.value.startsWith('price') && data[0].levelNo == '3') {
							data.forEach((d) => (values[d.bjdCd.substr(0, 5)] = d.value))
						} else {
							data.forEach((d) => (values[d.bjdCd] = d.value))
						}
						// 데이터 기준으로 step 오브젝트 생성
						// const isRate = activeLayer.value.startsWith('Rate') > -1 // 절대값 사용여부
						const isRate = activeLayer.value.startsWith('Rate') // 절대값 사용 x
						step = useStep(data, { useAbs: isRate })

						// 범례
						const colorLegend = step.getLegend()
						colorStore.setRange(colorLegend)
					}
				} else if (!data || data.length === 0) {
					modalStore.showToast('info', '조회된 데이터가 없습니다.')
					colorStore.setRange([])
					isChecked.value = false
				}

				// 최신데이터 조회인 경우 통계조건에 최신년월 props 설정
				if (aptList.value.filter((apt) => apt.id === activeLayer.value).length > 0) {
					if (latestStatWk.value === '') {
						let defaultStatWk
						if (data[0]?.statWk) {
							defaultStatWk = data[0]?.statWk
						} else {
							let d = dayjs()
							defaultStatWk = `${d.isoWeekYear()}W${d.isoWeek().toString().padStart(2, '0')}`
						}
						latestStatWk.value = defaultStatWk.substring(0, 4) + '-' + defaultStatWk.substring(4)
						searchParams.statWkTmp = latestStatWk.value
					}
				} else {
					if (latestStatYm.value === '') {
						const defaultStatYm = data[0]?.statYm || dayjs().subtract(1, 'month').format('YYYYMM')
						latestStatYm.value = defaultStatYm.substring(0, 4) + '-' + defaultStatYm.substring(4)
						searchParams.statYmTmp = latestStatYm.value
					}
				}

				// 레이어 새로고침
				layer.changed()
				// isLoading.value = false
				setTimeout(() => (loadingStore.isLoading = false), 1000)

				// 통계 스토어에 저장
				const activeLayerName = [...houseList.value, ...aptList.value].filter((l) => l.id === activeLayer.value)[0].text
				statsStore.setType('house')
				statsStore.setId(activeLayer.value)
				statsStore.setName(activeLayerName)
				statsStore.setData(data)
				// 통계보드 테이블 표출을위하여 검색조건 명칭으로 저장
				var paramNames = []
				$('.stat-condition:visible li').each((i, li) => {
					var label = $(li).find('label').text()
					var value =
						$(li).find('option:selected').text() ||
						$(li).find('input').val() ||
						$(li).find('button.active').text() ||
						latestStatYm.value

					paramNames.push([label, value])
				})
				statsStore.setParamNames(paramNames)

				// 서울 수도권 정보 조회
				const summary = (await getSummaryData[activeLayer.value](searchParams)) || {
					seoul: '',
					capitalArea: '',
				}
				// console.log('서울수도권', summary)
				summaryData.value = summary
			}
		}

		/**
		 * 줌 변경 이벤트 핸들러
		 * @param {*} e
		 */
		const onZoomChange = (e) => {
			if (Number.isInteger(WGMap.getView().getZoom())) {
				const zoom = WGMap.getView().getZoom()
				// console.log('zoom changed', zoom)

				const newSource = getSourceByZoom()
				if (currentSource != newSource) {
					currentSource = newSource
					layer.setSource(newSource)
					searchParams = Object.assign(searchParams, newSource.getProperties())
					// searchParams.levelNo = newSource.get('levelNo')
					// console.log('params', searchParams)

					onSearch(searchParams)
				}
			}
		}

		/**
		 * 줌 레벨에 맞는 벡터소스 반환
		 */
		const getSourceByZoom = () => {
			// console.log('getSourceByZoom')
			const zoom = WGMap.getView().getZoom()
			// 가격 변동률/지수
			if (activeLayer.value.startsWith('price')) {
				if (zoom <= 10) {
					sourceGrtRegion.setProperties({
						levelNo: 1,
						levelNm: '대권역',
					})
					return sourceGrtRegion
				} else if (zoom === 11) {
					sourceRegion.setProperties({
						levelNo: 2,
						levelNm: '권역',
					})
					return sourceRegion
				} else {
					sourceSgg.setProperties({
						levelNo: 3,
						levelNm: '시군구',
					})
					return sourceSgg
				}
			}
			// 실거래 변동률/지수
			else if (activeLayer.value.startsWith('rtms')) {
				sourceRegion.setProperties({
					levelNo: 3,
					levelNm: '권역',
				})
				return sourceRegion
			}
			// 아파트
			else {
				sourceSgg.setProperties({
					levelNo: 4,
					levelNm: '시군구',
				})
				return sourceSgg
			}
		}

		/**
		 * pointermove 이벤트 핸들러
		 * @param {*} e
		 */
		const onPointerMove = (e) => {
			// console.log('pointer', e)
			// 마우스오버 이벤트
			if (hoverFeature !== null) {
				hoverFeature.setStyle(undefined)
				hoverFeature = null
			}

			WGMap.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
				if (layer?.get('id') === 'houseTrend' && !isChartLayer.value) {
					hoverFeature = feature
				}
				return true
			})

			// hover feature가 존재하면
			if (hoverFeature) {
				// feature 스타일변경 (현재스타일 + 선택스타일)
				const layerStyle = getStyle(hoverFeature)
				const { stroke, fill } = style.getSelectedStyle()
				const selectedStyle = [...layerStyle, stroke(), fill()]

				hoverFeature.setStyle(selectedStyle)

				// 통계보드 차트가 생성되어있다면
				if (statsStore.chart) {
					// 차트 데이터 탐색하여 하이라이팅
					const data = statsStore.chart.getOption().dataset[0].source
					const index = data
						.sort((a, b) => Number(a.value) - Number(b.value))
						.findIndex((d) => d.bjdCd == hoverFeature.get('SIG_CD') + '00000' || d.bjdCd == hoverFeature.get('BJCD'))

					statsStore.chart.dispatchAction({
						type: 'showTip',
						seriesIndex: 0,
						dataIndex: index,
					})
				}
			} else {
				if (statsStore.chart) {
					statsStore.chart.dispatchAction({
						type: 'hideTip',
					})
					statsStore.chart.dispatchAction({
						type: 'downplay',
					})
				}
			}
		}

		/**
		 * 아코디언 이벤트 핸들러
		 * @param {*} e
		 */
		const onAccordionClick = (e) => {
			$(e.target).next().slideToggle(200).prev().toggleClass('active')
		}

		/**
		 * 차트 오버레이 생성
		 */
		const createChartOverlay = () => {
			// 차트생성
			const drawChart = (element, properties, aptVal, rbldVal) => {
				var overlayChart = echarts.init(element)
				var option = {
					title: {
						text: properties.SIG_KOR_NM,
						left: 'center',
						top: 0,
						textStyle: {
							color: '#000',
						},
					},
					tooltip: {
						trigger: 'item',
						formatter: (params) => {
							return `${params.marker} ${params.seriesName}<br />
							<span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">${params.value}</span>`
						},
					},
					grid: {
						left: 10,
						top: 10,
						right: 10,
						bottom: 20,
					},
					xAxis: {
						type: 'category',
						// data: properties.NAME,
						axisLabel: {
							show: false,
						},
					},
					yAxis: {
						type: 'value',
						show: false,
						max: 0.1,
						min: -0.1,
						interval: 0.01,
					},
					series: [
						{
							name: '일반아파트',
							data: [aptVal],
							type: 'bar',
							itemStyle: {
								color: '#EE6666',
							},
						},
						{
							name: '재건축',
							data: [rbldVal],
							type: 'bar',
							itemStyle: {
								color: '#5470C6',
							},
						},
					],
				}
				overlayChart.setOption(option)
				overlayChart.on('click', (params) => {
					searchParams.bjdCd = properties.BJCD
				})
			}

			sourceSgg.getFeatures().forEach((sgg) => {
				const val = values[sgg.get('SIG_CD')]

				if (val) {
					// 오버레이 생성
					const element = document.createElement('div')
					element.id = 'chart-' + sgg.get('SIG_CD')
					element.style.width = '120px'
					element.style.height = '120px'
					const popUp = new wg.Overlay({
						id: 'overlay-' + sgg.get('SIG_CD'),
						element: element,
						positioning: 'center-center',
						className: 'chart-overlay',
						offset: [-30, 0],
					})
					popUp.setPosition(wg.extent.getCenter(sgg.getGeometry().getExtent()))
					WGMap.addOverlay(popUp)

					// 차트 드로잉
					drawChart(element, sgg.getProperties(), val.APT, val.RBLD)
				}
			})
		}

		return {
			// isLoading,
			searchParams,
			conditionComponent,
			houseList,
			aptList,
			activeLayer,
			activeTimeline,
			latestStatYm,
			latestStatWk,
			summaryData,
			menuStore,
			isHouseVisible,
			isAptVisible,
			onAccordionClick,
			onCheckedChange,
			onSearch,
			isChecked,
		}
	},
}
</script>

<style scoped>
a {
	cursor: pointer;
}
</style>
