<template>
	<div
		id="additionalStat"
		class="layer-popup"
		style="width: 900px; top: 6%; left: 45%; z-index: 5"
		:class="{ show: isAdditional }"
	>
		<div class="head">
			<div class="tit">권역/자치구 단위 통계</div>
			<a class="btn-close" @click="onPopupCloseClick"><span>팝업창 닫기</span></a>
		</div>
		<div class="body">
			<div class="tab">
				<ul>
					<li class="active">
						<span id="statTab" v-if="positionStr !== '' && positionStr !== undefined">{{ positionStr }}</span>
						<div class="tab-pane">
							<!-- style="margin-top: 10px" -->
							<li style="display: flex">
								<label style="margin-right: 20px; margin-top: 3px">기준월</label>
								<div class="form-group date">
									<input type="month" class="form-control" v-model="areaStore.additionalPopStandPreMonth" />
									<div class="hyphen">~</div>
									<input type="month" class="form-control" v-model="areaStore.additionalPopStandMonth" />
								</div>
								<span>
									<li style="display: flex; margin-left: 180px; justify-content: right; align-items: center">
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
												v-if="userStore.loginUser.taskTkcgCd === 'AC002' || userStore.loginUser.auth === 'A'"
												@click="onOptionChangeClick($event)"
											>
												자치구RTMS
											</button>
										</div>
									</li>
								</span>
							</li>
							<li style="display: flex">
								<div class="flex" style="display: flex">
									<label class="label"><span style="margin-right: 10px">통계범위</span></label>
									<div class="form-group">
										<select class="form-control" v-model="rangeCd" @change="changeOnRange($event.target.value)">
											<option value="section">권역</option>
											<option value="gu">자치구</option>
										</select>
									</div>
								</div>
								<div v-if="rangeCd !== ''" class="flex" style="display: flex">
									<label class="label"
										><span style="margin-right: 10px; margin-left: 10px">{{ subRangeNm }}</span></label
									>
									<div v-if="rangeCd === 'section'" class="form-group">
										<select class="form-control" v-model="subRangeSecCd">
											<option value="secWs">서남권</option>
											<option value="secEs">동남권</option>
											<option value="secWn">서북권</option>
											<option value="secCe">도심권</option>
											<option value="secEn">동북권</option>
										</select>
									</div>

									<div v-if="rangeCd === 'gu'" class="form-group">
										<select class="form-control" v-model="subRangeGuCd">
											<option value="11680">강남구</option>
											<option value="11740">강동구</option>
											<option value="11305">강북구</option>
											<option value="11500">강서구</option>
											<option value="11620">관악구</option>
											<option value="11215">광진구</option>
											<option value="11530">구로구</option>
											<option value="11545">금천구</option>
											<option value="11350">노원구</option>
											<option value="11320">도봉구</option>
											<option value="11230">동대문구</option>
											<option value="11590">동작구</option>
											<option value="11440">마포구</option>
											<option value="11410">서대문구</option>
											<option value="11650">서초구</option>
											<option value="11200">성동구</option>
											<option value="11290">성북구</option>
											<option value="11710">송파구</option>
											<option value="11470">양천구</option>
											<option value="11560">영등포구</option>
											<option value="11170">용산구</option>
											<option value="11380">은평구</option>
											<option value="11110">종로구</option>
											<option value="11140">중구</option>
											<option value="11260">중랑구</option>
										</select>
									</div>
								</div>
							</li>

							<div
								class="btn-group"
								style="margin-top: 15px; justify-content: center; align-items: center; display: flex"
							>
								<button
									id="priceAvgChart"
									type="button"
									class="btn btn-dark"
									:class="{ active: priceTab }"
									@click="onTypeClick($event)"
								>
									평균가격
								</button>
								<button
									id="areaAvgChart"
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
								<span style="margin-left: 105px; margin-right: -300px">
									{{ areaStore.additionalPopStandPreMonth }} ~ {{ areaStore.additionalPopStandMonth }}({{
										diffInMonths
									}}개월)
								</span>
							</div>
							<div id="chartSpace2" style="width: 100%; height: 200px"></div>
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
									v-if="areaStore.loadingStat"
									style="align-items: center; width: 100px; height: 100px; margin-top: 100px; margin-bottom: 100px"
								/>
								<template v-if="!areaStore.loadingStat">
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
												<tbody>
													<tr v-for="(monthData, index) in dataArray" :key="index">
														<th scope="row">{{ monthListArray[diffInMonths - index - 1] }}</th>
														<td>{{ formatNumber(monthData) }}</td>
														<td></td>
													</tr>
												</tbody>
											</table>
										</div>
										<div v-if="rangeCd !== ''" class="action-btn-group mt-20" style="margin-bottom: 8px">
											<div class="right">
												<button type="button" class="btn btn-primary" @click="onStaticsExcelDownClick()">
													{{ buttonStr }}
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
													<tr v-for="(area, index) in fieldList" :key="index" @click="onAreaTrClick($event, area.pnu)">
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
										@movePage="getAreaFeatureInfo"
									/>
									<li v-show="isTradeChart">
										<div class="tit">거래리스트</div>
										<div style="overflow: auto; height: 240px">
											<table class="table data-table color-blue mb-0">
												<thead v-if="isKab">
													<tr>
														<th scope="col">자치구</th>
														<th scope="col">법정동</th>
														<th scope="col">건물명</th>
														<th scope="col">준공년도</th>
														<th scope="col">면적별</th>
														<th scope="col">거래일시</th>
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
														<th scope="col">건물명</th>
														<th scope="col">준공년도</th>
														<th scope="col">면적별</th>
														<th scope="col">거래일시</th>
														<th scope="col">거래금액</th>
														<th scope="col">물건구분명</th>
														<th scope="col">건물용도명</th>
														<th scope="col">용도지역명</th>
													</tr>
												</thead>
												<tbody v-if="isKab">
													<tr v-for="(trade, index) in tradeSectionArray" :key="index">
														<th scope="row">{{ trade.sggNm }}</th>
														<th scope="row">{{ trade.emdNm }}</th>
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
													<tr v-for="(trade, index) in tradeSectionArray" :key="index">
														<th scope="row">{{ trade.sggNm }}</th>
														<th scope="row">{{ trade.emdNm }}</th>
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
	<Loading v-if="areaStore.loadingStat" :title="loadingText.title" :subTitle="loadingText.subTitle" />
</template>

<script>
import { ref, onMounted, watch, reactive, computed } from 'vue'
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
import area from '@/api/area'
import CommonUtil from '@/api/logTable'
import { useLog } from '@/stores/log'
import wgTools from '@/composition/wgTools'

export default {
	components: {
		Spinner,
		Loading,
		Pagination,
	},
	emits: ['close-popup'],
	props: {
		/* activeName: {
			type: String,
			default: '',
		}, */
		isAdditional: {
			type: Boolean,
			default: false,
		},
	},
	setup(props, { emit }) {
		onMounted(async () => {
			areaStore.setAdditionStatType('price')
			await drawInitChart()
			$('#additionalStat').draggable({
				containment: 'body',
				scroll: false,
				handle: '.head',
			})

			for (let k = 1; k < 12; k++) {
				let inputMonth = dayjs(areaStore.additionalPopStandMonth).subtract(k, 'month').format('YYYY-MM')
				monthListArray.value.push(inputMonth)
			}
		})

		const isPopupShow = ref(true)
		const areaStore = useAreaStore()
		const toolStore = useToolStore()
		const userStore = useUserStore()
		const log = useLog()
		const standMonthText = ref(dayjs(areaStore.additionalPopStandMonth).format('YYYY-MM'))
		const prevMonthText = ref(dayjs(areaStore.additionalPopStandMonth).subtract(11, 'month').format('YYYY-MM'))
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
		const tradeSectionArray = ref([])
		const subTextContent = ref('평균가격')
		const fieldList = ref([])
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
		const rangeCd = ref('section')
		const subRangeSecCd = ref('secWs')
		const subRangeGuCd = ref('11680')
		const subRangeNm = ref('권역')
		const subRangeCd = ref([])
		const subRangeCdList = ref([])
		const statObject = ref({})
		const dataOptionName = ref('')
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
			size: 8,
			unitPage: 5,
			totalCount: 0,
		})
		let chart

		watch(
			() => areaStore.additionalPopStandMonth,
			async () => {
				if (areaStore.additionalPopStandMonth > dayjs().format('YYYY-MM')) {
					modalStore.showAlert('종료일은 현재 달을 초과할 수 없습니다.')
					areaStore.setAdditionalPopStandMonth(dayjs().format('YYYY-MM'))
				}
				if (areaStore.additionalPopStandPreMonth > areaStore.additionalPopStandMonth) {
					modalStore.showAlert('시작일은 종료일을 초과할 수 없습니다.')
					areaStore.setAdditionalPopStandMonth(
						dayjs(areaStore.additionalPopStandPreMonth)
							.add(diffInMonths.value - 1, 'month')
							.format('YYYY-MM')
					)
				}
				const endDate = new Date(areaStore.additionalPopStandMonth)
				const startDate = new Date(areaStore.additionalPopStandPreMonth)

				diffInMonths.value =
					endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear()) + 1
				if (diffInMonths.value > 36) {
					modalStore.showAlert('검색 가능 최대 기간은 3년입니다.')
					if (
						dayjs(areaStore.additionalPopStandPreMonth).add(36, 'month').format('YYYY-MM') < dayjs().format('YYYY-MM')
					) {
						areaStore.setAdditionalPopStandMonth(
							dayjs(areaStore.additionalPopStandPreMonth).add(35, 'month').format('YYYY-MM')
						)
					} else {
						areaStore.setAdditionalPopStandMonth(dayjs().format('YYYY-MM'))
					}
					return
				}
				monthListArray.value = []
				for (let k = 0; k < diffInMonths.value; k++) {
					let inputMonth = dayjs(areaStore.additionalPopStandMonth).subtract(k, 'month').format('YYYY-MM')
					monthListArray.value.push(inputMonth)
				}

				if (isTradeChart.value) {
					await getTradeInfo()
				}
				await drawInitChart()
			}
		)

		watch(
			() => areaStore.additionalPopStandPreMonth,
			async () => {
				if (areaStore.additionalPopStandPreMonth > areaStore.additionalPopStandMonth) {
					modalStore.showAlert('시작일은 종료일을 초과할 수 없습니다.')
					areaStore.setAdditionalPopStandPreMonth(
						dayjs(areaStore.additionalPopStandMonth)
							.subtract(diffInMonths.value - 1, 'month')
							.format('YYYY-MM')
					)
				}
				const endDate = new Date(areaStore.additionalPopStandMonth)
				const startDate = new Date(areaStore.additionalPopStandPreMonth)

				diffInMonths.value =
					endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear()) + 1

				//const standMonth = areaStore.additionalPopStandMonth
				if (diffInMonths.value > 36) {
					modalStore.showAlert('검색 가능 최대 기간은 3년입니다.')
					areaStore.setAdditionalPopStandPreMonth(
						dayjs(areaStore.additionalPopStandMonth).subtract(35, 'month').format('YYYY-MM')
					)
				}
				monthListArray.value = []
				for (let k = 0; k < diffInMonths.value; k++) {
					let inputMonth = dayjs(areaStore.additionalPopStandMonth).subtract(k, 'month').format('YYYY-MM')
					monthListArray.value.push(inputMonth)
				}

				if (isTradeChart.value) {
					await getTradeInfo()
				}
				await drawInitChart()
			}
		)

		watch(
			() => areaStore.additionStatType,
			() => {
				drawInitChart()
			}
		)

		watch(
			() => areaStore.additionOption,
			async () => {
				if (isTradeChart.value) {
					await getTradeInfo()
				}
				await drawInitChart()
			}
		)

		watch(
			() => rangeCd.value,
			async () => {
				if (rangeCd.value === '') {
					return
				} else {
					if (isAreaChart.value) {
						await getAreaFeatureInfo()
					}
					if (isTradeChart.value) {
						await getTradeInfo()
					}
					await drawInitChart()
				}
			}
		)

		watch(
			() => subRangeGuCd.value,
			async () => {
				if (subRangeGuCd.value === 'guBase') {
					return
				} else {
					if (isAreaChart.value) {
						await getAreaFeatureInfo()
					}
					if (isTradeChart.value) {
						await getTradeInfo()
					}
					await drawInitChart()
				}
			}
		)

		watch(
			() => subRangeSecCd.value,
			async () => {
				if (subRangeSecCd.value === 'secBase') {
					return
				} else {
					if (isAreaChart.value) {
						await getAreaFeatureInfo()
					}
					if (isTradeChart.value) {
						await getTradeInfo()
					}
					await drawInitChart()
				}
			}
		)

		const positionStr = computed(() => {
			let pStr = ''
			if (rangeCd.value === '' || subRangeGuCd.value === 'guBase' || subRangeSecCd.value === 'secBase') {
				return
			}
			if (rangeCd.value === 'gu' && subRangeGuCd.value === '11680') {
				pStr = '강남구'
			} else if (rangeCd.value === 'gu' && subRangeGuCd.value === '11740') {
				pStr = '강동구'
			} else if (rangeCd.value === 'gu' && subRangeGuCd.value === '11305') {
				pStr = '강북구'
			} else if (rangeCd.value === 'gu' && subRangeGuCd.value === '11500') {
				pStr = '강서구'
			} else if (rangeCd.value === 'gu' && subRangeGuCd.value === '11620') {
				pStr = '관악구'
			} else if (rangeCd.value === 'gu' && subRangeGuCd.value === '11215') {
				pStr = '광진구'
			} else if (rangeCd.value === 'gu' && subRangeGuCd.value === '11530') {
				pStr = '구로구'
			} else if (rangeCd.value === 'gu' && subRangeGuCd.value === '11545') {
				pStr = '금천구'
			} else if (rangeCd.value === 'gu' && subRangeGuCd.value === '11350') {
				pStr = '노원구'
			} else if (rangeCd.value === 'gu' && subRangeGuCd.value === '11320') {
				pStr = '도봉구'
			} else if (rangeCd.value === 'gu' && subRangeGuCd.value === '11230') {
				pStr = '동대문구'
			} else if (rangeCd.value === 'gu' && subRangeGuCd.value === '11590') {
				pStr = '동작구'
			} else if (rangeCd.value === 'gu' && subRangeGuCd.value === '11440') {
				pStr = '마포구'
			} else if (rangeCd.value === 'gu' && subRangeGuCd.value === '11410') {
				pStr = '서대문구'
			} else if (rangeCd.value === 'gu' && subRangeGuCd.value === '11650') {
				pStr = '서초구'
			} else if (rangeCd.value === 'gu' && subRangeGuCd.value === '11200') {
				pStr = '성동구'
			} else if (rangeCd.value === 'gu' && subRangeGuCd.value === '11290') {
				pStr = '성북구'
			} else if (rangeCd.value === 'gu' && subRangeGuCd.value === '11710') {
				pStr = '송파구'
			} else if (rangeCd.value === 'gu' && subRangeGuCd.value === '11470') {
				pStr = '양천구'
			} else if (rangeCd.value === 'gu' && subRangeGuCd.value === '11560') {
				pStr = '영등포구'
			} else if (rangeCd.value === 'gu' && subRangeGuCd.value === '11170') {
				pStr = '용산구'
			} else if (rangeCd.value === 'gu' && subRangeGuCd.value === '11380') {
				pStr = '은평구'
			} else if (rangeCd.value === 'gu' && subRangeGuCd.value === '11110') {
				pStr = '종로구'
			} else if (rangeCd.value === 'gu' && subRangeGuCd.value === '11140') {
				pStr = '중구'
			} else if (rangeCd.value === 'gu' && subRangeGuCd.value === '11260') {
				pStr = '중랑구'
			}
			if (rangeCd.value === 'section' && subRangeSecCd.value === 'secWs') {
				pStr = '서남권'
			} else if (rangeCd.value === 'section' && subRangeSecCd.value === 'secEs') {
				pStr = '동남권'
			} else if (rangeCd.value === 'section' && subRangeSecCd.value === 'secWn') {
				pStr = '서북권'
			} else if (rangeCd.value === 'section' && subRangeSecCd.value === 'secCe') {
				pStr = '도심권'
			} else if (rangeCd.value === 'section' && subRangeSecCd.value === 'secEn') {
				pStr = '동북권'
			}

			return pStr
		})
		const buttonStr = computed(() => {
			let btnString = ''
			if (isKab.value) {
				btnString += '실거래공개-'
			} else if (isRtms.value) {
				btnString += '자치구RTMS-'
			}

			if (rangeCd.value === 'section') {
				btnString += '권역별-'
			} else if (rangeCd.value === 'gu') {
				btnString += '자치구별-'
			} else {
				btnString = ''
			}

			if (priceTab.value && rangeCd.value !== '') {
				btnString += '평균가격 엑셀 다운로드'
			} else if (areaTab.value && rangeCd.value !== '') {
				btnString += '1㎡가격 엑셀 다운로드'
			} else if (volumeTab.value && rangeCd.value !== '') {
				btnString += '거래량 엑셀 다운로드'
			}

			return btnString
		})
		const drawChart = (statData) => {
			let monthArr = new Array(diffInMonths.value)
			monthArr[diffInMonths.value - 1] = areaStore.additionalPopStandMonth.replace('-', '')
			const timeStandard = dayjs(areaStore.additionalPopStandMonth)
			for (let k = 1; k < diffInMonths.value; k++) {
				let prevDate = timeStandard.subtract(k, 'month')
				if (k == diffInMonths.value - 1) {
					monthArr[0] = areaStore.additionalPopStandPreMonth
				} else {
					monthArr[k] = ''
				}
			}

			dataArray.value = []

			for (let j = 1; j < monthListArray.value.length + 1; j++) {
				let vStr = monthListArray.value[monthListArray.value.length - j].replace('-', '')
				dataArray.value.push(statData[vStr])
			}
			if (areaStore.additionStatType === 'price') {
				subTextContent.value = '평균가격'
			} else if (areaStore.additionStatType === 'area') {
				subTextContent.value = '1㎡가격'
			} else if (areaStore.additionStatType === 'volume') {
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
					axisLabel: {
						interval: 0,
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

			const element = document.getElementById('chartSpace2')
			const chart = echarts.init(element)
			chart.setOption(option)
			areaStore.setLoadingStat(false)
		}

		const drawInitChart = async () => {
			if (subRangeSecCd.value === 'secBase' || subRangeGuCd.value === 'guBase') {
				let alertStr = subRangeNm.value
				modalStore.showAlert(`${alertStr}를 선택해주세요`)
				return
			}
			const endDate = new Date(areaStore.additionalPopStandMonth)
			const startDate = new Date(areaStore.additionalPopStandPreMonth)

			diffInMonths.value =
				endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear()) + 1

			monthListArray.value = []
			monthDataArray.value = []
			for (let k = 0; k < diffInMonths.value; k++) {
				let inputMonth = dayjs(areaStore.additionalPopStandMonth).subtract(k, 'month').format('YYYY-MM')
				let dataForMonth = dayjs(areaStore.additionalPopStandMonth)
					.subtract(k, 'month')
					.format('YYYY-MM')
					.replace('-', '')
				monthListArray.value.push(inputMonth)
				monthDataArray.value.push(dataForMonth)
			}
			areaStore.setLoadingStat(true)
			const chartSpace2 = document.getElementById('chartSpace2')
			if (chartSpace2) {
				echarts.dispose(chartSpace2)
			}
			subRangeCd.value = []
			if (rangeCd.value === 'section') {
				// 서남권
				if (subRangeSecCd.value === 'secWs') {
					subRangeCd.value = ['11500', '11470', '11530', '11560', '11545', '11590', '11620']
				}
				// 동남권
				if (subRangeSecCd.value === 'secEs') {
					subRangeCd.value = ['11650', '11680', '11710', '11740']
				}
				// 서북권
				if (subRangeSecCd.value === 'secWn') {
					subRangeCd.value = ['11380', '11410', '11440']
				}
				// 도심권
				if (subRangeSecCd.value === 'secCe') {
					subRangeCd.value = ['11110', '11140', '11170']
				}
				// 동북권
				if (subRangeSecCd.value === 'secEn') {
					subRangeCd.value = ['11590', '11305', '11350', '11290', '11230', '11260', '11200', '11215']
				}
			} else if (rangeCd.value === 'gu') {
				subRangeCd.value.push(subRangeGuCd.value)
			}

			params = {
				standardPreDate: areaStore.additionalPopStandPreMonth.replace('-', ''),
				standardDate: areaStore.additionalPopStandMonth.replace('-', ''),
				statType: areaStore.additionStatType,
				dataOption: areaStore.additionOption,
				rangeCd: rangeCd.value,
				subRangeCd: subRangeCd.value,
				monthArray: monthDataArray.value,
			}
			const { data, status } = await areaApi.selectStatFromSection(params)

			resultSatus.value = status
			statObject.value = {}

			for (let k = 0; k < monthDataArray.value.length; k++) {
				let modiMonth = monthDataArray.value[k].replace('-', '')
				statObject.value[modiMonth] = 0
				for (let j = 0; j < data.length; j++) {
					if (modiMonth === data[j].dealYm) {
						statObject.value[data[j].dealYm] = data[j].m1
					}
				}
			}

			areaStore.setLoadingStat(false)

			statDataArray.value = data
			drawChart(statObject.value)
		}

		const onPopupCloseClick = () => {
			areaStore.setAdditionalPopStandMonth(dayjs().format('YYYY-MM'))
			emit('close-popup')
		}

		const onTypeClick = (event) => {
			if (event.target.id === 'priceAvgChart') {
				priceTab.value = true
				areaTab.value = false
				volumeTab.value = false
				areaStore.setAdditionStatType('price')
				//CommonUtil.log(log.TARGET.PROPERTY_PRICE_BTN, log.ACTION.CLICK, null)
			} else if (event.target.id === 'areaAvgChart') {
				priceTab.value = false
				areaTab.value = true
				volumeTab.value = false
				areaStore.setAdditionStatType('area')
				//CommonUtil.log(log.TARGET.PROPERTY_AREA_BTN, log.ACTION.CLICK, null)
			} else if (event.target.id === 'volumeChart') {
				priceTab.value = false
				areaTab.value = false
				volumeTab.value = true
				areaStore.setAdditionStatType('volume')
				//CommonUtil.log(log.TARGET.PROPERTY_VOLUME_BTN, log.ACTION.CLICK, null)
			}
		}

		const onBottomListClick = (event) => {
			if (event.target.id === 'priceChart') {
				isPriceChart.value = true
				isAreaChart.value = false
				isTradeChart.value = false
				//console.log('로그.통계수치 btn')
				//CommonUtil.log(log.TARGET.PROPERTY_PRICECHART_BTN, log.ACTION.CLICK, null)
			} else if (event.target.id === 'areaChart') {
				isPriceChart.value = false
				isAreaChart.value = true
				isTradeChart.value = false
				getAreaFeatureInfo()
				//console.log('로그.필지리스트 btn')
				//CommonUtil.log(log.TARGET.PROPERTY_AREACHART_BTN, log.ACTION.CLICK, null)
			} else if (event.target.id === 'tradeChart') {
				isPriceChart.value = false
				isAreaChart.value = false
				isTradeChart.value = true
				getTradeInfo()
				//console.log('로그.거래리스트 btn')
				//CommonUtil.log(log.TARGET.PROPERTY_TRADECHART_BTN, log.ACTION.CLICK, null)
			}
		}

		const onOptionChangeClick = (event) => {
			if (event.target.id === 'kabOption') {
				isKab.value = true
				isRtms.value = false
				areaStore.setAdditionOption('kab')
				//console.log('로그.실거래가 btn')
				//CommonUtil.log(log.TARGET.PROPERTY_KAB_BTN, log.ACTION.CLICK, null)
			} else if (event.target.id === 'rtmsOption') {
				isKab.value = false
				isRtms.value = true
				areaStore.setAdditionOption('rtms')
				//console.log('로그.RTMS btn')
				//CommonUtil.log(log.TARGET.PROPERTY_RTMS_BTN, log.ACTION.CLICK, null)
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
					style: new wg.style.Style({
						fill: new wg.style.Fill({
							color: 'rgba(0, 255, 0, 0.8)',
						}),
						stroke: new wg.style.Stroke({
							color: 'rgba(255, 0, 0, 1)',
							width: 3,
						}),
					}),
					visible: true,
					zIndex: 15,
				})
				source.addFeature(feature)

				WGMap.addLayer(layer)
			}
		}

		const onPnuExcelDownClick = async (pnuListArr) => {
			/* CommonUtil.log(log.TARGET.PROPERTY_AREACHART_EXCEL_BTN, log.ACTION.CLICK, null)
			console.log('로그.필지리스트 엑셀') */
			const rangeCdObject = new Object()
			subRangeCd.value = []
			if (rangeCd.value === 'section') {
				// 서남권
				if (subRangeSecCd.value === 'secWs') {
					subRangeCd.value = ['11500', '11470', '11530', '11560', '11545', '11590', '11620']
				}
				// 동남권
				if (subRangeSecCd.value === 'secEs') {
					subRangeCd.value = ['11650', '11680', '11710', '11740']
				}
				// 서북권
				if (subRangeSecCd.value === 'secWn') {
					subRangeCd.value = ['11380', '11410', '11440']
				}
				// 도심권
				if (subRangeSecCd.value === 'secCe') {
					subRangeCd.value = ['11110', '11140', '11170']
				}
				// 동북권
				if (subRangeSecCd.value === 'secEn') {
					subRangeCd.value = ['11590', '11305', '11350', '11290', '11230', '11260', '11200', '11215']
				}
			} else if (rangeCd.value === 'gu') {
				subRangeCd.value.push(subRangeGuCd.value)
			}
			rangeCdObject.subRangeCd = subRangeCd.value
			areaStore.setLoadingStat(true)
			const { status, data } = await areaApi.pnuDetailExcelFromSection(rangeCdObject)

			const url = window.URL.createObjectURL(data)
			let link = document.createElement('a')

			let popupName = '권역/자치구 단위 통계-'

			if (areaStore.additionOption === 'kab') {
				dataOptionName.value = '필지리스트'
			} else if (areaStore.additionOption === 'rtms') {
				dataOptionName.value = '필지리스트'
			}
			let fileName = popupName + dataOptionName.value
			link.href = url
			link.download = fileName + '.xlsx'
			link.click()
			areaStore.setLoadingStat(false)
			/* if (status.code === 200) {
				isLoading.value = false
				modalStore.showToast('success', `필지조서 다운로드를 완료하였습니다.`)
				CommonUtil.log(log.TARGET.PROPERTY_AREACHART_EXCEL_DOWNLOAD, log.ACTION.SUCCESS, null)
			} else {
				modalStore.showToast('error', `필지조서 다운로드에 실패하였습니다.`)
				CommonUtil.log(log.TARGET.PROPERTY_AREACHART_EXCEL_DOWNLOAD, log.ACTION.FAIL, null)
			} */
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

		const changeOnRange = (eventValue) => {
			if (rangeCd.value === 'section') {
				subRangeNm.value = '권역'
			} else if (rangeCd.value === 'gu') {
				subRangeNm.value = '자치구'
			}
		}

		const getAreaFeatureInfo = async (pageNum = 1) => {
			pagination.totalCount = 0
			pagination.page = pageNum
			const sggCdObject = new Object()
			subRangeCd.value = []
			if (rangeCd.value === 'section') {
				// 서남권
				if (subRangeSecCd.value === 'secWs') {
					subRangeCd.value = ['11500', '11470', '11530', '11560', '11545', '11590', '11620']
				}
				// 동남권
				if (subRangeSecCd.value === 'secEs') {
					subRangeCd.value = ['11650', '11680', '11710', '11740']
				}
				// 서북권
				if (subRangeSecCd.value === 'secWn') {
					subRangeCd.value = ['11380', '11410', '11440']
				}
				// 도심권
				if (subRangeSecCd.value === 'secCe') {
					subRangeCd.value = ['11110', '11140', '11170']
				}
				// 동북권
				if (subRangeSecCd.value === 'secEn') {
					subRangeCd.value = ['11590', '11305', '11350', '11290', '11230', '11260', '11200', '11215']
				}
			} else if (rangeCd.value === 'gu') {
				subRangeCd.value.push(subRangeGuCd.value)
			}
			sggCdObject.subRangeCd = subRangeCd.value
			fieldList.value = []
			areaStore.setLoadingStat(true)
			const { data, status } = await areaApi.getSelectedFeatureInfoFromSection(sggCdObject, pagination)
			//console.log('로그.필지리스트', status)
			/* if (status.code === 200) {
				CommonUtil.log(log.TARGET.PROPERTY_LAND_API, log.ACTION.SUCCESS, null)
			} else {
				CommonUtil.log(log.TARGET.PROPERTY_LAND_API, log.ACTION.FAIL, null)
			} */
			pagination = reactive(Object.assign(pagination, data.pagination))
			fieldList.value = data.contents
			areaStore.setLoadingStat(false)
		}

		const getTradeInfo = async (pageNum = 1) => {
			areaStore.setLoadingStat(true)
			subRangeCd.value = []
			if (rangeCd.value === 'section') {
				// 서남권
				if (subRangeSecCd.value === 'secWs') {
					subRangeCd.value = ['11500', '11470', '11530', '11560', '11545', '11590', '11620']
				}
				// 동남권
				if (subRangeSecCd.value === 'secEs') {
					subRangeCd.value = ['11650', '11680', '11710', '11740']
				}
				// 서북권
				if (subRangeSecCd.value === 'secWn') {
					subRangeCd.value = ['11380', '11410', '11440']
				}
				// 도심권
				if (subRangeSecCd.value === 'secCe') {
					subRangeCd.value = ['11110', '11140', '11170']
				}
				// 동북권
				if (subRangeSecCd.value === 'secEn') {
					subRangeCd.value = ['11590', '11305', '11350', '11290', '11230', '11260', '11200', '11215']
				}
			} else if (rangeCd.value === 'gu') {
				subRangeCd.value.push(subRangeGuCd.value)
			}
			const params = {
				dataOption: areaStore.additionOption,
				standardDate: areaStore.additionalPopStandMonth.replace('-', ''),
				prevDate: areaStore.additionalPopStandPreMonth.replace('-', ''),
				subRangeCd: subRangeCd.value,
			}
			pagination.totalCount = 0
			pagination.page = pageNum

			const { data, status } = await areaApi.selectTradeListFromSection(params, pagination)
			//console.log('로그.거래리스트', status)
			/* if (status.code === 200) {
				CommonUtil.log(log.TARGET.PROPERTY_TRADE_API, log.ACTION.SUCCESS, null)
			} else {
				CommonUtil.log(log.TARGET.PROPERTY_TRADE_API, log.ACTION.FAIL, null)
			} */
			pagination = reactive(Object.assign(pagination, data.pagination))
			tradeSectionArray.value = data.contents
			areaStore.setLoadingStat(false)
		}

		const getTradeExcel = async () => {
			//console.log('로그.거래리스트 엑셀')
			//CommonUtil.log(log.TARGET.PROPERTY_TRADECHART_EXCEL_BTN, log.ACTION.CLICK, null)
			areaStore.setLoadingStat(true)
			subRangeCd.value = []
			if (rangeCd.value === 'section') {
				// 서남권
				if (subRangeSecCd.value === 'secWs') {
					subRangeCd.value = ['11500', '11470', '11530', '11560', '11545', '11590', '11620']
				}
				// 동남권
				if (subRangeSecCd.value === 'secEs') {
					subRangeCd.value = ['11650', '11680', '11710', '11740']
				}
				// 서북권
				if (subRangeSecCd.value === 'secWn') {
					subRangeCd.value = ['11380', '11410', '11440']
				}
				// 도심권
				if (subRangeSecCd.value === 'secCe') {
					subRangeCd.value = ['11110', '11140', '11170']
				}
				// 동북권
				if (subRangeSecCd.value === 'secEn') {
					subRangeCd.value = ['11590', '11305', '11350', '11290', '11230', '11260', '11200', '11215']
				}
			} else if (rangeCd.value === 'gu') {
				subRangeCd.value.push(subRangeGuCd.value)
			}
			const params = {
				dataOption: areaStore.additionOption,
				standardDate: areaStore.additionalPopStandMonth.replace('-', ''),
				prevDate: areaStore.additionalPopStandPreMonth.replace('-', ''),
				subRangeCd: subRangeCd.value,
			}
			const { status, data } = await areaApi.selectTradeExcelFromSection(params)
			/* if (status.code === 200) {
				CommonUtil.log(log.TARGET.PROPERTY_TRADECHART_EXCEL_DOWNLOAD, log.ACTION.SUCCESS, null)
			} else {
				CommonUtil.log(log.TARGET.PROPERTY_TRADECHART_EXCEL_DOWNLOAD, log.ACTION.FAIL, null)
			} */
			const url = window.URL.createObjectURL(data)
			var link = document.createElement('a')
			link.href = url
			let popupName = '권역/' + '자치구 단위 통계-'
			if (areaStore.additionOption === 'kab') {
				dataOptionName.value = '실거래공개-거래리스트'
			} else if (areaStore.additionOption === 'rtms') {
				dataOptionName.value = '자치구RTMS-거래리스트'
			}
			let fileName = popupName + dataOptionName.value

			link.download = fileName + '.xlsx'

			// link.download = '거래리스트-' + areaStore.propertyOption + '.xlsx'
			link.click()
			areaStore.setLoadingStat(false)
			/* if (status.code === 200) {
				isLoading.value = false
				modalStore.showToast('success', `거래리스트 다운로드를 완료하였습니다.`)
			} else {
				modalStore.showToast('error', `거래리스트 다운로드에 실패하였습니다.`)
			} */
		}

		const onStaticsExcelDownClick = async () => {
			console.log('click down')

			if (rangeCd.value === 'gu') {
				//25 자치구
				subRangeCd.value = [
					'11680',
					'11740',
					'11305',
					'11500',
					'11620',
					'11215',
					'11530',
					'11545',
					'11350',
					'11320',
					'11230',
					'11590',
					'11440',
					'11410',
					'11650',
					'11200',
					'11290',
					'11710',
					'11470',
					'11560',
					'11170',
					'11380',
					'11110',
					'11140',
					'11260',
				]
			} else if (rangeCd.value === 'section') {
				subRangeCdList.value = [
					['11500', '11470', '11530', '11560', '11545', '11590', '11620'],
					['11650', '11680', '11710', '11740'],
					['11380', '11410', '11440'],
					['11110', '11140', '11170'],
					['11590', '11305', '11350', '11290', '11230', '11260', '11200', '11215'],
				]
			}

			let monthOrginArray = [...monthDataArray.value].reverse()
			let monthStrArray = monthOrginArray.map((month) => {
				return month.substring(2, 4) + '년 ' + month.substring(4, 6).replace(/^0+/, '') + '월'
			})
			console.log('origin' + monthDataArray.value)
			console.log('reverse' + monthOrginArray)
			console.log('strrr', monthStrArray)
			if (rangeCd.value === 'gu') {
				params = {
					standardPreDate: areaStore.additionalPopStandPreMonth.replace('-', ''),
					standardDate: areaStore.additionalPopStandMonth.replace('-', ''),
					statType: areaStore.additionStatType,
					dataOption: areaStore.additionOption,
					rangeCd: rangeCd.value,
					subRangeCd: subRangeCd.value,
					monthArray: monthOrginArray,
					monthStrArray: monthStrArray,
				}
			}
			if (rangeCd.value === 'section') {
				params = {
					standardPreDate: areaStore.additionalPopStandPreMonth.replace('-', ''),
					standardDate: areaStore.additionalPopStandMonth.replace('-', ''),
					statType: areaStore.additionStatType,
					dataOption: areaStore.additionOption,
					rangeCd: rangeCd.value,
					subRangeCdList: subRangeCdList.value,
					monthArray: monthOrginArray,
					monthStrArray: monthStrArray,
				}
			}
			const { data } = await areaApi.areaStatisticsExcel(params)

			const url = window.URL.createObjectURL(data)
			var link = document.createElement('a')

			let excelName = buttonStr.value.substring(0, buttonStr.value.length - 8)
			link.href = url
			link.download = excelName + '.xlsx'
			link.click()
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
			tradeSectionArray,
			isLoading,
			isKab,
			isRtms,
			loadingText,
			subTextContent,
			pagination,
			fieldList,
			startDate,
			endDate,
			chart,
			locationStore,
			userStore,
			dataArray,
			diffInMonths,
			rangeCd,
			subRangeSecCd,
			subRangeGuCd,
			subRangeNm,
			statObject,
			buttonStr,
			positionStr,
			onPopupCloseClick,
			onTypeClick,
			onOptionChangeClick,
			onAreaTrClick,
			onPnuExcelDownClick,
			formatNumber,
			changeOnRange,
			onBottomListClick,
			getAreaFeatureInfo,
			getTradeInfo,
			getTradeExcel,
			onStaticsExcelDownClick,
		}
	},
}
</script>

<style scoped>
.layer-popup .body {
	min-height: 870px;
	/* min-width: 850px; */
}
a {
	cursor: pointer;
}
.average-price {
	height: auto;
	max-height: 310px;
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
#chartSpace2 {
	min-width: 300px;
	zoom: 133.3%;
}
.gbnCol {
	white-space: nowrap;
}
</style>
