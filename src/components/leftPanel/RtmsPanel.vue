<template>
	<div class="content show">
		<div class="head">
			<h3>실거래 부동산 동향분석</h3>
		</div>
		<div class="body slim-scroll">
			<div class="accordion">
				<a v-if="isRtmsVisible" class="tit active" @click="onAccordionClick">실거래 부동산 동향</a>
				<ul v-if="isRtmsVisible" class="house-trend">
					<li v-for="rtms in rtmsList" :key="rtms.id">
						<div class="custom-control">
							<input
								type="checkbox"
								:id="rtms.id"
								:checked="activeLayer === rtms.id"
								@change="onCheckedChange(rtms.id, $event.target.checked)"
							/>
							<label :for="rtms.id">{{ rtms.text }}</label>
						</div>
						<a
							v-if="rtms.isTimeline"
							class="btn btn-sm btn-primary open-timeseries"
							@click="() => (activeTimeline = rtms.id)"
						>
							시계열
						</a>
					</li>
				</ul>
			</div>
			<div class="accordion">
				<a v-if="isLawVisible" class="tit active" @click="onAccordionClick">법원 경매 정보</a>
				<ul v-if="isLawVisible" class="house-trend">
					<li v-for="law in lawList" :key="law.id">
						<div class="custom-control">
							<input
								type="checkbox"
								:id="law.id"
								:checked="activeLayer === law.id"
								@change="onCheckedChange(law.id, $event.target.checked)"
							/>
							<label :for="law.id" v-html="law.text"></label>
						</div>
						<a
							v-if="law.isTimeline"
							class="btn btn-sm btn-primary open-timeseries"
							@click="() => (activeTimeline = law.id)"
						>
							시계열
						</a>
					</li>
				</ul>
			</div>
		</div>
		<Teleport to="#popupContainer">
			<RtmsStatsConditionVue
				v-if="menuStore.lnbActive === 'tr-rtms' && activeLayer"
				ref="conditionComponent"
				:activeLayer="activeLayer"
				:latestStatYm="latestStatYm"
				:latestStatWk="latestStatWk"
				@search="onSearch"
			/>
			<RtmsTimelinePopup
				v-if="activeTimeline"
				:layerId="activeTimeline"
				:searchParams="searchParams"
				@close="() => (activeTimeline = '')"
			/>
			<TrendSummary v-if="menuStore.lnbActive === 'tr-rtms' && activeLayer" :summarySeoul="summarySeoul" />
		</Teleport>
	</div>
	<ColorLegend :isChecked="isChecked" />
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick, computed, reactive, watch } from 'vue'
import { useStatsStore } from '@/stores/stats'
import { useMenuStore } from '@/stores/menu'
import useStep from '@/composition/step'
import useStyle from '@/composition/style'
import rtmsTrendApi from '@/api/rtmsTrend'
import RtmsStatsConditionVue from '@/components/popup/statsCondition/RtmsStatsCondition.vue'
import RtmsTimelinePopup from '../popup/statsTimeline/RtmsTimelinePopup.vue'
import TrendSummary from '../TrendSummary.vue'
import { useLoadingStore } from '@/stores/loading'
import { useUserStore } from '@/stores/user'
import { layerAuth as layerAuthApi } from '@/api/settings'
import CommonUtil from '@/api/logTable'
import { useLog } from '@/stores/log'
import { useColorStore } from '@/stores/color'
import ColorLegend from '../ColorLegend.vue'
import { useModalStore } from '@/stores/modal'
import dayjs from 'dayjs'

export default {
	components: {
		RtmsStatsConditionVue,
		RtmsTimelinePopup,
		TrendSummary,
		ColorLegend,
	},
	setup() {
		// 통계조건 컴포넌트
		const conditionComponent = ref(null)

		// 활성화된 통계레이어
		let activeLayer = ref('')
		// 활성화된 시계열레이어
		let activeTimeline = ref('')

		// 최근 통계 년월
		let latestStatYm = ref('')

		// 최근 통계 주
		let latestStatWk = ref('')

		// 통계 레이어
		let layer = null
		// 벡터소스
		let sourceSgg = null
		let sourceUmd = null
		// 레이어의 현재 벡터소스
		let currentSource = null

		// 통계검색 조건
		let searchParams = reactive({})

		// 통계 값
		let values = {}

		// 서울요약정보
		let summarySeoul = ref('')

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
		// 컬러 스토어
		const colorStore = useColorStore()
		// 모달 스토어
		const modalStore = useModalStore()
		// 마우스hover 피쳐
		let hoverFeature = null
		// 범례를 화면상에 펼치기 위함
		let isChecked = ref(false)

		const dataGbnStr = ref('')
		const isRtmsVisible = ref(false)
		const isLawVisible = ref(false)

		// 실거래 통계 레이어 목록
		let rtmsList = ref([
			{ id: 'rtmsPriceRate', text: '실거래 가격변동률 현황', isTimeline: true },
			{ id: 'rtmsTradeRate', text: '실거래 거래량변동률 현황', isTimeline: true },
			{ id: 'rtmsTypeRate', text: '실거래 유형별 거래량 현황', isTimeline: false },
		])
		// 법원 경매 통계 레이어 목록
		let lawList = ref([{ id: 'lawAuction', text: '법원 경매 현황', isTimeline: true }])

		const TREND_MAP_CENTER = [14132881.28821598, 4518955.77949531]
		const TREND_MAP_ZOOM = 12

		onMounted(async () => {
			await userStore.getLoginUser
			await getUserLayer()
			await initLayer()
		})

		onUnmounted(() => {
			layer.setVisible(false) // visible 해제시 트리깅되는 이벤트 반영
			WGMap.removeLayer(layer)
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

		const initLayer = async () => {
			console.log('initLayer')
			// 시군구 벡터 조회
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
				levelNm: 'sgg',
			})
			// 읍면동 벡터 조회
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
				levelNm: 'umd',
			})

			currentSource = getSourceByZoom()

			// 레이어 생성
			layer = await new wg.layer.Vector({
				id: 'rtmsTrend',
				source: currentSource,
				style: getStyle,
				opacity: 0.7,
				visible: false,
			})

			console.log('fill', getStyle.fill)
			// 맵에 레이어 추가
			WGMap.addLayer(layer)

			// 레이어 on/off 변경 이벤트 핸들러 등록
			layer.on('change:visible', (e) => {
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

		const getUserLayer = async () => {
			const { data } = await layerAuthApi.getUserLayer(userStore.loginUser.id, 'RTMS')

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
			let rtmsTempArr = []
			let lawTempArr = []
			for (let j = 0; j < rtmsList.value.length; j++) {
				for (let i = 0; i < authLayerArray.length; i++) {
					if (authLayerArray[i] === rtmsList.value[j].id.toLowerCase()) {
						rtmsTempArr.push(rtmsList.value[j])
					}
				}
			}
			for (let k = 0; k < lawList.value.length; k++) {
				for (let l = 0; l < authLayerArray.length; l++) {
					if (authLayerArray[l] === lawList.value[k].id.toLowerCase()) {
						lawTempArr.push(lawList.value[k])
					}
				}
			}

			rtmsList.value = rtmsTempArr
			lawList.value = lawTempArr
			if (rtmsList.value.length > 0) {
				isRtmsVisible.value = true
			}
			if (lawList.value.length > 0) {
				isLawVisible.value = true
			}
		}

		/**
		 * 체크박스 이벤트 핸들러
		 * @param {*} name
		 * @param {*} bool
		 */
		const log = useLog()
		const onCheckedChange = async (name, bool) => {
			console.log('onCheckedChange')
			activeLayer.value = bool ? name : ''
			latestStatYm.value = ''
			latestStatWk.value = ''

			console.log(activeLayer.value)
			if (bool) {
				WGMap.getView().setZoom(TREND_MAP_ZOOM)
				WGMap.getView().setCenter(TREND_MAP_CENTER)
				// 범례 펼치기
				isChecked.value = true
				// 범례 색상 color-type 초기화
				colorStore.activeIndex = -1
				// 통계조건 컴포넌트의 조회버튼 클릭 이벤트 핸들러 수행
				await nextTick() // 통계 컴포넌트가 마운트되길 기다림
				conditionComponent.value.onSearch()
			} else {
				// 범례 접기
				isChecked.value = false
				statsStore.resetState()
			}

			//로그테이블 실거래 부동산 체크박스 클릭시
			if (activeLayer.value == 'rtmsPriceRate') {
				console.log('1 선택')
				CommonUtil.log(log.TARGET.RTMSPRICERATE, log.ACTION.CLICK, null)
			}
			if (activeLayer.value == 'rtmsTradeRate') {
				console.log('2 선택')
				CommonUtil.log(log.TARGET.RTMSTRADERATE, log.ACTION.CLICK, null)
			}
			if (activeLayer.value == 'lawAuction') {
				console.log('3 선택')
				CommonUtil.log(log.TARGET.LAWACTION, log.ACTION.CLICK, null)
			}
			if (activeLayer.value == 'rtmsTypeRate') {
				console.log('4 선택')
			}
			layer.setVisible(bool)
		}

		/**
		 * 데이터 조회
		 */
		const getData = {
			'rtmsPriceRate': async (params) => {
				const { data, status } = await rtmsTrendApi.getRtmsPriceRate(params)
				if (status.code == 200) {
					CommonUtil.log(log.TARGET.RTMSPRICERATE, log.ACTION.SUCCESS, null)
				} else {
					CommonUtil.log(log.TARGET.RTMSPRICERATE, log.ACTION.FAIL, null)
				}
				return data
			},
			'rtmsTradeRate': async (params) => {
				const { data, status } = await rtmsTrendApi.getRtmsTradeRate(params)
				if (status.code == 200) {
					CommonUtil.log(log.TARGET.RTMSTRADERATE, log.ACTION.SUCCESS, null)
				} else {
					CommonUtil.log(log.TARGET.RTMSTRADERATE, log.ACTION.FAIL, null)
				}
				return data
			},
			'rtmsTypeRate': async (params) => {
				const { data, status } = await rtmsTrendApi.getRtmsTypeRate(params)

				console.log('데이터 조회 params', params)
				return data
			},
			'lawAuction': async (params) => {
				const { data, status } = await rtmsTrendApi.getRtmsLawAuction(params)
				if (status.code == 200) {
					CommonUtil.log(log.TARGET.LAWACTION, log.ACTION.SUCCESS, null)
				} else {
					CommonUtil.log(log.TARGET.LAWACTION, log.ACTION.FAIL, null)
				}
				return data
			},
		}

		/**
		 * 통계 보드 (읍면동) 스크롤
		 * @param {*} dataIndex
		 */
		function scrollToDataPoint(dataIndex, negative, nullCount) {
			let popupDiv = document.getElementById('statBody')

			console.log('dataIndex', dataIndex)
			// Series 인덱스 위치 계산
			let calculatedPosition =
				statsStore.activeTab === 'chart'
					? dataIndex === -10
						? 10
						: Math.abs(dataIndex - statsStore.data.length) * 27
					: negative
					? Math.abs(dataIndex - statsStore.data.length) * 27
					: Math.abs(dataIndex + nullCount - statsStore.data.length) * 27

			// 이동
			popupDiv.scrollTo({
				top: calculatedPosition,
			})
		}

		// /**
		//  * 통계 레이어 조회
		//  * @param {*} params
		//  */
		// const onSearch = async (params) => {
		// 	loadingStore.isLoading = true
		// 	dataGbnStr.value = params.dataGbn
		// 	console.log('실거래 패널 서치', params)
		// 	WGMap.getOverlays().clear()

		// 	if (activeLayer.value) {
		// 		searchParams = Object.assign(searchParams, params)
		// 		searchParams.statYm = searchParams.statYmTmp?.replace('-', '')

		// 		const newSource = getSourceByZoom()
		// 		if (currentSource != newSource) {
		// 			currentSource = newSource
		// 			layer.setSource(newSource)
		// 		}
		// 		// levelNm 세팅
		// 		searchParams = Object.assign(searchParams, newSource.getProperties())

		// 		console.log('조건', searchParams)
		// 		const data = await getData[activeLayer.value](searchParams)
		// 		console.log('결과', data)

		// 		setTimeout(() => (loadingStore.isLoading = false), 1000)

		// 		// 밸류 초기화
		// 		values = {}

		// 		if (data?.length > 0) {
		// 			console.table(data)
		// 			// { 시군구코드 : 값 } 형태 오브젝트 생성
		// 			if (data.length == 25) {
		// 				data.forEach((d) => (values[d.bjdCd.substr(0, 5)] = d.value))
		// 			} else {
		// 				data.forEach((d) => (values[d.bjdCd.substr(0, 8)] = d.value))
		// 			}
		// 			// 데이터 기준으로 step 오브젝트 생성
		// 			// const isRate = activeLayer.value.startsWith('Rate') > -1 // 절대값 사용여부
		// 			const isRate = activeLayer.value.startsWith('Rate') // 절대값 사용여부
		// 			step = useStep(data, { useAbs: isRate })

		// 			// 범례
		// 			const colorLegend = step.getLegend()
		// 			colorStore.setRange(colorLegend)
		// 		}

		// 		if (latestStatYm.value === '') {
		// 			const defaultStatYm = data[0]?.statYm || dayjs().subtract(1, 'month').format('YYYYMM')
		// 			latestStatYm.value = defaultStatYm.substring(0, 4) + '-' + defaultStatYm.substring(4)
		// 			searchParams.statYmTmp = latestStatYm.value
		// 		}

		// 		// 레이어 새로고침
		// 		layer.changed()

		// 		// 통계 스토어에 저장
		// 		const activeLayerName = [...rtmsList.value, ...lawList.value].filter((l) => l.id === activeLayer.value)[0].text
		// 		statsStore.setType('rtms')
		// 		statsStore.setId(activeLayer.value)
		// 		statsStore.setName(activeLayerName)
		// 		statsStore.setData(data)

		// 		// 통계보드 테이블 표출을위하여 검색조건 명칭으로 저장
		// 		var paramNames = []
		// 		$('.stat-condition:visible li').each((i, li) => {
		// 			var label = $(li).find('label').text()
		// 			var value =
		// 				$(li).find('option:selected').text() ||
		// 				$(li).find('input').val() ||
		// 				$(li).find('button.active').text() ||
		// 				latestStatYm.value

		// 			paramNames.push([label, value])
		// 		})
		// 		statsStore.setParamNames(paramNames)

		// 		const sum = data.map((d) => d.value).reduce((acc, cur) => acc + cur)
		// 		const average = sum / data.length
		// 		summarySeoul.value = average.toFixed(2)
		// 	}
		// }

		/**
		 * 통계 레이어 조회
		 * @param {*} params
		 */
		const onSearch = async (params) => {
			loadingStore.isLoading = true
			dataGbnStr.value = params.dataGbn

			WGMap.getOverlays().clear()

			if (activeLayer.value) {
				isChecked.value = true
				searchParams = Object.assign(searchParams, params)
				console.log('searchParams', searchParams)
				searchParams.statYm = searchParams.statYmTmp?.replace('-', '')
				searchParams.statWk = searchParams.statWkTmp?.replace('-', '')

				const newSource = getSourceByZoom()
				if (currentSource != newSource) {
					currentSource = newSource
					layer.setSource(newSource)
				}
				// levelNm 세팅
				searchParams = Object.assign(searchParams, newSource.getProperties())

				const data = await getData[activeLayer.value](searchParams)
				console.log('activeLayer', activeLayer.value)
				console.log('data', data)
				setTimeout(() => (loadingStore.isLoading = false), 1000)

				// if (data.statType)

				// 밸류 초기화
				values = {}

				if (menuStore.lnbActive !== 'tr-rtms') {
					return
				}

				if (data?.length > 0) {
					console.table(data)

					// { 시군구코드 : 값 } 형태 오브젝트 생성
					if (data.length == 25) {
						data.forEach((d) => (values[d.bjdCd.substr(0, 5)] = d.value))
					} else {
						data.forEach((d) => (values[d.bjdCd.substr(0, 8)] = d.value))
					}

					// 데이터 기준으로 step 오브젝트 생성
					const isRate = activeLayer.value.startsWith('Rate') // 절대값 사용여부
					step = useStep(data, { useAbs: isRate })

					// 범례
					const colorLegend = step.getLegend()
					console.log('colorLegend', colorLegend)
					colorStore.setRange(colorLegend)
				} else {
					modalStore.showToast('info', '조회된 데이터가 없습니다.')
					// 범례 초기화
					colorStore.setRange([])
					isChecked.value = false
				}

				// 최신데이터 조회인 경우 통계조건에 최신년월 props 설정
				console.log('data', params)

				if (latestStatYm.value === '') {
					const defaultStatYm = data[0]?.statYm || dayjs().subtract(1, 'month').format('YYYYMM')
					latestStatYm.value = defaultStatYm.substring(0, 4) + '-' + defaultStatYm.substring(4)
					searchParams.statYmTmp = latestStatYm.value
				}
				if (latestStatWk.value === '') {
					let defaultStatWk
					if (data[0]?.statWk) {
						defaultStatWk = data[0]?.statWk
						console.log('날짜', defaultStatWk)
					} else {
						let dayInMonth = dayjs(data[0]?.statYm).daysInMonth() // 최신데이터 년월에 마지막 날짜 구하기
						let d = dayjs(data[0]?.statYm + dayInMonth) // 최신데이터 날짜
						defaultStatWk = `${d.isoWeekYear()}W${d.isoWeek().toString().padStart(2, '0')}` // 최신년월 마지막 주
					}
					latestStatWk.value = defaultStatWk.substring(0, 4) + '-' + defaultStatWk.substring(4)
					searchParams.statWkTmp = latestStatWk.value
				}

				// 레이어 새로고침
				layer.changed()

				if (dataGbnStr.value === 'plcy' && userStore.loginUser.ogdpCd !== '11000') {
					if (data.map((item) => item.bjdCd.substr(0, 5)) !== userStore.loginUser.ogdpCd) {
						const activeLayerName = [...rtmsList.value, ...lawList.value].filter((l) => l.id === activeLayer.value)[0]
							.text
						statsStore.setType('rtms')
						statsStore.setName(activeLayerName)

						const filteredData = data.filter((item) => item.bjdCd.substr(0, 5) === userStore.loginUser.ogdpCd)
						console.log('fillterData', filteredData)
						statsStore.setData(filteredData)
					}
				} else {
					// 통계 스토어에 저장
					const activeLayerName = [...rtmsList.value, ...lawList.value].filter((l) => l.id === activeLayer.value)[0]
						.text
					statsStore.setType('rtms')
					statsStore.setId(activeLayer.value)
					statsStore.setName(activeLayerName)
					statsStore.setData(data)
				}
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

				// Check if data is not empty before using reduce
				const sum = data.length > 0 ? data.map((d) => d.value).reduce((acc, cur) => acc + cur) : 0
				const average = data.length > 0 ? sum / data.length : 0
				summarySeoul.value = average.toFixed(2)
			}
		}

		/**
		 * 스타일 생성
		 * @param {*} feature
		 */
		const getStyle = (feature) => {
			let code = ''
			let name = ''
			if (feature.get('EMD_CD')) {
				code = 'EMD_CD'
				name = 'EMD_KOR_NM'
			} else if (feature.get('SIG_CD')) {
				code = 'SIG_CD'
				name = 'SIG_KOR_NM'
			}

			if (dataGbnStr.value === 'plcy' && userStore.loginUser.ogdpCd !== '11000') {
				if (feature.get(code).substr(0, 5) !== userStore.loginUser.ogdpCd) {
					return
				}
			}

			const { stroke, fill, title, subTitle } = style.getStyle()

			// 범례가 초기화 됐을 경우 적용되는 색상
			if (colorStore.colorRange.length === 0) {
				const isFillColor = '#fff'
				const isFillColorStyle = new wg.style.Style({
					fill: new wg.style.Fill({
						color: isFillColor,
					}),
				})
				return [stroke(), isFillColorStyle]
			}

			const _value = values[feature.get(code)] ?? '0' // 시군구명
			const _step = step?.getStep(_value) ?? 0 // 스텝
			const _isNagative = _value < 0
			feature.set('VALUE', _value) // 값
			return [
				stroke(),
				fill(_step, _isNagative),
				title(feature.get(name)),
				activeLayer.value === 'rtmsTypeRate' ? subTitle(String(_value)) : subTitle(Number(_value).toFixed(2)),
			]
		}

		/**
		 * 줌 레벨에 맞는 벡터소스 반환
		 */
		const getSourceByZoom = () => {
			console.log('getSourceByZoom')
			const zoom = WGMap.getView().getZoom()
			// 실거래 부동산 동향
			if (activeLayer.value.startsWith('rtms')) {
				if (zoom >= 14) {
					return sourceUmd
				} else {
					return sourceSgg
				}
			}
			// 법원 경매 정보
			else {
				return sourceSgg
			}
		}

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
					colorStore.setRange([])
					onSearch(searchParams)
				}
				console.log('currentSource', currentSource.get('levelNm'))
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

			let currentHoveredFeatureId = null // 현재 hover된 feature의 ID를 추적하기 위한 변수

			WGMap.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
				if (layer?.get('id') === 'rtmsTrend') {
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
					console.log(
						'data.sort >> ',
						data.sort((a, b) => Number(a.value) - Number(b.value))
					)

					console.log('data[index] : ', data[index]?.value)

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

					// 통계보드 스크롤 이동
					scrollToDataPoint(dataIndex, negative, nullCount)
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
				const rows = document.querySelectorAll('#statsChartTableBody > tr')
				rows.forEach((row) => {
					row.classList.remove('hover')
				})
			}
		}

		/**
		 * 아코디언 이벤트 핸들러
		 * @param {*} e
		 */
		const onAccordionClick = (e) => {
			$(e.target).next().slideToggle(200).prev().toggleClass('active')
		}
		return {
			conditionComponent,
			searchParams,
			menuStore,
			activeLayer,
			activeTimeline,
			latestStatYm,
			latestStatWk,
			rtmsList,
			lawList,
			summarySeoul,
			onAccordionClick,
			onCheckedChange,
			onSearch,
			isRtmsVisible,
			isLawVisible,
			colorStore,
			isChecked,
		}
	},
}
</script>

<style lang="scss" scoped></style>
