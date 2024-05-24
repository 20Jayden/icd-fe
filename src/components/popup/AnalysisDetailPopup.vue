<template>
	<div
		id="areaAnalysisPopup"
		class="layer-popup"
		:class="{ 'show': toolStore.activeName === 'areaAnalysis' }"
		style="width: 960px; top: 14%; left: 45%; z-index: 5"
	>
		<div class="head">
			<div class="tit">허가구역 분석</div>
			<a class="btn-close" @click="onPopupCloseClick"><span>팝업창 닫기</span></a>
		</div>
		<div class="body">
			<div class="tab">
				<ul>
					<li class="active">
						<span id="statTab">서울특별시 {{ sggInfo }} {{ umdInfo }}</span>
						<div class="tab-pane" style="margin-top: 10px">
							<li style="display: flex">
								<label class="tit" style="margin-right: 20px; margin-top: 3px">기준 월</label>
								<div class="form-group date">
									<input type="month" class="form-control" v-model="areaStore.analysisPopStandPreMonth" />
									<div class="hyphen">~</div>
									<input type="month" class="form-control" v-model="areaStore.analysisPopStandMonth" />
								</div>
								<span>
									<li style="display: flex; margin-left: 230px; justify-content: right; align-items: center">
										<label style="margin-right: 20px; margin-top: 10px">데이터 정보</label>
										<div class="btn-group">
											<button
												id="kabOption"
												type="button"
												class="btn btn-dark"
												:class="{ active: isKab }"
												@click="onOptionChangeClick($event)"
											>
												실거래공개
											</button>
											<button
												id="rtmsOption"
												type="button"
												class="btn btn-dark"
												:class="{ active: isRtms }"
												v-if="menuStore.rtmsTab === 'RTMS' || userStore.loginUser.auth === 'A'"
												@click="onOptionChangeClick($event)"
											>
												자치구RTMS
											</button>
										</div>
									</li>
								</span>
							</li>
							<div
								class="btn-group"
								style="margin-top: 10px; display: flex"
							>
								<div style="display: flex;">
									<li style="display: flex">
										<label class="tit">허가구역 제외</label>
										<div class="form-group" style="margin-top: 1px">
											<div class="custom-control custom-switch ml-15 mb-5">
												<input
													type="checkbox"
													class="custom-control-input"
													id="switchArea"
													v-model="isAreaCheck"
													@click="areaCheck"
												/>
												<label class="label custom-control-label" for="switchArea"></label>
											</div>
										</div>
									</li>
									<li style="display: flex; margin-left: 10px">
										<label class="tit">허가구역만</label>
										<div class="form-group" style="margin-top: 1px">
											<div class="custom-control custom-switch ml-15 mb-5">
												<input
													type="checkbox"
													class="custom-control-input"
													id="switchAreaOnly"
													v-model="isOnlyAreaCheck"
													@click="onlyAreaCheck"
												/>
												<label class="label custom-control-label" for="switchAreaOnly"></label>
											</div>
										</div>
									</li>
								</div>
								<div class="btn-items">
									<button
										id="priceChart"
										type="button"
										class="btn btn-dark"
										:class="{ active: priceTab }"
										@click="onTypeClick($event)"
									>
										평균가격
									</button>
									<button
										id="areaChart"
										type="button"
										class="btn btn-dark"
										:class="{ active: areaTab }"
										@click="onTypeClick($event)"
									>
										1㎡가격
									</button>
									<button
										id="volumeChart"
										type="button"
										class="btn btn-dark"
										style="border-top-right-radius: 5px; border-bottom-right-radius: 5px"
										:class="{ active: volumeTab }"
										@click="onTypeClick($event)"
									>
										거래량
									</button>
								</div>
								<div>
									<span style="margin-left: 135px;">
										{{ areaStore.analysisPopStandPreMonth }} ~ {{ areaStore.analysisPopStandMonth }}({{
											diffInMonths
										}}개월)
									</span>
								</div>
							</div>
							<div id="chartSpace1" style="width: 100%; height: 200px"></div>
							<div
								class="btn-group"
								style="margin-bottom: 10px; margin-top: 5px; justify-content: center; align-items: center"
							>
								<button
									id="priceChart"
									type="button"
									class="btn btn-dark"
									:class="{ active: isPriceChart }"
									@click="onBottomListClick($event)"
								>
									통계 수치
								</button>
								<button
									id="areaChart"
									type="button"
									class="btn btn-dark"
									:class="{ active: isAreaChart }"
									@click="onBottomListClick($event)"
								>
									필지리스트
								</button>
								<button
									id="tradeChart"
									type="button"
									class="btn btn-dark"
									:class="{ active: isTradeChart }"
									@click="onBottomListClick($event, 'tradeChart')"
								>
									거래리스트
								</button>
							</div>
							<ul>
								<Spinner
									v-if="isLoading"
									style="align-items: center; width: 100px; height: 100px; margin-top: 100px; margin-bottom: 100px"
								/>
								<template v-if="!isLoading">
									<li v-show="isPriceChart">
										<div class="tit">통계 수치</div>
										<div class="average-price mb-20">
											<table class="table data-table color-blue mb-0">
												<caption>
													분석결과 정보이며 년월, 평균가격, 비고 정보를 제공합니다.
												</caption>
												<colgroup>
													<col style="width: 100px" />
													<col style="width: 300px" />
													<col style="width: 100px" />
												</colgroup>
												<thead>
													<tr>
														<th scope="col">년월</th>
														<th scope="col">{{ subTextContent }}</th>
														<th scope="col">비고</th>
													</tr>
												</thead>
												<tbody v-if="statDataArray.length > 0">
													<tr v-for="(monthData, index) in dataArray" :key="index">
														<th scope="row">{{ monthListArray[diffInMonths - index - 1] }}</th>
														<td>{{ formatNumber(monthData) }}</td>
														<td></td>
													</tr>
													<!-- <tr>
														<th scope="row">{{ monthListArray[9] }}</th>
														<td v-if="statDataArray.length > 0">{{ formatNumber(statDataArray[1].m1) }}</td>
														<td></td>
													</tr> -->
												</tbody>
											</table>
										</div>
										<div class="action-btn-group mt-20">
											<div class="right" style="margin-top: -13px">
												<button type="button" class="btn btn-primary" @click="onStatisticsExcel()">
													통계수치 다운로드
												</button>
											</div>
										</div>
									</li>
									<li v-show="isAreaChart">
										<div class="tit">필지리스트</div>
										<div class="land-list">
											<table class="table data-table color-blue mb-0">
												<caption>
													필지리스트 정보이며 PNU, 주소, 지목 정보를 제공합니다.
												</caption>
												<colgroup>
													<col style="width: 100px" />
													<col style="width: 300px" />
													<col style="width: 100px" />
												</colgroup>
												<thead>
													<tr>
														<th scope="col">PNU</th>
														<th scope="col">주소</th>
														<th scope="col">지목</th>
														<th scope="col">면적</th>
														<th scope="col">소유자구분코드</th>
													</tr>
												</thead>
												<tbody>
													<tr v-for="area in areaList" :key="area.pnu" @click="onAreaTrClick($event, area.pnu)">
														<th scope="row">{{ area.pnu }}</th>
														<td class="text-left">
															서울특별시 {{ area.sggNm + ' ' + area.emdNm + ' ' + area.bobn + '-' + area.bubn }}
														</td>
														<td>{{ area.jimokNm }}</td>
														<td>{{ area.landArea }}</td>
														<td class="gbnCol">{{ area.ownGbnNm }}</td>
													</tr>
												</tbody>
											</table>
										</div>
										<div class="action-btn-group mt-20" style="margin-bottom: 8px">
											<div class="right">
												<button type="button" class="btn btn-primary" @click="onPnuExcelDownClick()">
													필지조서 다운로드
												</button>
											</div>
										</div>
									</li>
									<Pagination
										:currPage="pagination.page"
										:countPerPage="pagination.size"
										:unitPage="pagination.unitPage"
										:totalCount="pagination.totalCount"
										v-show="isAreaChart"
										@movePage="getPnuList"
									/>
									<li v-show="isTradeChart">
										<div class="tit">거래리스트</div>
										<div style="overflow: auto; height: 312px">
											<table class="table data-table color-blue mb-0">
												<!-- <colgroup>
												<col style="width: 100px" />
												<col style="width: 300px" />
												<col style="width: 100px" />
												<col style="width: 100px" />
												<col style="width: 100px" />
											</colgroup> -->
												<thead v-if="isKab">
													<tr>
														<th scope="col">자치구</th>
														<th scope="col">법정동</th>
														<th scope="col">지번</th>
														<th scope="col">건물명</th>
														<th scope="col">준공년도</th>
														<th scope="col">면적별</th>
														<th scope="col">계약일자</th>
														<th scope="col">거래금액</th>
														<th scope="col">상세물건구분명</th>
														<th scope="col">건물주용도명</th>
														<th scope="col">중개구분</th>
													</tr>
												</thead>
												<thead v-if="isRtms">
													<tr>
														<th scope="col">자치구</th>
														<th scope="col">법정동</th>
														<th scope="col">지번</th>
														<th scope="col">건물명</th>
														<th scope="col">준공년도</th>
														<th scope="col">면적별</th>
														<th scope="col">신고일자</th>
														<th scope="col">거래금액</th>
														<th scope="col">물건구분명</th>
														<th scope="col">건물용도명</th>
														<th scope="col">용도지역명</th>
													</tr>
												</thead>
												<tbody v-if="isKab">
													<tr v-for="(trade, index) in tradeArray" :key="index">
														<th scope="row">{{ trade.sggNm }}</th>
														<th scope="row">{{ trade.emdNm }}</th>
														<th scope="row">{{ trade.bobn }} - {{ trade.bubn }}</th>
														<th scope="row">{{ trade.etcAddrBldgNm }}</th>
														<th scope="row">{{ trade.buildYear }}</th>
														<th scope="row">{{ trade.bldgArea }}</th>
														<th scope="row">{{ trade.dealYmd }}</th>
														<th scope="row">{{ trade.objAmt.toLocaleString() }}</th>
														<th scope="row">{{ trade.objFinNm }}</th>
														<th scope="row">{{ trade.bldgMuseNm }}</th>
														<th scope="row">{{ trade.reqGbn }}</th>
													</tr>
												</tbody>
												<tbody v-else-if="isRtms">
													<tr v-for="(trade, index) in tradeArray" :key="index">
														<th scope="row">{{ trade.sggNm }}</th>
														<th scope="row">{{ trade.emdNm }}</th>
														<th scope="row">{{ trade.bobn }} - {{ trade.bubn }}</th>
														<th scope="row">{{ trade.etcAddrBldgNm }}</th>
														<th scope="row">{{ trade.usePermYmd }}</th>
														<th scope="row">{{ trade.bldgArea }}</th>
														<th scope="row">{{ trade.accYmd }}</th>
														<th scope="row">{{ trade.objAmt.toLocaleString() }}</th>
														<th scope="row">{{ trade.objNm }}</th>
														<th scope="row">{{ trade.bldgUseNm }}</th>
														<th scope="row">{{ trade.useRegnNm }}</th>
													</tr>
												</tbody>
											</table>
										</div>
										<div class="action-btn-group mt-20" style="margin-bottom: 8px">
											<div class="right">
												<button type="button" class="btn btn-primary" @click="getTradeExcel()">
													거래리스트 다운로드
												</button>
											</div>
										</div>
									</li>
									<Pagination
										:currPage="pagination.page"
										:countPerPage="pagination.size"
										:unitPage="pagination.unitPage"
										:totalCount="pagination.totalCount"
										v-show="isTradeChart"
										@movePage="getTradeInfo"
									/>
								</template>
							</ul>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
// basic
import { ref, onMounted, watch, reactive } from 'vue'
// dayjs
import dayjs from 'dayjs'
// store
import { useAreaStore } from '@/stores/area'
import { useToolStore } from '@/stores/tool'
import { useUserStore } from '@/stores/user'
import { useLocationStore } from '@/stores/location'
import { useModalStore } from '@/stores/modal'
import { useMenuStore } from '@/stores/menu'
import areaApi from '@/api/area'
import * as echarts from 'echarts'
import Spinner from '@/components/Spinner.vue'
import axios from 'axios'
import Pagination from '../Pagination.vue'
import { monitorBottom as BottomListApi } from '@/api/monitor'
import CommonUtil from '@/api/logTable'
import { useLog } from '@/stores/log'
import wgTools from '@/composition/wgTools'
import useStyle from '@/composition/style'

export default {
	components: {
		Spinner,
		Pagination,
	},
	emits: ['close-popup'],
	props: {
		targetPnuArray: {
			type: Array,
			default: () => [],
		},
		activeName: {
			type: String,
			default: '',
		},
		polygonCoordi: {
			type: String,
			default: '',
		},
	},
	setup(props, { emit }) {
		onMounted(async () => {
			//fixDate()
			areaStore.setAreaStatType('price')
			locationInfo()
			await drawInitChart()
			$('#areaAnalysisPopup').draggable({
				containment: 'body',
				scroll: false,
				handle: '.head',
			})

			for (let k = 1; k < 12; k++) {
				let inputMonth = dayjs(areaStore.analysisPopStandMonth).subtract(k, 'month').format('YYYY-MM')
				monthListArray.value.push(inputMonth)
			}
		})

		const isPopupShow = ref(true)
		// store
		const areaStore = useAreaStore()
		const toolStore = useToolStore()
		const userStore = useUserStore()
		const log = useLog()
		const locationStore = useLocationStore()
		const modalStore = useModalStore()
		const menuStore = useMenuStore()
		const standMonth = ref(dayjs().format('YYYY-MM'))
		const standMonthText = ref(dayjs(areaStore.analysisPopStandMonth).format('YYYY-MM'))
		const prevMonthText = ref(dayjs(areaStore.analysisPopStandMonth).subtract(11, 'month').format('YYYY-MM'))
		const monthListArray = ref([])
		const isPriceChart = ref(true)
		const isAreaChart = ref(false)
		const isTradeChart = ref(false)
		const priceTab = ref(true)
		const areaTab = ref(false)
		const volumeTab = ref(false)
		const statDataArray = ref([])
		const tradeArray = ref([])
		const subTextContent = ref('')
		const isKab = ref(true)
		const isRtms = ref(false)
		const isAreaCheck = ref(false)
		const isOnlyAreaCheck = ref(false)
		const targetPnu = ref([])
		const isAreaTargetPnu = ref([]) // 허가구역 제외를 위한 pnu List
		const noDupliPnuList = ref([])
		const areaList = ref([])
		const areaArr = ref([])
		const resultArr = ref([])
		const startDate = ref('')
		const endDate = ref('')
		const sggInfo = ref('')
		const umdInfo = ref('')
		const monthDataArray = ref([])
		const diffInMonths = ref(0)
		const dataArray = ref([])
		const dataList = ref([])
		const resultStatus = ref({})
		const dataOptionName = ref('')
		const limitMonthly = 36
		const limitMonthlyStr = "3년"
		const nowYearMonth = dayjs().format('YYYY-MM')
		const wgStyle = useStyle()
		let chart = null

		let isLoading = ref(false)
		let loadingText = {
			title: '잠시만 기다려주세요.',
			subTitle: '통계 자료를 불러오고 있습니다.',
		}
		// 페이징 정보
		let pagination = reactive({
			page: 1,
			size: 10,
			unitPage: 5,
			totalCount: 0,
		})
		const removePermArea = ref([])

		const getParamString = (params) => {
			return Object.keys(params)
				.map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
				.join('&')
		}
		watch(
			() => areaStore.analysisPopStandMonth,
			() => {

				const standMonth = areaStore.analysisPopStandMonth
				const standPreMonth = areaStore.analysisPopStandPreMonth

				if (areaStore.analysisPopStandMonth > nowYearMonth) {
					modalStore.showAlert('종료일은 현재 달을 초과할 수 없습니다.')
					areaStore.setAnalysisPopStandMonth(nowYearMonth)
				}
				if (areaStore.analysisPopStandPreMonth > areaStore.analysisPopStandMonth) {
					modalStore.showAlert('시작일은 종료일을 초과할 수 없습니다.')
					areaStore.setAnalysisPopStandMonth(
						dayjs(areaStore.analysisPopStandPreMonth)
							.add(diffInMonths.value - 1, 'month')
							.format('YYYY-MM')
					)
				}

				const endDate = new Date(standMonth)
				const startDate = new Date(standPreMonth)

				const before36YearMonthFromPre = dayjs(areaStore.analysisPopStandPreMonth).add(limitMonthly, 'month').format('YYYY-MM')
				const before36YearMonth = dayjs(areaStore.analysisPopStandMonth).subtract(limitMonthly - 1, 'month').format('YYYY-MM')

				diffInMonths.value =
					endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear()) + 1

				if (diffInMonths.value > limitMonthly) {
					modalStore.showAlert(`검색 가능 최대 기간은 ${limitMonthlyStr}입니다.`)
					if (before36YearMonthFromPre < nowYearMonth) {
						areaStore.setAnalysisPopStandPreMonth(before36YearMonth)
					} else {
						areaStore.setAnalysisPopStandMonth(nowYearMonth)
					}
					return
				}
				monthListArray.value = []
				for (let k = 0; k < diffInMonths.value; k++) {
					let inputMonth = dayjs(standMonth).subtract(k, 'month').format('YYYY-MM')
					monthListArray.value.push(inputMonth)
				}

				drawInitChart()
				if (isTradeChart.value == true) {
					getTradeInfo()
				}
			}
		)

		watch(
			() => areaStore.analysisPopStandPreMonth,
			() => {

				const standMonth = areaStore.analysisPopStandMonth
				const standPreMonth = areaStore.analysisPopStandPreMonth

				if (areaStore.analysisPopStandPreMonth > areaStore.analysisPopStandMonth) {
					modalStore.showAlert('시작일은 종료일을 초과할 수 없습니다.')
					areaStore.setAnalysisPopStandPreMonth(
						dayjs(areaStore.analysisPopStandMonth)
							.subtract(diffInMonths.value - 1, 'month')
							.format('YYYY-MM')
					)
				}

				const endDate = new Date(standMonth)
				const startDate = new Date(standPreMonth)

				diffInMonths.value =
					endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear()) + 1

				if (diffInMonths.value > limitMonthly) {
					modalStore.showAlert(`검색 가능 최대 기간은 ${limitMonthlyStr}입니다.`)
					areaStore.setAnalysisPopStandMonth(dayjs(standPreMonth).add(limitMonthly - 1, 'month').format('YYYY-MM'))
					return
				}

				monthListArray.value = []
				for (let k = 0; k < diffInMonths.value; k++) {
					let inputMonth = dayjs(standMonth).subtract(k, 'month').format('YYYY-MM')
					monthListArray.value.push(inputMonth)
				}

				drawInitChart()
				if (isTradeChart.value == true) {
					getTradeInfo()
				}
			}
		)
		watch(
			() => isAreaCheck.value,
			async (isAreaCheck) => {
				// 허가구역 제외 시각화 처리
				isLoading.value = true
				areaStore.setIsAreaCheck(isAreaCheck)
				if(isAreaCheck)	{
					areaStore.setIsOnlyAreaCheck(false)
					isOnlyAreaCheck.value = false
				}

				let source = null

				if(isAreaCheck && !areaStore.isOnlyAreaCheck)
					source = await getFeaturesAndPnuByPolygon('exArea')
				else if(!isAreaCheck && !areaStore.isOnlyAreaCheck)
					source = await getFeaturesAndPnuByPolygon('all')

				if(source) {
					drawStatTargetRegion(source)

					// 필지리스트 로딩
					if (isAreaChart.value == true) {
						await getPnuList()
					}
					// 거래리스트 로딩
					if (isTradeChart.value == true) {
						await getTradeInfo()
					}

					// 통계 차트 다시 그리기
					drawInitChart()
				}

				isLoading.value = false
			}
		)

		watch(
			() => isOnlyAreaCheck.value,
			async (isOnlyAreaCheck) => {
				// 허가구역만 시각화 처리
				isLoading.value = true
				if(isOnlyAreaCheck)	{
					areaStore.setIsAreaCheck(false)
					isAreaCheck.value = false
				}
				areaStore.setIsOnlyAreaCheck(isOnlyAreaCheck)

				let source = null

				if(!areaStore.isAreaCheck && isOnlyAreaCheck)
					source = await getFeaturesAndPnuByPolygon('onlyArea')
				else if(!areaStore.isAreaCheck && !isOnlyAreaCheck)
					source = await getFeaturesAndPnuByPolygon('all')

				if(source) {
					drawStatTargetRegion(source)

					// 필지리스트 로딩
					if (isAreaChart.value == true) {
						await getPnuList()
					}
					// 거래리스트 로딩
					if (isTradeChart.value == true) {
						await getTradeInfo()
					}

					// 통계 차트 다시 그리기
					drawInitChart()
				}

				isLoading.value = false
			}
		)

		watch(
			() => areaStore.areaStatType,
			() => {
				drawInitChart()
			}
		)

		watch(
			() => areaStore.areaOption,
			() => {
				drawInitChart()
			}
		)

		const getFeatureNormRegion = async () => {

			try {
				let coordinateStr = props.polygonCoordi
				const geometryParam = `intersects(SHAPE,POLYGON((${coordinateStr})))`

				const params = {
					service: 'WFS',
					version: '1.0.0',
					request: 'GetFeature',
					typeName: 'spta:GIS_LP_PA_CBND',
					outputformat: 'application/json',
					format_options: 'CHARSET:EUC-KR',
					cql_filter: geometryParam,
				}

				// 영역 대상 Feature Object Info
				const geometryObjectInfo = await axios.get('/gis/wfs?' + getParamString(params))

				if(geometryObjectInfo != undefined && geometryObjectInfo != null)
					return geometryObjectInfo

			} catch (e) {
				console.log(e.getMessage())
			}

			return null
		}

		const getFeatureRestrictRegion = async () => {

			try {
				let coordinateStr = props.polygonCoordi
				const geometryParamArea = `intersects(GEOMETRY,POLYGON((${coordinateStr})))`

				const paramsForArea = {
					service: 'WFS',
					version: '1.0.0',
					request: 'GetFeature',
					typeName: 'spta:GIS_PERM_AREA',
					outputformat: 'application/json',
					format_options: 'CHARSET:EUC-KR',
					cql_filter: geometryParamArea,
				}

				// 허가구역 대상 Feature Object Info
				const areaObjectInfo = await axios.get('/gis/wfs?' + getParamString(paramsForArea))

				if(areaObjectInfo != undefined && areaObjectInfo != null)
					return areaObjectInfo

			} catch (e) {
				console.log(e.getMessage())
			}

			return null

		}

		const getFeaturesAndPnuByPolygon = async (areaOptionType) => {

			try {

				const source = new wg.source.Vector()
				targetPnu.value = []

				const geometryObjectInfo = await getFeatureNormRegion()
				const areaObjectInfo = await getFeatureRestrictRegion()

				if(areaOptionType == 'all') {
					resultArr.value = geometryObjectInfo.data.features

					for (let l = 0; l < resultArr.value.length; l++) {
						const featureValue = resultArr.value[l]
						targetPnu.value.push(featureValue.properties.PNU)

						let feature = new wg.format.GeoJSON().readFeature(featureValue.geometry)
						source.addFeature(feature)
					}

				} else if(areaOptionType == 'onlyArea') {
					areaArr.value = areaObjectInfo.data.features
					if (geometryObjectInfo.data.features.length > 0) {
						// 허가구역 내 PNU 추출
						const areaPnuMap = new Set(areaArr.value.map((item) => item.properties.PNU))
						// 임의 영역 중 허가구역 PNU 추출
						isAreaTargetPnu.value = geometryObjectInfo.data.features.filter((item) => areaPnuMap.has(item.properties.PNU))
						for (let l = 0; l < isAreaTargetPnu.value.length; l++) {
							const featureValue = isAreaTargetPnu.value[l]
							targetPnu.value.push(featureValue.properties.PNU)

							let feature = new wg.format.GeoJSON().readFeature(featureValue.geometry)
							source.addFeature(feature)
						}
					} else {
						console.log('임의 영역 내 Feautres 없음')
					}

				} else if(areaOptionType == 'exArea') {
					areaArr.value = areaObjectInfo.data.features
					if (geometryObjectInfo.data.features.length > 0) {
						// 허가구역 내 PNU 추출
						const areaPnuMap = new Set(areaArr.value.map((item) => item.properties.PNU))
						// 임의 영역 중 허가구역 제외 PNU 추출
						isAreaTargetPnu.value = geometryObjectInfo.data.features.filter((item) => !areaPnuMap.has(item.properties.PNU))
						for (let l = 0; l < isAreaTargetPnu.value.length; l++) {
							const featureValue = isAreaTargetPnu.value[l]
							targetPnu.value.push(featureValue.properties.PNU)

							let feature = new wg.format.GeoJSON().readFeature(featureValue.geometry)
							source.addFeature(feature)
						}
					} else {
						console.log('임의 영역 내 Feautres 없음')
					}

					isAreaTargetPnu.value.forEach((d) => {
						let feature = new wg.format.GeoJSON().readFeature(d.geometry)
						source.addFeature(feature)
					})

				}

				return source

			} catch (e) {
				console.error('getFeaturesAndPnuByPolygon 에러:', e)
			}

		}

		const initChart = async () => {
			const element = document.getElementById('chartSpace1')
			chart = echarts.init(element)

			dataList.value = []
			statDataArray.value = []
		}

		const drawStatTargetRegion = (source) => {

			const SELECTED_LAYER = 'AnalysisAreaSelected'
			WGMap.removeLayer(WGMap.getLayerById(SELECTED_LAYER))

			const layer = new wg.layer.Vector({
				id: SELECTED_LAYER,
				source: source,
				//style: areaStore.isAreaCheck || areaStore.isOnlyAreaCheck ? wgStyle.getUserRegionStyle().areaSelect : wgStyle.getUserRegionStyle().regionSelect,
				style: wgStyle.getUserRegionStyle().regionSelect,
				visible: true,
				zIndex: 10,
			})

			WGMap.addLayer(layer)
		}

		const drawChart = (statData) => {
			let monthArr = new Array(diffInMonths.value)

			// 반복문을 통해 각 월 데이터를 monthArr에 추가
			for (let k = 0; k < diffInMonths.value; k++) {
				// 현재 월 데이터 계산
				let inputMonth = dayjs(areaStore.analysisPopStandPreMonth).add(k, 'month').format('YYYY-MM')
				// monthArr의 해당 인덱스에 월 데이터 추가
				monthArr[k] = inputMonth
			}

			dataArray.value = []

			for (let j = 0; j < diffInMonths.value; j++) {
				dataArray.value.push(statData[j].m1)
			}

			if (areaStore.areaStatType === 'price') {
				subTextContent.value = '평균가격'
			} else if (areaStore.areaStatType === 'area') {
				subTextContent.value = '1㎡가격'
			} else if (areaStore.areaStatType === 'volume') {
				subTextContent.value = '거래량'
			}

			const option = {
				/* grid: {
					right: 10,
				}, */
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow',
					},
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true,
				},
				xAxis: {
					type: 'category',
					//name: statData[0].mngGrpNm,
					data: monthArr,
					// axisLabel: {
					// 	interval: 0,
					// },
					axisLabel: {
						interval: 0,
						formatter: function (value, index) {
							if (index === 0 || index === monthArr.length - 1) {
								return value // 처음과 마지막 데이터는 보여줍니다.
							} else {
								return '' // 나머지 데이터는 숨깁니다.
							}
						},
					},
					nameLocation: 'middle',
					nameTextStyle: {
						fontSize: 10,
						padding: [5, 0, 0, 0],
					},
				},
				yAxis: {
					// axisLabel: {
					// 	show: false, // Y 축 레이블 숨김
					// },
					// splitLine: {
					// 	show: false,
					// },
					type: 'value',
				},
				backgroundColor: 'rgba(255, 255, 255, 0.8)',
				series: [
					{
						data: dataArray.value,
						type: 'line',
						symbol: function (value, params) {
							if (params.dataIndex == 0 || params.dataIndex == diffInMonths.value - 1) {
								return 'emptyCircle'
							} else {
								return 'none'
							}
						},
						smooth: true,
					},
				],
				title: {
					left: 'center',
					subtext: subTextContent.value,
					/* subtext: 'test',
						subtextStyle: {
							align: 'center',
							verticalAlign: 'bottom',
						} */
				},
			}

			chart.setOption(option)
			isLoading.value = false
		}

		// 통계 작성
		const drawInitChart = async () => {
			const endDate = new Date(areaStore.analysisPopStandMonth)
			const startDate = new Date(areaStore.analysisPopStandPreMonth)

			diffInMonths.value =
				endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear()) + 1

			monthListArray.value = []
			monthDataArray.value = []
			for (let k = 0; k < diffInMonths.value; k++) {
				let inputMonth = dayjs(areaStore.analysisPopStandMonth).subtract(k, 'month').format('YYYY-MM')
				let dataForMonth = dayjs(areaStore.analysisPopStandMonth)
					.subtract(k, 'month')
					.format('YYYY-MM')
					.replace('-', '')
				monthListArray.value.push(inputMonth)
				monthDataArray.value.push(dataForMonth)
			}
			isLoading.value = true
			const chartSpace1 = document.getElementById('chartSpace1')
			// 차트 초기화
			if (chartSpace1) {
				echarts.dispose(chartSpace1)

				await initChart()
			}

			let params = {}

			//허가구역만 또는 제외 했을때 사용
			if ((areaStore.isAreaCheck || areaStore.isOnlyAreaCheck) && targetPnu.value.length > 0) {
				// 중복 pnu 제거 List
				let nuDuPnuList = [...new Set(targetPnu.value)]
				let repsNew = Math.floor(nuDuPnuList.length / 1000)
				let plusElemNew = nuDuPnuList.length % 1000

				// 1000개씩 pnu를 n개로 나눠서 통계를 집계 > 집계된 통계를 n으로 평균 (sql에서 1000개씩 나누는 방식도 있지만 속도가 느림)
				for (let k = 0; k < repsNew + 1; k++) {
					let arrayLength = k * 1000
					let starts = 0 + arrayLength
					let ends = 1000 * (k + 1)
					let newPnuList = []
					if (k != repsNew) {
						newPnuList = nuDuPnuList.slice(starts, ends)
					} else if (k == repsNew && plusElemNew != 0) {
						newPnuList = nuDuPnuList.slice(starts, starts + (nuDuPnuList.length % 1000))
					}
					params = {
						standardDate: areaStore.analysisPopStandMonth.replace('-', ''),
						statType: areaStore.areaStatType,
						dataOption: areaStore.areaOption,
						pnuList: newPnuList,
						monthArray: monthDataArray.value,
					}

					if (params.pnuList.length == 0) {
						return
					}

					const { data, status } = await areaApi.selectStatFromPnu(params)

					resultStatus.value = status

					for (let i = 0; i < data.length; i++) {
						if (k == 0) {
							dataList.value[i] = new Object()
							dataList.value[i].m1 = 0
							dataList.value[i].countNumber = 0
						}

						dataList.value[i].m1 += data[i].m1
						if (areaStore.areaStatType !== 'volume') {
							dataList.value[i].countNumber += data[i].countNumber
						}
					}
				}
			} else if(!areaStore.isAreaCheck && !areaStore.isOnlyAreaCheck) {
				let reps = Math.floor(props.targetPnuArray.length / 1000)
				let plusElem = props.targetPnuArray.length % 1000

				for (let k = 0; k < reps + 1; k++) {
					let arrayLength = k * 1000
					let starts = 0 + arrayLength
					let ends = 1000 * (k + 1)
					let newPnuList = []
					if (k != reps) {
						newPnuList = props.targetPnuArray.slice(starts, ends)
					} else if (k == reps && plusElem != 0) {
						newPnuList = props.targetPnuArray.slice(starts, starts + (props.targetPnuArray.length % 1000))
					}
					params = {
						standardDate: areaStore.analysisPopStandMonth.replace('-', ''),
						statType: areaStore.areaStatType,
						dataOption: areaStore.areaOption,
						pnuList: newPnuList,
						monthArray: monthDataArray.value,
					}

					if (params.pnuList.length == 0) {
						return
					}

					const { data, status } = await areaApi.selectStatFromPnu(params)

					resultStatus.value = status

					for (let i = 0; i < data.length; i++) {
						if (k == 0) {
							dataList.value[i] = new Object()
							dataList.value[i].m1 = 0
							dataList.value[i].countNumber = 0
						}

						dataList.value[i].m1 += data[i].m1
						if (areaStore.areaStatType !== 'volume') {
							dataList.value[i].countNumber += data[i].countNumber
						}
					}
				}
			} else {
				for (let i = 0; i < monthListArray.value.length; i++) {
					dataList.value[i] = new Object()
					dataList.value[i].m1 = 0
					dataList.value[i].countNumber = 0
				}
			}

			if (areaStore.areaStatType !== 'volume') {
				for (let p = 0; p < dataList.value.length; p++) {
					if (dataList.value[p].countNumber != 0) {
						dataList.value[p].m1 = Math.ceil(dataList.value[p].m1 / dataList.value[p].countNumber)
					} else {
						dataList.value[p].m1 = 0
					}
				}
			}
			isLoading.value = false

			if (resultStatus.value.code === 200) {
				CommonUtil.log(log.TARGET.ANAY_STATIC_API, log.ACTION.SUCCESS, null)
			} else {
				CommonUtil.log(log.TARGET.ANAY_STATIC_API, log.ACTION.FAIL, null)
			}

			statDataArray.value = dataList.value.reverse()
			drawChart(statDataArray.value)
		}
		const onPopupCloseClick = () => {
			areaStore.setAnalysisPopStandMonth(dayjs().format('YYYY-MM'))
			areaStore.setAnalysisPopStandPreMonth(dayjs().subtract(11, 'month').format('YYYY-MM'))
			areaStore.setIsAreaCheck(false)
			areaStore.setIsOnlyAreaCheck(false)
			emit('close-popup')
		}

		const onTypeClick = (event) => {
			if (event.target.id === 'priceChart') {
				priceTab.value = true
				areaTab.value = false
				volumeTab.value = false
				areaStore.setAreaStatType('price')
				// console.log('로그.평균가격 btn')
				if (isTradeChart.value == true) {
					getTradeInfo()
				}
				CommonUtil.log(log.TARGET.ANAY_PRICE_BTN, log.ACTION.CLICK, null)
			} else if (event.target.id === 'areaChart') {
				priceTab.value = false
				areaTab.value = true
				volumeTab.value = false
				areaStore.setAreaStatType('area')
				if (isTradeChart.value == true) {
					getTradeInfo()
				}
				// console.log('로그.1m 가격 btn')
				CommonUtil.log(log.TARGET.ANAY_AREA_BTN, log.ACTION.CLICK, null)
			} else if (event.target.id === 'volumeChart') {
				priceTab.value = false
				areaTab.value = false
				volumeTab.value = true
				areaStore.setAreaStatType('volume')
				if (isTradeChart.value == true) {
					getTradeInfo()
				}
				// console.log('로그.거래량 btn')
				CommonUtil.log(log.TARGET.ANAY_VOLUME_BTN, log.ACTION.CLICK, null)
			}
		}

		const onOptionChangeClick = (event) => {
			if (event.target.id === 'kabOption') {
				isKab.value = true
				isRtms.value = false
				areaStore.setAreaOption('kab')
				if (isTradeChart.value == true) {
					getTradeInfo()
				}
				// console.log('로그.실거래가 btn')
				CommonUtil.log(log.TARGET.ANAY_KAB_BTN, log.ACTION.CLICK, null)
			} else if (event.target.id === 'rtmsOption') {
				isKab.value = false
				isRtms.value = true
				areaStore.setAreaOption('rtms')
				// console.log('로그.RTMS btn')
				if (isTradeChart.value == true) {
					getTradeInfo()
				}
				CommonUtil.log(log.TARGET.ANAY_RTMS_BTN, log.ACTION.CLICK, null)
			}
		}
		const onBottomListClick = (event) => {
			if (event.target.id === 'priceChart') {
				isPriceChart.value = true
				isAreaChart.value = false
				isTradeChart.value = false
				// console.log('로그.통계수치 btn')
				CommonUtil.log(log.TARGET.ANAY_PRICECHART_BTN, log.ACTION.CLICK, null)
			} else if (event.target.id === 'areaChart') {
				isPriceChart.value = false
				isAreaChart.value = true
				isTradeChart.value = false
				getPnuList()
				// console.log('로그.필지리스트 btn')
				CommonUtil.log(log.TARGET.ANAY_AREACHART_BTN, log.ACTION.CLICK, null)
			} else if (event.target.id === 'tradeChart') {
				isPriceChart.value = false
				isAreaChart.value = false
				isTradeChart.value = true
				getTradeInfo()
			}
		}

		//필지리스트
		const getPnuList = async (pageNum = 1) => {
			pagination.totalCount = 0
			pagination.page = pageNum

			if(targetPnu.value.length == 0) {
				areaList.value = []
				return
			}

			let noDuPnuList = [...new Set(targetPnu.value)]
			const pnuObject = new Object()
			if (areaStore.isAreaCheck || areaStore.isOnlyAreaCheck) {
				pnuObject.pnuList = noDuPnuList
				// console.log('필지리스트0', pnuObject.pnuList)
			} else {
				pnuObject.pnuList = props.targetPnuArray
				// console.log('필지리스트x', pnuObject.pnuList)
			}
			isLoading.value = true
			const { data, status } = await areaApi.getSelectedFeatureInfo(pnuObject, pagination)
			if (status.code === 200) {
				CommonUtil.log(log.TARGET.ANAY_LAND_API, log.ACTION.SUCCESS, null)
			} else {
				CommonUtil.log(log.TARGET.ANAY_LAND_API, log.ACTION.FAIL, null)
			}
			pagination = reactive(Object.assign(pagination, data.pagination))
			areaList.value = data.contents
			isLoading.value = false
		}

		const getTradeInfo = async (pageNum = 1) => {
			pagination.totalCount = 0
			pagination.page = pageNum

			if(targetPnu.value.length == 0) {
				tradeArray.value = []
				return
			}

			isLoading.value = true
			let noDuPnuList = [...new Set(targetPnu.value)]
			const pnuObject = new Object()
			if (areaStore.isAreaCheck || areaStore.isOnlyAreaCheck) {
				pnuObject.pnuList = noDuPnuList
			} else {
				pnuObject.pnuList = props.targetPnuArray
			}
			const params = {
				dataOption: areaStore.areaOption,
				standardDate: areaStore.analysisPopStandMonth.replace('-', ''),
				prevDate: areaStore.analysisPopStandPreMonth.replace('-', ''),
				pnuList: pnuObject.pnuList,
				// pnuList: props.targetPnuArray,
			}

			const { data, status } = await areaApi.selectTradeList(params, pagination)
			console.log('로그.거래리스트', params, areaStore.analysisPopStandPreMonth, areaStore.analysisPopStandMonth)
			if (status.code === 200) {
				CommonUtil.log(log.TARGET.PROPERTY_TRADE_API, log.ACTION.SUCCESS, null)
			} else {
				CommonUtil.log(log.TARGET.PROPERTY_TRADE_API, log.ACTION.FAIL, null)
			}
			pagination = reactive(Object.assign(pagination, data.pagination))
			tradeArray.value = data.contents
			isLoading.value = false
		}

		// 거래리스트 엑셀 다운로드
		const getTradeExcel = async () => {
			console.log('로그.거래리스트 엑셀')
			CommonUtil.log(log.TARGET.PROPERTY_TRADECHART_EXCEL_BTN, log.ACTION.CLICK, null)
			isLoading.value = true
			const params = {
				dataOption: areaStore.areaOption,
				standardDate: areaStore.analysisPopStandMonth.replace('-', ''),
				prevDate: areaStore.analysisPopStandPreMonth.replace('-', ''),
				pnuList: props.targetPnuArray,
			}
			console.log('logloglog', params)

			const { status, data } = await areaApi.selectTradeExcel(params)
			if (status.code === 200) {
				CommonUtil.log(log.TARGET.PROPERTY_TRADECHART_EXCEL_DOWNLOAD, log.ACTION.SUCCESS, null)
			} else {
				CommonUtil.log(log.TARGET.PROPERTY_TRADECHART_EXCEL_DOWNLOAD, log.ACTION.FAIL, null)
			}

			let popupName = '허가구역 분석-'
			if (areaStore.areaOption === 'kab') {
				dataOptionName.value = '실거래공개-거래리스트'
			} else if (areaStore.areaOption === 'rtms') {
				dataOptionName.value = '자치구RTMS-거래리스트'
			}
			let fileName = popupName + dataOptionName.value
			const url = window.URL.createObjectURL(data)
			var link = document.createElement('a')
			link.href = url

			link.download = fileName + '.xlsx'
			link.click()
			if (status.code === 200) {
				isLoading.value = false
				modalStore.showToast('success', `거래리스트 다운로드를 완료하였습니다.`)
			} else {
				modalStore.showToast('error', `거래리스트 다운로드에 실패하였습니다.`)
			}
		}

		const onAreaTrClick = async (event, pnu) => {
			const activeTr = document.querySelectorAll('tr.active')

			for (let i = 0; i < activeTr.length; i++) {
				activeTr[i].classList.remove('active')
			}
			event.target.parentElement.classList.add('active')

			const { data } = await BottomListApi.getGeometryByPnu(pnu)
			const coordiToGeometry = new wg.geom.Polygon(data.geometry.coordinates)
			const geometry = data.geometry
			let feature = new wg.format.GeoJSON().readFeature(geometry)
			wgTools.fitAnim(coordiToGeometry)
			const areaFeatureLayer = WGMap.getLayerById('areaFeatureLayer')
			if (areaFeatureLayer) {
				areaFeatureLayer.getSource().clear()
				areaFeatureLayer.getSource().addFeature(feature)
			} else {
				const source = new wg.source.Vector()
				const layer = new wg.layer.Vector({
					id: 'areaFeatureLayer',
					source: source,
					style: wgStyle.getUserRegionStyle().areaSelect,
					visible: true,
					zIndex: 15,
				})
				source.addFeature(feature)

				WGMap.addLayer(layer)
			}
		}

		// 필지 리스트 엑셀 다운로드
		const onPnuExcelDownClick = async () => {
			CommonUtil.log(log.TARGET.ANAY_AREACHART_EXCEL_BTN, log.ACTION.CLICK, null)
			const pnuObject = new Object()
			if (areaStore.isAreaCheck || areaStore.isOnlyAreaCheck) {
				pnuObject.pnuList = [...new Set(targetPnu.value)]
			} else {
				pnuObject.pnuList = props.targetPnuArray
			}
			isLoading.value = true
			const { data, status } = await areaApi.pnuDetailExcel(pnuObject)
			console.log('로그.허가구역분석 엑셀')
			if (status.code === 200) {
				CommonUtil.log(log.TARGET.ANAY_AREACHART_EXCEL_DOWNLOAD, log.ACTION.SUCCESS, null)
			} else {
				CommonUtil.log(log.TARGET.ANAY_AREACHART_EXCEL_DOWNLOAD, log.ACTION.FAIL, null)
			}
			const url = window.URL.createObjectURL(data)
			let link = document.createElement('a')

			let popupName = '허가구역 분석-'
			if (areaStore.areaOption === 'kab') {
				dataOptionName.value = '필지리스트'
			} else if (areaStore.areaOption === 'rtms') {
				dataOptionName.value = '필지리스트'
			}
			let fileName = popupName + dataOptionName.value

			link.href = url
			link.download = fileName + '.xlsx'
			link.click()
			isLoading.value = false
		}

		const fixDate = () => {
			const currentDate = new Date()
			const endDt = currentDate.toISOString().split('T')[0]
			currentDate.setMonth(currentDate.getMonth() - 11)
			const startDt = currentDate.toISOString().split('T')[0]
			startDate.value = startDt.slice(0, 7)
			endDate.value = endDt.slice(0, 7)
			areaStore.analysisPopStandMonth = endDate.value
		}

		const update = () => {
			const startDt = new Date(prevMonthText.value)
			const endDt = new Date(startDt)
			endDt.setMonth(endDt.getMonth() + 11)
			areaStore.analysisPopStandMonth = endDt.toISOString().slice(0, 7)
			const currentDate = new Date()
			if (endDt > currentDate) {
				modalStore.showAlert('종료일은 현재 달을 초과할 수 없습니다.')
				fixDate()
			}
		}

		const locationInfo = () => {
			sggInfo.value = locationStore.selectedSgg.text
			umdInfo.value = locationStore.selectedUmd.text
		}

		const formatNumber = (amount) => {
			if (amount === 0) {
				return amount
			}

			const amountStr = amount.toString()
			const length = amountStr.length

			let result = ''

			if (priceTab.value == true) {
				if (isKab.value == true) {
					if (length > 4) {
						const milloinStr = amountStr.slice(-4).replace(/(^0+)/, '')
						if (milloinStr.length != 0) {
							result = amountStr.slice(0, -4) + '억' + milloinStr + '만'
						} else {
							result = amountStr.slice(0, -4) + '억'
						}
					} else {
						result = amount + '만'
					}
					return result
				} else if (isRtms.value == true) {
					if (length > 8) {
						result += amountStr.substring(0, length - 8) + '억'
					}
					if (length > 4) {
						const milloinStr = amountStr.substring(length - 8, length - 4).replace(/(^0+)/, '')
						if (milloinStr.length != 0) {
							result += milloinStr + '만'
						}
					}
					return result
				}
			} else if (areaTab.value == true) {
				if (isKab.value == true) {
					if (length > 4) {
						const milloinStr = amountStr.slice(-4).replace(/(^0+)/, '')
						if (milloinStr.length != 0) {
							result = amountStr.slice(0, -4) + '억' + milloinStr + '만'
						} else {
							result = amountStr.slice(0, -4) + '억'
						}
					} else {
						result = amount + '만'
					}
					return result
				} else if (isRtms.value == true) {
					if (length > 8) {
						result += amountStr.substring(0, length - 8) + '억'
					}
					if (length > 4) {
						const milloinStr = amountStr.substring(length - 8, length - 4).replace(/(^0+)/, '')
						if (milloinStr.length != 0) {
							result += milloinStr + '만'
						}
					}
					return result
				}
			} else if (volumeTab.value == true) {
				result = amount + '건'
				return result
			}
		}

		const areaCheck = () => {
			if (isAreaCheck.value) {
				// console.log('로그.허가구역제외 btn OFF')
				if (isTradeChart.value == true) {
					getTradeInfo()
				}
				CommonUtil.log(log.TARGET.ANAY_SWITCH_BTN_OFF, log.ACTION.CLICK, null)
			} else {
				// console.log('로그.허가구역제외 btn ON')
				if (isTradeChart.value == true) {
					getTradeInfo()
				}
				CommonUtil.log(log.TARGET.ANAY_SWITCH_BTN_ON, log.ACTION.CLICK, null)
			}
		}

		// 통계수치 엑셀다운로드
		const onStatisticsExcel = async () => {
			const endDate = new Date(areaStore.analysisPopStandMonth)
			const startDate = new Date(areaStore.analysisPopStandPreMonth)

			diffInMonths.value =
				endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear()) + 1

			monthListArray.value = []
			monthDataArray.value = []
			for (let k = 0; k < diffInMonths.value; k++) {
				let inputMonth = dayjs(areaStore.analysisPopStandMonth).subtract(k, 'month').format('YYYY-MM')
				let dataForMonth = dayjs(areaStore.analysisPopStandMonth)
					.subtract(k, 'month')
					.format('YYYY-MM')
					.replace('-', '')
				monthListArray.value.push(inputMonth)
				monthDataArray.value.push(dataForMonth)
			}
			isLoading.value = true
			// const chartSpace1 = document.getElementById('chartSpace1')
			// // 차트 초기화
			// if (chartSpace1) {
			// 	echarts.dispose(chartSpace1)
			// }

			let params = {}

			//허가구역 제외 했을때 사용
			if (areaStore.isAreaCheck || areaStore.isOnlyAreaCheck) {
				// 중복 pnu 제거 List
				let nuDuPnuList = [...new Set(targetPnu.value)]
				let repsNew = Math.floor(nuDuPnuList.length / 1000)
				let plusElemNew = nuDuPnuList.length % 1000

				// 1000개씩 pnu를 n개로 나눠서 통계를 집계 > 집계된 통계를 n으로 평균 (sql에서 1000개씩 나누는 방식도 있지만 속도가 느림)
				for (let k = 0; k < repsNew + 1; k++) {
					let arrayLength = k * 1000
					let starts = 0 + arrayLength
					let ends = 1000 * (k + 1)
					let newPnuList = []
					if (k != repsNew) {
						newPnuList = nuDuPnuList.slice(starts, ends)
					} else if (k == repsNew && plusElemNew != 0) {
						newPnuList = nuDuPnuList.slice(starts, starts + (nuDuPnuList.length % 1000))
					}
					params = {
						standardDate: areaStore.analysisPopStandMonth.replace('-', ''),
						statType: areaStore.areaStatType,
						dataOption: areaStore.areaOption,
						pnuList: newPnuList,
						monthArray: monthDataArray.value,
					}

					if (params.pnuList.length == 0) {
						return
					}

					const { data, status } = await areaApi.selectStatFromPnu(params)
					isLoading.value = true

					resultStatus.value = status

					for (let i = 0; i < data.length; i++) {
						if (k == 0) {
							dataList.value[i] = new Object()
							dataList.value[i].m1 = 0
							dataList.value[i].countNumber = 0
						}

						dataList.value[i].m1 += data[i].m1
						if (areaStore.areaStatType !== 'volume') {
							dataList.value[i].countNumber += data[i].countNumber
						}
					}
				}
			} else {
				let reps = Math.floor(props.targetPnuArray.length / 1000)
				let plusElem = props.targetPnuArray.length % 1000

				for (let k = 0; k < reps + 1; k++) {
					let arrayLength = k * 1000
					let starts = 0 + arrayLength
					let ends = 1000 * (k + 1)
					let newPnuList = []
					if (k != reps) {
						newPnuList = props.targetPnuArray.slice(starts, ends)
					} else if (k == reps && plusElem != 0) {
						newPnuList = props.targetPnuArray.slice(starts, starts + (props.targetPnuArray.length % 1000))
					}
					params = {
						standardDate: areaStore.analysisPopStandMonth.replace('-', ''),
						statType: areaStore.areaStatType,
						dataOption: areaStore.areaOption,
						pnuList: newPnuList,
						monthArray: monthDataArray.value,
					}

					if (params.pnuList.length == 0) {
						return
					}
				}
			}
			const { status, data } = await areaApi.selectStatisticsExcel(params)
			const url = window.URL.createObjectURL(data)
			let link = document.createElement('a')

			link.href = url
			let popupName = '허가구역 분석-'
			if (areaStore.propertyOption === 'kab') {
				if (areaStore.propertyStatType === 'price') {
					dataOptionName.value = '실거래공개-평균가격-통계'
				} else if (areaStore.propertyStatType === 'area') {
					dataOptionName.value = '실거래공개-1㎡가격-통계'
				} else if (areaStore.propertyStatType === 'volume') {
					dataOptionName.value = '실거래공개-거래량-통계'
				}
			} else if (areaStore.propertyOption === 'rtms') {
				if (areaStore.propertyStatType === 'price') {
					dataOptionName.value = '자치구RTMS-평균가격-통계'
				} else if (areaStore.propertyStatType === 'area') {
					dataOptionName.value = '자치구RTMS-1㎡가격-통계'
				} else if (areaStore.propertyStatType === 'volume') {
					dataOptionName.value = '자치구RTMS-거래량-통계'
				}
			}

			let fileName = popupName + dataOptionName.value

			link.download = fileName + '.xlsx'

			link.click()

			if (status.code === 200) {
				isLoading.value = false
				modalStore.showToast('success', '통계수치 다운로드를 완료하였습니다.')
			} else {
				modalStore.showToast('error', '통계수치 다운로드에 실패하였습니다.')
			}
		}

		return {
			toolStore,
			isPopupShow,
			standMonthText,
			prevMonthText,
			monthListArray,
			standMonth,
			areaStore,
			priceTab,
			areaTab,
			volumeTab,
			isPriceChart,
			isAreaChart,
			statDataArray,
			isLoading,
			loadingText,
			subTextContent,
			isKab,
			isRtms,
			isAreaCheck,
			isOnlyAreaCheck,
			targetPnu,
			pagination,
			areaList,
			userStore,
			locationStore,
			sggInfo,
			umdInfo,
			areaCheck,
			dataArray,
			diffInMonths,
			onPnuExcelDownClick,
			getPnuList,
			onTypeClick,
			onPopupCloseClick,
			onBottomListClick,
			onOptionChangeClick,
			onAreaTrClick,
			fixDate,
			update,
			locationInfo,
			formatNumber,
			getTradeInfo,
			getTradeExcel,
			isTradeChart,
			tradeArray,
			menuStore,
			onStatisticsExcel,
		}
	},
}
</script>

<style scoped>
.layer-popup .body {
	min-height: 880px;
	/* min-width: 850px; */
}
a {
	cursor: pointer;
}
.average-price {
	height: auto;
	max-height: 371px;
}

.head {
	cursor: move;
}

#statTab {
	font-size: 20px;
	border: solid black;
	border-width: 3px;
	border-radius: 10px;
	width: 300px;
	margin-bottom: 10px;
}

.body > ul > li {
	display: flex;
	align-items: center;
}
.body > ul > li + li {
	margin-top: 30px;
}
.body > ul > li > label {
	width: 80px;
	min-width: 80px;
	margin-right: 8px;
	padding-left: 10px;
	box-sizing: border-box;
	font-size: 1rem;
	line-height: 1.25;
	color: #6f6f6f;
	display: flex;
	flex-wrap: wrap;
	position: relative;
}
.body > ul > li > label:before {
	width: 3px;
	min-width: 3px;
	height: 15px;
	content: '';
	background-color: #6e41de;
	border-radius: 5px;
	display: inline-block;
	position: absolute;
	top: 1px;
	left: 0;
}
.body > ul > li > label > em {
	font-size: 0.875rem;
	font-style: normal;
	display: inline-block;
}
.body > ul > li .form-group {
	width: 100%;
	margin-bottom: 0;
	display: flex;
}
.body > ul > li .btn-group {
	width: 100%;
}

.btn-group > .btn-items {
	margin-left: 60px;
}

.body > ul > li .btn-group .btn {
	width: 100%;
	padding: 6px 6px;
	font-size: 0.875rem;
}
.body .action-btn-group {
	margin-top: 60px;
}

.land-list {
	height: auto;
}
#chartSpace1 {
	min-width: 300px;
	zoom: 133.3%;
}

.gbnCol {
	white-space: nowrap;
}

.data-table th:nth-child(3),
.data-table td:nth-child(3) {
	min-width: 90px;
}
</style>
