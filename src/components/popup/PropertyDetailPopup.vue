<template>
	<div
		id="propertyAnalysisPopup"
		class="layer-popup"
		:class="{ 'show': toolStore.activeName === 'propertyAnalysis' }"
		style="width: 960px; top: 6%; left: 45%; z-index: 5"
	>
		<div class="head">
			<div class="tit">부동산 분석</div>
			<a class="btn-close" @click="onPopupCloseClick"><span>팝업창 닫기</span></a>
		</div>
		<div class="body">
			<div class="tab">
				<ul>
					<li class="active">
						<span id="statTab">서울특별시 {{ sggInfo }} {{ umdInfo }}</span>
						<div class="tab-pane" style="margin-top: 10px">
							<li style="display: flex">
								<label style="margin-right: 20px; margin-top: 3px">기준월</label>
								<div class="form-group date">
									<input type="month" class="form-control" v-model="areaStore.propertyPopStandPreMonth" />
									<div class="hyphen">~</div>
									<input type="month" class="form-control" v-model="areaStore.propertyPopStandMonth" />
								</div>
								<span>
									<li style="display: flex; margin-left: 240px; justify-content: right; align-items: center">
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
								style="margin-top: 15px; justify-content: center; align-items: center; display: flex"
							>
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
								<span style="margin-left: 150px; margin-right: -320px">
									{{ areaStore.propertyPopStandPreMonth }} ~ {{ areaStore.propertyPopStandMonth }}({{
										diffInMonths
									}}개월)
								</span>
							</div>
							<div id="chartSpace4" style="width: 100%; height: 200px"></div>
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
														<td v-if="statDataArray.length > 0">{{ formatNumber(monthData) }}</td>
														<td></td>
													</tr>
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
													<col style="width: 100px" />
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
															서울 특별시 {{ area.sggNm + ' ' + area.emdNm + ' ' + area.bobn + '-' + area.bubn }}
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
												<button type="button" class="btn btn-primary" @click="onPnuExcelDownClick(targetPnuArray)">
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
										@movePage="getAreaFeatureInfo"
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
														<th scope="row">{{ trade.dealYmd }}</th>
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
	<Loading v-if="isLoading" :title="loadingText.title" :subTitle="loadingText.subTitle" />
</template>

<script>
import { ref, onMounted, watch, reactive } from 'vue'
import dayjs from 'dayjs'
import { useAreaStore } from '@/stores/area'
import { useToolStore } from '@/stores/tool'
import Pagination from '../Pagination.vue'
import areaApi from '@/api/area'
import * as echarts from 'echarts'
import Loading from '@/components/Loading.vue'
import Spinner from '@/components/Spinner.vue'
import { monitorBottom as BottomListApi } from '@/api/monitor'
import { useModalStore } from '@/stores/modal'
import { useLocationStore } from '@/stores/location'
import { useUserStore } from '@/stores/user'
import { useMenuStore } from '@/stores/menu'
import area from '@/api/area'
import CommonUtil from '@/api/logTable'
import { useLog } from '@/stores/log'
import wgTools from '@/composition/wgTools'
import useStyle from '@/composition/style'

export default {
	components: {
		Spinner,
		Loading,
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
	},
	setup(props, { emit }) {
		onMounted(async () => {
			areaStore.setPropertyStatType('price')
			locationInfo()
			//fixDate()
			await drawInitChart()
			$('#propertyAnalysisPopup').draggable({
				containment: 'body',
				scroll: false,
				handle: '.head',
			})

			for (let k = 1; k < 12; k++) {
				let inputMonth = dayjs(areaStore.propertyStandMonth).subtract(k, 'month').format('YYYY-MM')
				monthListArray.value.push(inputMonth)
			}
		})

		const isPopupShow = ref(true)
		const areaStore = useAreaStore()
		const toolStore = useToolStore()
		const userStore = useUserStore()
		const log = useLog()
		const menuStore = useMenuStore()
		const standMonthText = ref(dayjs(areaStore.propertyStandMonth).format('YYYY-MM'))
		const prevMonthText = ref(dayjs(areaStore.propertyStandMonth).subtract(11, 'month').format('YYYY-MM'))
		const monthListArray = ref([])
		const isPriceChart = ref(true)
		const isAreaChart = ref(false)
		const isTradeChart = ref(false)
		const priceTab = ref(true)
		const areaTab = ref(false)
		const volumeTab = ref(false)
		const isKab = ref(true)
		const isRtms = ref(false)
		const statDataArray = ref([])
		const tradeArray = ref([])
		const subTextContent = ref('')
		const areaList = ref([])
		const startDate = ref('')
		const endDate = ref('')
		const sggInfo = ref('')
		const umdInfo = ref('')
		const dataList = ref([])
		const modalStore = useModalStore()
		const locationStore = useLocationStore()
		const monthDataArray = ref([])
		const diffInMonths = ref(0)
		const dataArray = ref([])
		const resultSatus = ref({})
		const dataOptionName = ref('')
		const limitMonthly = 36
		const limitMonthlyStr = "3년"
		const nowYearMonth = dayjs().format('YYYY-MM')
		const wgStyle = useStyle()
		let isLoading = ref(false)
		let loadingText = {
			title: '잠시만 기다려주세요.',
			subTitle: '통계 자료를 불러오고 있습니다.',
		}
		let params = reactive({
			standardDateTmp: dayjs().format('YYYY-MM'),
			standardDate: '',
			dataOption: 'kab',
			statType: 'price',
		})
		// 페이징 정보
		let pagination = reactive({
			page: 1,
			size: 10,
			unitPage: 5,
			totalCount: 0,
		})
		let chart

		watch(
			() => areaStore.propertyPopStandMonth,
			() => {

				let standMonth = areaStore.propertyPopStandMonth
				const standPreMonth = areaStore.propertyPopStandPreMonth

				if (standMonth > nowYearMonth) {
					modalStore.showAlert('종료일은 현재 달을 초과할 수 없습니다.')
					areaStore.setPropertyPopStandMonth(nowYearMonth)
				}
				if (standPreMonth > standMonth) {
					modalStore.showAlert('시작일은 종료일을 초과할 수 없습니다.')
					areaStore.setPropertyPopStandMonth(
						dayjs(standPreMonth)
							.add(diffInMonths.value - 1, 'month')
							.format('YYYY-MM')
					)

					standMonth = areaStore.propertyPopStandMonth
				}
				const endDate = new Date(standMonth)
				const startDate = new Date(standPreMonth)

				diffInMonths.value =
					endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear()) + 1

				if (diffInMonths.value > limitMonthly) {
					modalStore.showAlert(`검색 가능 최대 기간은 ${limitMonthlyStr}입니다.`)
					if (
						dayjs(standPreMonth).add(limitMonthly, 'month').format('YYYY-MM') < nowYearMonth
					) {
						areaStore.setPropertyPopStandPreMonth(
							dayjs(standMonth).subtract(limitMonthly-1, 'month').format('YYYY-MM')
						)
					} else {
						areaStore.setPropertyPopStandMonth(nowYearMonth)
					}
					return
				}

				if (isAreaChart.value == true) {
					getAreaFeatureInfo()
				} else if (isTradeChart.value == true) {
					getTradeInfo()
				}

				drawInitChart()
			}
		)

		watch(
			() => areaStore.propertyPopStandPreMonth,
			() => {

				const standMonth = areaStore.propertyPopStandMonth
				let standPreMonth = areaStore.propertyPopStandPreMonth

				if (standPreMonth > standMonth) {
					modalStore.showAlert('시작일은 종료일을 초과할 수 없습니다.')
					areaStore.setPropertyPopStandPreMonth(
						dayjs(standMonth)
							.subtract(diffInMonths.value - 1, 'month')
							.format('YYYY-MM')
					)
					standPreMonth = areaStore.propertyPopStandPreMonth
				}
				const endDate = new Date(standMonth)
				const startDate = new Date(standPreMonth)

				diffInMonths.value =
					endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear()) + 1

				if (diffInMonths.value > limitMonthly) {
					modalStore.showAlert(`검색 가능 최대 기간은 ${limitMonthlyStr}입니다.`)

					areaStore.setPropertyPopStandMonth(
						dayjs(standPreMonth).add(limitMonthly-1, 'month').format('YYYY-MM')
					)
					return
				}

				if (isAreaChart.value == true) {
					getAreaFeatureInfo()
				} else if (isTradeChart.value == true) {
					getTradeInfo()
				}

				drawInitChart()
			}
		)

		watch(
			() => areaStore.propertyStatType,
			() => {
				drawInitChart()
			}
		)

		watch(
			() => areaStore.propertyOption,
			() => {
				drawInitChart()
			}
		)

		const drawChart = (statData) => {
			let monthArr = new Array(diffInMonths.value)

			// 반복문을 통해 각 월 데이터를 monthArr에 추가
			for (let k = 0; k < diffInMonths.value; k++) {
				// 현재 월 데이터 계산
				let inputMonth = dayjs(areaStore.propertyPopStandPreMonth).add(k, 'month').format('YYYY-MM')
				// monthArr의 해당 인덱스에 월 데이터 추가
				monthArr[k] = inputMonth
			}

			dataArray.value = []

			for (let j = 0; j < diffInMonths.value; j++) {
				dataArray.value.push(statData[j].m1)
			}
			if (areaStore.propertyStatType === 'price') {
				subTextContent.value = '평균가격'
			} else if (areaStore.propertyStatType === 'area') {
				subTextContent.value = '1㎡가격'
			} else if (areaStore.propertyStatType === 'volume') {
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

		const initChart = async () => {
			const element = document.getElementById('chartSpace4')
			chart = echarts.init(element)
		}

		const drawInitChart = async () => {
			const endDate = new Date(areaStore.propertyPopStandMonth)
			const startDate = new Date(areaStore.propertyPopStandPreMonth)

			diffInMonths.value =
				endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear()) + 1

			monthListArray.value = []
			monthDataArray.value = []
			for (let k = 0; k < diffInMonths.value; k++) {
				let inputMonth = dayjs(areaStore.propertyPopStandMonth).subtract(k, 'month').format('YYYY-MM')
				let dataForMonth = dayjs(areaStore.propertyPopStandMonth)
					.subtract(k, 'month')
					.format('YYYY-MM')
					.replace('-', '')
				monthListArray.value.push(inputMonth)
				monthDataArray.value.push(dataForMonth)
			}
			isLoading.value = true
			const chartSpace4 = document.getElementById('chartSpace4')
			if (chartSpace4) {
				echarts.dispose(chartSpace4)
				await initChart()
			}

			let reps = Math.floor(props.targetPnuArray.length / 1000)
			let plusElem = props.targetPnuArray.length % 1000
			let params = {}

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
					standardDate: areaStore.propertyStandMonth.replace('-', ''),
					statType: areaStore.propertyStatType,
					dataOption: areaStore.propertyOption,
					pnuList: newPnuList,
					monthArray: monthDataArray.value,
				}

				const { data, status } = await areaApi.selectStatFromPnu(params)

				resultSatus.value = status
				for (let i = 0; i < data.length; i++) {
					if (k == 0) {
						dataList.value[i] = new Object()
						dataList.value[i].m1 = 0
						dataList.value[i].countNumber = 0
					}

					dataList.value[i].m1 += data[i].m1
					if (areaStore.propertyStatType !== 'volume') {
						dataList.value[i].countNumber += data[i].countNumber
					}
				}
			}
			if (areaStore.propertyStatType !== 'volume') {
				for (let p = 0; p < dataList.value.length; p++) {
					if (dataList.value[p].countNumber != 0) {
						dataList.value[p].m1 = Math.ceil(dataList.value[p].m1 / dataList.value[p].countNumber)
					} else {
						dataList.value[p].m1 = 0
					}
				}
			}
			isLoading.value = false
			if (resultSatus.value.code === 200) {
				CommonUtil.log(log.TARGET.PROPERTY_STATIC_API, log.ACTION.SUCCESS, null)
			} else {
				CommonUtil.log(log.TARGET.PROPERTY_STATIC_API, log.ACTION.FAIL, null)
			}

			statDataArray.value = dataList.value.reverse()
			drawChart(statDataArray.value)
		}

		const onPopupCloseClick = () => {
			areaStore.setPropertyPopStandMonth(dayjs().format('YYYY-MM'))
			areaStore.setPropertyPopStandPreMonth(dayjs().subtract(11, 'month').format('YYYY-MM'))
			emit('close-popup')
		}

		const onTypeClick = (event) => {
			if (event.target.id === 'priceChart') {
				priceTab.value = true
				areaTab.value = false
				volumeTab.value = false
				areaStore.setPropertyStatType('price')
				if (isTradeChart.value == true) {
					getTradeInfo()
				}
				console.log('로그.평균가격 btn')
				CommonUtil.log(log.TARGET.PROPERTY_PRICE_BTN, log.ACTION.CLICK, null)
			} else if (event.target.id === 'areaChart') {
				priceTab.value = false
				areaTab.value = true
				volumeTab.value = false
				areaStore.setPropertyStatType('area')
				if (isTradeChart.value == true) {
					getTradeInfo()
				}
				console.log('로그.1m가격 btn')
				CommonUtil.log(log.TARGET.PROPERTY_AREA_BTN, log.ACTION.CLICK, null)
			} else if (event.target.id === 'volumeChart') {
				priceTab.value = false
				areaTab.value = false
				volumeTab.value = true
				areaStore.setPropertyStatType('volume')
				if (isTradeChart.value == true) {
					getTradeInfo()
				}
				console.log('로그.거래량 btn')
				CommonUtil.log(log.TARGET.PROPERTY_VOLUME_BTN, log.ACTION.CLICK, null)
			}
		}

		const onOptionChangeClick = (event) => {
			if (event.target.id === 'kabOption') {
				isKab.value = true
				isRtms.value = false
				areaStore.setPropertyOption('kab')
				if (isTradeChart.value == true) {
					getTradeInfo()
				}
				console.log('로그.실거래가 btn')
				CommonUtil.log(log.TARGET.PROPERTY_KAB_BTN, log.ACTION.CLICK, null)
			} else if (event.target.id === 'rtmsOption') {
				isKab.value = false
				isRtms.value = true
				areaStore.setPropertyOption('rtms')
				if (isTradeChart.value == true) {
					getTradeInfo()
				}
				console.log('로그.RTMS btn')
				CommonUtil.log(log.TARGET.PROPERTY_RTMS_BTN, log.ACTION.CLICK, null)
			}
		}
		const onBottomListClick = (event) => {
			if (event.target.id === 'priceChart') {
				isPriceChart.value = true
				isAreaChart.value = false
				isTradeChart.value = false
				console.log('로그.통계수치 btn')
				CommonUtil.log(log.TARGET.PROPERTY_PRICECHART_BTN, log.ACTION.CLICK, null)
			} else if (event.target.id === 'areaChart') {
				isPriceChart.value = false
				isAreaChart.value = true
				isTradeChart.value = false
				getAreaFeatureInfo()
				console.log('로그.필지리스트 btn')
				CommonUtil.log(log.TARGET.PROPERTY_AREACHART_BTN, log.ACTION.CLICK, null)
			} else if (event.target.id === 'tradeChart') {
				isPriceChart.value = false
				isAreaChart.value = false
				isTradeChart.value = true
				getTradeInfo()
				console.log('로그.거래리스트 btn')
				CommonUtil.log(log.TARGET.PROPERTY_TRADECHART_BTN, log.ACTION.CLICK, null)
			}
		}

		const getAreaFeatureInfo = async (pageNum = 1) => {
			pagination.totalCount = 0
			pagination.page = pageNum
			const pnuObject = new Object()
			pnuObject.pnuList = props.targetPnuArray
			isLoading.value = true
			const { data, status } = await areaApi.getSelectedFeatureInfo(pnuObject, pagination)
			console.log('로그.필지리스트', status)
			if (status.code === 200) {
				CommonUtil.log(log.TARGET.PROPERTY_LAND_API, log.ACTION.SUCCESS, null)
			} else {
				CommonUtil.log(log.TARGET.PROPERTY_LAND_API, log.ACTION.FAIL, null)
			}
			pagination = reactive(Object.assign(pagination, data.pagination))
			areaList.value = data.contents
			isLoading.value = false
		}

		const getTradeInfo = async (pageNum = 1) => {
			isLoading.value = true
			const params = {
				dataOption: areaStore.propertyOption,
				standardDate: areaStore.propertyPopStandMonth.replace('-', ''),
				prevDate: areaStore.propertyPopStandPreMonth.replace('-', ''),
				pnuList: props.targetPnuArray,
			}
			pagination.totalCount = 0
			pagination.page = pageNum

			const { data, status } = await areaApi.selectTradeList(params, pagination)
			console.log('로그.거래리스트', status)
			if (status.code === 200) {
				CommonUtil.log(log.TARGET.PROPERTY_TRADE_API, log.ACTION.SUCCESS, null)
			} else {
				CommonUtil.log(log.TARGET.PROPERTY_TRADE_API, log.ACTION.FAIL, null)
			}
			pagination = reactive(Object.assign(pagination, data.pagination))
			tradeArray.value = data.contents
			isLoading.value = false
			console.log('data', data.contents)
		}

		const getTradeExcel = async () => {
			console.log('로그.거래리스트 엑셀')
			CommonUtil.log(log.TARGET.PROPERTY_TRADECHART_EXCEL_BTN, log.ACTION.CLICK, null)
			isLoading.value = true
			const params = {
				dataOption: areaStore.propertyOption,
				standardDate: areaStore.propertyPopStandMonth.replace('-', ''),
				prevDate: areaStore.propertyPopStandPreMonth.replace('-', ''),
				pnuList: props.targetPnuArray,
			}
			const { status, data } = await areaApi.selectTradeExcel(params)
			if (status.code === 200) {
				CommonUtil.log(log.TARGET.PROPERTY_TRADECHART_EXCEL_DOWNLOAD, log.ACTION.SUCCESS, null)
			} else {
				CommonUtil.log(log.TARGET.PROPERTY_TRADECHART_EXCEL_DOWNLOAD, log.ACTION.FAIL, null)
			}
			const url = window.URL.createObjectURL(data)
			var link = document.createElement('a')
			link.href = url
			let popupName = '부동산 분석-'
			if (areaStore.propertyOption === 'kab') {
				dataOptionName.value = '실거래공개-거래리스트'
			} else if (areaStore.propertyOption === 'rtms') {
				dataOptionName.value = '자치구RTMS-거래리스트'
			}
			let fileName = popupName + dataOptionName.value

			link.download = fileName + '.xlsx'

			// link.download = '거래리스트-' + areaStore.propertyOption + '.xlsx'
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
			//WGMap.getView().fit(coordiToGeometry, WGMap.getSize())
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

		const onPnuExcelDownClick = async (pnuListArr) => {
			CommonUtil.log(log.TARGET.PROPERTY_AREACHART_EXCEL_BTN, log.ACTION.CLICK, null)
			console.log('로그.필지리스트 엑셀')
			const pnuObject = new Object()
			console.log('')
			pnuObject.pnuList = pnuListArr
			isLoading.value = true
			const { status, data } = await areaApi.pnuDetailExcel(pnuObject)

			const url = window.URL.createObjectURL(data)
			let link = document.createElement('a')

			link.href = url
			let popupName = '부동산 분석-'
			if (areaStore.propertyOption === 'kab') {
				dataOptionName.value = '필지리스트'
			} else if (areaStore.propertyOption === 'rtms') {
				dataOptionName.value = '필지리스트'
			}
			let fileName = popupName + dataOptionName.value
			link.download = fileName + '.xlsx'
			link.click()
			isLoading.value = false
			if (status.code === 200) {
				isLoading.value = false
				modalStore.showToast('success', `필지조서 다운로드를 완료하였습니다.`)
				CommonUtil.log(log.TARGET.PROPERTY_AREACHART_EXCEL_DOWNLOAD, log.ACTION.SUCCESS, null)
			} else {
				modalStore.showToast('error', `필지조서 다운로드에 실패하였습니다.`)
				CommonUtil.log(log.TARGET.PROPERTY_AREACHART_EXCEL_DOWNLOAD, log.ACTION.FAIL, null)
			}
		}

		const fixDate = () => {
			const currentDate = new Date()
			const endDt = currentDate.toISOString().split('T')[0]
			currentDate.setMonth(currentDate.getMonth() - 11)
			const startDt = currentDate.toISOString().split('T')[0]
			startDate.value = startDt.slice(0, 7)
			endDate.value = endDt.slice(0, 7)
			areaStore.propertyStandMonth = endDate.value
		}

		const update = () => {
			const startDt = new Date(prevMonthText.value)
			const endDt = new Date(startDt)
			endDt.setMonth(endDt.getMonth() + 11)
			areaStore.propertyStandMonth = endDt.toISOString().slice(0, 7)
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

		const onStatisticsExcel = async () => {
			const endDate = new Date(areaStore.propertyPopStandMonth)
			const startDate = new Date(areaStore.propertyPopStandPreMonth)

			diffInMonths.value =
				endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear()) + 1

			monthListArray.value = []
			monthDataArray.value = []
			for (let k = 0; k < diffInMonths.value; k++) {
				let inputMonth = dayjs(areaStore.propertyPopStandMonth).subtract(k, 'month').format('YYYY-MM')
				let dataForMonth = dayjs(areaStore.propertyPopStandMonth)
					.subtract(k, 'month')
					.format('YYYY-MM')
					.replace('-', '')
				monthListArray.value.push(inputMonth)
				monthDataArray.value.push(dataForMonth)
			}
			isLoading.value = true

			let reps = Math.floor(props.targetPnuArray.length / 1000)
			let plusElem = props.targetPnuArray.length % 1000
			let params = {}

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
					standardDate: areaStore.propertyStandMonth.replace('-', ''),
					statType: areaStore.propertyStatType,
					dataOption: areaStore.propertyOption,
					pnuList: newPnuList,
					monthArray: monthDataArray.value,
				}
			}
			isLoading.value = true
			const { status, data } = await areaApi.selectStatisticsExcel(params)
			console.log('data', params)

			const url = window.URL.createObjectURL(data)
			let link = document.createElement('a')

			link.href = url
			let popupName = '부동산 분석-'
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
			sggInfo,
			umdInfo,
			toolStore,
			isPopupShow,
			standMonthText,
			prevMonthText,
			monthListArray,
			areaStore,
			priceTab,
			areaTab,
			volumeTab,
			isPriceChart,
			isAreaChart,
			isTradeChart,
			statDataArray,
			tradeArray,
			isLoading,
			isKab,
			isRtms,
			loadingText,
			subTextContent,
			pagination,
			areaList,
			startDate,
			endDate,
			chart,
			locationStore,
			userStore,
			dataArray,
			diffInMonths,
			menuStore,
			onPopupCloseClick,
			onBottomListClick,
			onTypeClick,
			onOptionChangeClick,
			getAreaFeatureInfo,
			onAreaTrClick,
			onPnuExcelDownClick,
			getTradeInfo,
			fixDate,
			update,
			getTradeExcel,
			locationInfo,
			formatNumber,
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
.land-list {
	height: auto;
}
#chartSpace4 {
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
