<template>
	<div class="content show">
		<div class="head">
			<h3>토지 동향분석</h3>
		</div>
		<div class="body slim-scroll">
			<div class="accordion">
				<a v-if="isLandVisible" class="tit active" @click="onAccordionClick">토지 가격 동향</a>
				<ul v-if="isLandVisible" class="house-trend">
					<li v-for="land in landList" :key="land.id">
						<div class="custom-control">
							<input
								type="checkbox"
								:id="land.id"
								:checked="activeLayer === land.id"
								@change="onCheckedChange(land.id, $event.target.checked)"
							/>
							<!-- :checked="activeLayer === land.id" -->
							<label :for="land.id">{{ land.text }}</label>
						</div>
						<a
							v-if="land.isTimeline"
							class="btn btn-sm btn-primary open-timeseries"
							@click="() => (activeTimeline = land.id)"
							>시계열</a
						>
						<!-- @click="() => (activeTimeline = land.id)" -->
					</li>
				</ul>
			</div>
		</div>
		<Teleport to="#popupContainer">
			<LandStatsCondition
				v-if="menuStore.lnbActive === 'land' && activeLayer"
				ref="conditionComponent"
				:activeLayer="activeLayer"
				:latestStatYm="latestStatYm"
				@search="onSearch"
			/>
			<LandTimelinePopup
				v-if="activeTimeline"
				:layerId="activeTimeline"
				:searchParams="searchParams"
				@close="() => (activeTimeline = '')"
			/>
			<TrendSummary
				v-if="menuStore.lnbActive === 'land' && activeLayer"
				:summaryData="summaryData"
				:summarySeoul="summarySeoul"
			/>
		</Teleport>
	</div>
	<ColorLegend :isChecked="isChecked" />
</template>

<script>
import { ref, watch, onMounted, onUnmounted, nextTick, computed, reactive } from 'vue'
import LandStatsCondition from '@/components/popup/statsCondition/LandStatsCondition.vue'
import LandTimelinePopup from '@/components/popup/statsTimeline/LandTimelinePopup.vue'
import TrendSummary from '../TrendSummary.vue'
//import TimelinePopup from '@/components/popup/TimelinePopup.vue'
import landTrendApi from '@/api/landTrend'
import dayjs from 'dayjs'
import useStep from '@/composition/step'
import useStyle from '@/composition/style'
import { useStatsStore } from '@/stores/stats'
import { useMenuStore } from '@/stores/menu'
import { useLoadingStore } from '@/stores/loading'
import { useUserStore } from '@/stores/user'
import { layerAuth as layerAuthApi } from '@/api/settings'
import * as echarts from 'echarts'
import CommonUtil from '@/api/logTable'
import { useLog } from '@/stores/log'
import { useColorStore } from '@/stores/color'
import ColorLegend from '../ColorLegend.vue'
import { useModalStore } from '@/stores/modal'

export default {
	components: {
		LandStatsCondition,
		LandTimelinePopup,
		TrendSummary,
		ColorLegend,
	},
	setup() {
		// 활성화된 통계레이어
		let activeLayer = ref('')

		let activeTimeline = ref('')
		// 통계 레이어 (공간데이터 시군구)
		let layer = null
		// 대권역/권역/시군구 벡터소스
		let sourceGrtRegion = null
		let sourceRegion = null
		let sourceSgg = null
		let sourceUmd = null
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
		// 통계 스토어
		const statsStore = useStatsStore()
		// 메뉴 스토어
		const menuStore = useMenuStore()
		// 로딩 스토어
		const loadingStore = useLoadingStore()
		// 유저 스토어
		const userStore = useUserStore()
		// 로그 스토어
		const log = useLog()
		// 컬러 스토어
		const colorStore = useColorStore()
		// 모달 스토어
		const modalStore = useModalStore()
		let latestStatYm = ref('')

		// 마우스hover 피쳐
		let hoverFeature = null

		// 차트가 렌더링되는 레이어인지 여부 (재건축VS일반 아파트 가격변동률 현황)
		let isChartLayer = computed(() => activeLayer.value === 'a')

		const isLandVisible = ref(false)

		// 범례를 화면상에 펼치기 위함
		let isChecked = ref(false)

		// 토지 동향 리스트
		let landList = ref([
			{ id: 'landPriceRate', text: '지가변동률 현황', isTimeline: true },
			{ id: 'buildingDealIndex', text: '토지, 건축물 거래 현황', isTimeline: true },
		])

		let summarySeoul = ref(null)

		// 통계조건 컴포넌트
		const conditionComponent = ref(null)
		// 서울수도권 요약정보
		let summaryData = ref({})

		const TREND_MAP_CENTER = [14132881.28821598, 4518955.77949531]
		const TREND_MAP_ZOOM = 12

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
		 * 줌 변경 이벤트 핸들러
		 * @param {*} e
		 */
		const onZoomChange = (e) => {
			if (Number.isInteger(WGMap.getView().getZoom())) {
				const zoom = WGMap.getView().getZoom()
				console.log('zoom changed', zoom)

				const newSource = getSourceByZoom()
				if (currentSource != newSource) {
					currentSource = newSource
					layer.setSource(newSource)

					searchParams = Object.assign(searchParams, newSource.getProperties())
					// searchParams.levelNo = newSource.get('levelNo')

					onSearch(searchParams)
				}
			}
		}

		/**
		 * pointermove 이벤트 핸들러
		 * @param {*} e
		 */
		const onPointerMove = (e) => {
			// 마우스오버 이벤트
			if (hoverFeature !== null) {
				hoverFeature.setStyle(undefined)
				hoverFeature = null
			}

			WGMap.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
				if (layer?.get('id') === 'landTrend' && !isChartLayer.value) {
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
						.findIndex(
							(d) => d.bjdCd == hoverFeature.get('SIG_CD') + '00000' || d.bjdCd == hoverFeature.get('EMD_CD') + '00'
						)

					// 음수 여부
					let negative = data[index]?.value < 0
					// Null 개수
					let nullCount = data.filter((d) => d.value === null).length

					// dataIndex
					// 음수일 경우 index
					// 양수일 경우 index에 null 갯수 빼기
					let dataIndex = negative ? index : index - nullCount
					if (statsStore.activeTab === 'chart') {
						statsStore.chart.dispatchAction({
							type: 'showTip',
							seriesIndex: 0,
							dataIndex: dataIndex,
						})
					} else {
						let tableList = document.getElementById(
							hoverFeature.get('SIG_CD') ? hoverFeature.get('SIG_CD') + '00000' : hoverFeature.get('EMD_CD') + '00'
						)
						console.log(hoverFeature.get('EMD_CD') + '00')
						if (tableList) {
							const rows = document.querySelectorAll('#statsChartTableBody > tr')
							tableList.classList.add('hover') // hover 클래스 추가
							rows.forEach((row) => {
								if (row !== tableList) {
									row.classList.remove('hover')
								}
							})
						}
					}

					scrollToDataPoint(dataIndex)
				}
			} else {
				if (statsStore.chart) {
					statsStore.chart.dispatchAction({
						type: 'hideTip',
					})
					statsStore.chart.dispatchAction({
						type: 'downplay',
					})
					const rows = document.querySelectorAll('#statsChartTableBody > tr')
					rows.forEach((row) => {
						row.classList.remove('hover')
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

		onMounted(async () => {
			await getUserLayer()
			await initLayer()
		})

		onUnmounted(() => {
			layer.setVisible(false) // visible 해제시 트리깅되는 이벤트 반영
			WGMap.removeLayer(layer)
			statsStore.resetState()
		})

		const getUserLayer = async () => {
			const { data } = await layerAuthApi.getUserLayer(userStore.loginUser.id, 'LAND')
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
			let landTempArr = []
			for (let i = 0; i < authLayerArray.length; i++) {
				for (let j = 0; j < landList.value.length; j++) {
					if (authLayerArray[i] === landList.value[j].id.toLowerCase()) {
						landTempArr.push(landList.value[j])
					}
				}
			}
			landList.value = landTempArr
			if (landList.value.length > 0) {
				isLandVisible.value = true
			}
		}
		const initLayer = async () => {
			// 읍면동 벡터 소스
			sourceUmd = new wg.source.Vector({
				name: 'umd',
				format: new wg.format.GeoJSON(),
				url: () => {
					return (
						'/gis/wfs' +
						'?service=WFS&' +
						'version=1.1.0&request=GetFeature&typename=spta:GIS_TL_SCCO_EMD&' +
						'outputFormat=application/json'
					)
				},
			})
			sourceUmd.setProperties({
				levelNo: 5,
				levelNm: '읍면동',
			})
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

			// 토지동향 레이어
			layer = await new wg.layer.Vector({
				id: 'landTrend',
				source: currentSource,
				style: getStyle,
				opacity: 0.7,
				visible: false,
			})

			// 맵에 주택동향레이어 추가
			WGMap.addLayer(layer)

			// 주택동향 레이어 on/off 변경 이벤트 핸들러 등록
			layer.on('change:visible', (e) => {
				const isVisible = e.target.get(e.key)
				if (isVisible) {
					console.log('visible on')
					WGMap.on('pointermove', onPointerMove)
					WGMap.getView().on('change:resolution', onZoomChange)
				} else {
					console.log('visible off')
					WGMap.un('pointermove', onPointerMove)
					WGMap.getView().un('change:resolution', onZoomChange)
				}
			})
		}

		/**
		 * 체크박스 이벤트 핸들러
		 * @param {*} name
		 * @param {*} bool
		 */
		const onCheckedChange = async (name, bool) => {
			activeLayer.value = bool ? name : ''
			latestStatYm.value = ''
			if (bool) {
				WGMap.getView().setZoom(TREND_MAP_ZOOM)
				WGMap.getView().setCenter(TREND_MAP_CENTER)
				// 범례 펼치기
				isChecked.value = true
				// 범례 초기화
				colorStore.activeIndex = -1
				//통계조건 컴포넌트의 조회버튼 클릭 이벤트 핸들러 수행
				await nextTick() // 통계 컴포넌트가 마운트되길 기다림
				conditionComponent.value.onSearch()
				// onSearch(searchParams)
				// onZoomChange()
				//}
			} else {
				isChecked.value = false
				statsStore.resetState()
			}
			//로그테이블(체크박스 클릭시)
			if (activeLayer.value == 'landPriceRate') {
				CommonUtil.log(log.TARGET.LANDPRICERATE, log.ACTION.CLICK, null)
			}
			if (activeLayer.value == 'buildingDealIndex') {
				CommonUtil.log(log.TARGET.BUILDINGDEALINDEX, log.ACTION.CLICK, null)
			}
			layer.setVisible(bool)
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
				isChecked.value = true
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

				if (menuStore.lnbActive !== 'land') {
					return
				}

				if (data?.length > 0) {
					console.table(data)
					// 그밖의 레이어
					// { 시군구코드 : 값 } 형태 오브젝트 생성
					if (data.length == 25) {
						data.forEach((d) => (values[d.bjdCd.substr(0, 5)] = d.value))
					} else {
						data.forEach((d) => (values[d.bjdCd.substr(0, 8)] = d.value))
					}
					// 데이터 기준으로 step 오브젝트 생성
					// const isRate = activeLayer.value.startsWith('Rate') > -1 // 절대값 사용여부
					const isRate = activeLayer.value.startsWith('Rate') // 절대값 사용여부
					step = useStep(data, { useAbs: isRate })

					// 범례
					const colorLegend = step.getLegend()
					colorStore.setRange(colorLegend)

					if (latestStatYm.value === '') {
						const defaultStatYm = data[0]?.statYm || dayjs().subtract(1, 'month').format('YYYYMM')
						latestStatYm.value = defaultStatYm.substring(0, 4) + '-' + defaultStatYm.substring(4)
						searchParams.statYmTmp = latestStatYm.value
					}
				} else if (!data || data.length === 0) {
					// 데이터가 없는 경우
					modalStore.showToast('info', '조회된 데이터가 없습니다.')
					// 범례 초기화
					colorStore.setRange([])
					isChecked.value = false
				}

				// 레이어 새로고침
				layer.changed()
				// isLoading.value = false
				setTimeout(() => (loadingStore.isLoading = false), 1000)

				// 통계 스토어에 저장
				const activeLayerName = [...landList.value].filter((l) => l.id === activeLayer.value)[0].text
				statsStore.setType('land')
				statsStore.setId(activeLayer.value)
				statsStore.setName(activeLayerName)
				statsStore.setData(data)

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
				if (activeLayer.value === 'landPriceRate') {
					const summary = (await getSummaryData[activeLayer.value](searchParams)) || {
						seoul: '',
						capitalArea: '',
					}
					console.log('서울수도권', summary)
					summaryData.value = summary
				} else if (activeLayer.value === 'buildingDealIndex') {
					let summary = 0
					for (let i = 0; i < data.length; i++) {
						summary += data[i].cnt
					}
					console.log('서울수도권', summary)
					let summaryStr = Math.ceil(summary / 25).toString()
					summarySeoul.value = summaryStr
				}
			}
		}
		/**
		 * 스타일 생성
		 * @param {*} feature
		 */
		const getStyle = (feature) => {
			const { stroke, fill, title, subTitle } = style.getStyle()

			/* 	if (isChartLayer.value) {
				return [stroke(), fill(0)]
			} else { */
			let code = ''
			let name = ''
			if (feature.get('EMD_CD')) {
				code = 'EMD_CD'
				name = 'EMD_KOR_NM'
			} else if (feature.get('SIG_CD')) {
				code = 'SIG_CD'
				name = 'SIG_KOR_NM'
			}
			const _value = values[feature.get(code)] ?? '0' // 시군구명
			const _step = step?.getStep(_value) ?? 0 // 스텝
			// const _isNagative = _value < 0
			feature.set('VALUE', _value) // 값
			if (activeLayer.value === 'landPriceRate') {
				// 범례가 초기화 됐을 경우 적용되는 색상
				if (colorStore.colorRange.length === 0) {
					const isFillColor = '#fff'
					const isFillColorStyle = new wg.style.Style({
						fill: new wg.style.Fill({
							color: isFillColor,
						}),
					})
					console.log

					return [stroke(), isFillColorStyle]
				}
				return [stroke(), fill(_step), title(feature.get(name)), subTitle(Number(_value).toFixed(2))]
				// return [stroke(), fill(_step, _isNagative), title(feature.get(name)), subTitle(Number(_value).toFixed(2))]
			} else {
				// 범례가 초기화 됐을 경우  레이어에 적용되는 색상
				if (colorStore.colorRange.length === 0) {
					const isFillColor = '#fff'
					const isFillColorStyle = new wg.style.Style({
						fill: new wg.style.Fill({
							color: isFillColor,
						}),
					})
					console.log

					return [stroke(), isFillColorStyle]
				}
				// return [stroke(), fill(_step, _isNagative), title(feature.get(name)), subTitle(String(_value))]
				return [stroke(), fill(_step), title(feature.get(name)), subTitle(String(_value))]
			}

			//}
		}

		/**
		 * 줌 레벨에 맞는 벡터소스 반환
		 */
		const getSourceByZoom = () => {
			console.log('getSourceByZoom')
			const zoom = WGMap.getView().getZoom()
			// 가격 변동률/지수
			if (activeLayer.value.startsWith('land')) {
				if (zoom <= 13) {
					return sourceSgg
				} else {
					return sourceUmd
				}
			} else {
				return sourceSgg
			}
		}

		/**
		 * 통계 데이터 조회
		 */
		const getData = {
			// 지가변동률 현황 조회
			'landPriceRate': async (params) => {
				const { data, status } = await landTrendApi.getPriceRate(params)
				if (status.code == 200) {
					CommonUtil.log(log.TARGET.LANDPRICERATE, log.ACTION.SUCCESS, null)
				} else {
					CommonUtil.log(log.TARGET.LANDPRICERATE, log.ACTION.FAIL, null)
				}
				return data
			},
			// 토지, 건축물 거래 현황 조회
			'buildingDealIndex': async (params) => {
				const { data, status } = await landTrendApi.getDealIndex(params)
				if (status.code == 200) {
					CommonUtil.log(log.TARGET.BUILDINGDEALINDEX, log.ACTION.SUCCESS, null)
				} else {
					CommonUtil.log(log.TARGET.BUILDINGDEALINDEX, log.ACTION.FAIL, null)
				}
				return data
			},
		}

		/**
		 * 서울 수도권 데이터 조회
		 */
		const getSummaryData = {
			// 지가변동률 현황 조회
			'landPriceRate': async (params) => {
				const { data } = await landTrendApi.getPriceRateSummary(params)
				return data
			},
		}

		/**
		 * 통계 보드 (읍면동) 스크롤
		 * @param {*} dataIndex
		 */
		function scrollToDataPoint(dataIndex) {
			let popupDiv = document.getElementById('statBody')

			// Series 인덱스 위치 계산
			let calculatedPosition = dataIndex === -1 ? 10 : Math.abs(dataIndex - statsStore.data.length) * 27

			// 이동
			popupDiv.scrollTo({
				top: calculatedPosition,
			})
		}

		return {
			onAccordionClick,
			onCheckedChange,
			onSearch,
			searchParams,
			conditionComponent,
			activeLayer,
			landList,
			latestStatYm,
			menuStore,
			activeTimeline,
			summaryData,
			summarySeoul,
			isLandVisible,
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
