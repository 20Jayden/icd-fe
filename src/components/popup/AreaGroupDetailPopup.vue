<template>
	<div
		id="areaGroupPopup"
		class="layer-popup"
		:class="{ show: isPopupShow }"
		style="top: 100px; left: 60%; width: 960px; z-index: 5"
	>
		<div class="head">
			<div class="tit">허가구역 상세정보</div>
			<a class="btn-close" @click="closePoupClick"><span>팝업창 닫기</span></a>
		</div>
		<div class="body" style="height: 845px">
			<div class="groupName">{{ groupDetailArr[0].mngGrpNm }}</div>
			<div class="tab">
				<ul>
					<li :class="{ active: statTab }" @click="onTabClick($event)">
						<a><span id="statTab">통계정보</span></a>
						<div class="tab-pane">
							<div class="form-group date" style="margin-top: 10px">
								<label style="margin-right: 20px; margin-top: 3px">기준월</label>
								<input type="month" class="form-control" style="width: 20%" v-model="areaStore.groupPopStandPreMonth" />
								<div class="hyphen">~</div>
								<input type="month" class="form-control" style="width: 20%" v-model="areaStore.groupPopStandMonth" />
								<div style="margin-left: 276px">
									{{ areaStore.groupPopStandPreMonth }} ~ {{ areaStore.groupPopStandMonth }} ({{ diffInMonths }}개월)
								</div>
							</div>
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
							</div>
							<div id="chartSpace" style="width: 100%; height: 200px">
								<p style="top: 90px; position: relative">통계 자료가 없는 그룹입니다</p>
							</div>
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
									v-if="isBottomChartLoading"
									style="align-items: center; width: 100px; height: 100px; margin-top: 100px; margin-bottom: 100px"
								/>
								<template v-if="!isBottomChartLoading">
									<li v-show="isPriceChart">
										<div class="tit" style="margin-top: 22px; margin-bottom: 15px">
											통계 수치
											<div class="custom-control custom-switch" style="margin-left: 666px">
												<input
													type="checkbox"
													class="custom-control-input"
													v-model="fieldCheck"
													@change="onFieldDeleteCheck($event)"
													id="fieldSwitch"
												/>
												<label class="label custom-control-label" for="fieldSwitch" style="margin-right: 5px"
													><span>삭제 필지 포함</span></label
												>
											</div>
										</div>

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
													<!-- <tr>
														<th scope="row">{{ monthListArray[9] }}</th>
														<td v-if="statDataArray.length > 0">{{ formatNumber(statDataArray[0].m2) }}</td>
														<td></td>
													</tr> -->
												</tbody>
											</table>
										</div>
									</li>
									<li v-show="isAreaChart">
										<div class="tit" style="margin-top: 22px; margin-bottom: 15px">
											필지리스트
											<div class="custom-control custom-switch" style="margin-left: 655px">
												<input
													type="checkbox"
													class="custom-control-input"
													v-model="fieldCheck"
													@change="onFieldDeleteCheck($event)"
													id="fieldSwitch"
												/>
												<label class="label custom-control-label" for="fieldSwitch" style="margin-right: 5px"
													><span>삭제 필지 포함</span></label
												>
											</div>
										</div>
										<div class="land-list" style="height: 100%">
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
														<th v-if="area.impFile === 'Y'" scope="row">{{ area.pnu }}</th>
														<th v-if="area.impFile === 'N'" scope="row" style="color: #ff0000">{{ area.pnu }}</th>
														<td class="text-left">{{ area.maddr }} {{ area.etcAddr }}</td>
														<td>{{ area.jimokNm }}</td>
														<td>{{ area.landArea }}</td>
														<td>{{ area.ownGbnNm }}</td>
													</tr>
												</tbody>
											</table>
										</div>
										<div class="action-btn-group mt-20" style="margin-bottom: 2px">
											<div class="right">
												<button
													type="button"
													class="btn btn-primary"
													@click="onExcelDownClick(clickedGroupCd, clickedGroupNm)"
												>
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
										<div class="tit" style="margin-top: 22px; margin-bottom: 15px">
											거래리스트
											<div class="custom-control custom-switch" style="margin-left: 655px">
												<input
													type="checkbox"
													class="custom-control-input"
													v-model="fieldCheck"
													@change="onFieldDeleteCheck($event)"
													id="fieldSwitch"
												/>
												<label class="label custom-control-label" for="fieldSwitch" style="margin-right: 5px"
													><span>삭제 필지 포함</span></label
												>
											</div>
										</div>
										<div style="overflow: auto; height: 310px">
											<table class="table data-table color-blue mb-0">
												<!-- <colgroup>
												<col style="width: 100px" />
												<col style="width: 300px" />
												<col style="width: 100px" />
												<col style="width: 100px" />
												<col style="width: 100px" />
											</colgroup> -->
												<thead v-if="areaStore.dataOption == 'kab'">
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
												<thead v-if="areaStore.dataOption == 'rtms'">
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
												<tbody v-if="areaStore.dataOption == 'kab'">
													<tr
														v-for="(trade, index) in tradeArray"
														:key="index"
														:class="{ 'red-text': trade.impFile == 'N' }"
													>
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
												<tbody v-else-if="areaStore.dataOption == 'rtms'">
													<tr
														v-for="(trade, index) in tradeArray"
														:key="index"
														:class="{ 'red-text': trade.impFile == 'N' }"
													>
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
										<div class="action-btn-group mt-20" style="margin-bottom: 5px">
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
					<li :class="{ active: groupTab }" @click="onTabClick($event)">
						<a><span id="groupTab">사업지 상세정보</span></a>
						<div class="tab-pane show">
							<div class="tit">상세정보</div>
							<table class="table detail-table">
								<caption>
									상세정보이며 번호, 사업명, 소재지, 면적, 사업부서, 지정공고일, 지정기간, 지정사유, 비고 정보를
									제공합니다.
								</caption>
								<colgroup>
									<col style="width: 100px" />
									<col style="width: auto" />
								</colgroup>
								<tbody>
									<tr>
										<th scope="row">그룹번호</th>
										<td class="text-left">{{ groupDetailArr[0].mngGrpCd }}</td>
									</tr>
									<tr>
										<th scope="row">사업명</th>
										<td class="text-left">{{ groupDetailArr[0].mngGrpNm }}</td>
									</tr>
									<tr>
										<th scope="row">소재지</th>
										<td class="text-left">{{ groupDetailArr[0].mngAddr }}</td>
									</tr>
									<tr>
										<th scope="row">면적</th>
										<td class="text-left">{{ groupDetailArr[0].mngArea }}㎡</td>
									</tr>
									<tr>
										<th scope="row">사업부서</th>
										<td class="text-left">{{ groupDetailArr[0].mngDeptNm }}</td>
									</tr>
									<tr>
										<th scope="row">지정공고일</th>
										<td v-if="!groupDetailArr[0].notiDt2 && !groupDetailArr[0].notiDt3" class="text-left">
											{{ groupDetailArr[0].notiDt1 }}
										</td>
										<td v-else-if="groupDetailArr[0].notiDt2 && !groupDetailArr[0].notiDt3" class="text-left">
											{{ groupDetailArr[0].notiDt1 }} / {{ groupDetailArr[0].notiDt2 }}
										</td>
										<td v-else-if="groupDetailArr[0].notiDt2 && groupDetailArr[0].notiDt3" class="text-left">
											{{ groupDetailArr[0].notiDt1 }} / {{ groupDetailArr[0].notiDt2 }} /
											{{ groupDetailArr[0].notiDt3 }}
										</td>
									</tr>
									<tr>
										<th scope="row">지정기간</th>
										<td class="text-left">{{ groupDetailArr[0].mngStartDt }} ~ {{ groupDetailArr[0].mngCloseDt }}</td>
									</tr>
									<tr>
										<th scope="row">지정사유</th>
										<td class="text-left">{{ groupDetailArr[0].appointReason }}</td>
									</tr>
									<tr>
										<th scope="row">비고</th>
										<td class="text-left">{{ groupDetailArr[0].mngEtc }}</td>
									</tr>
								</tbody>
							</table>

							<div class="tit">참고도면</div>
							<div
								v-if="groupDetailArr[0].mngGrpImgNm === '.png' || groupDetailArr[0].mngGrpImgNm == null"
								style="margin-top: 180px; font-size: medium"
							>
								<span>참고도면 이미지가 없습니다.</span>
							</div>
							<div v-else>
								<img :src="groupImageSrc" style="width: 600px; height: 385px" />
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
	<Loading v-if="isLoading" :title="loadingText.title" :subTitle="loadingText.subTitle" />
</template>

<script>
import { onMounted, ref, watch, reactive, computed } from 'vue'
import { useAreaStore } from '@/stores/area'
import { useModalStore } from '@/stores/modal'
import areaApi from '@/api/area'
import { monitorBottom as BottomListApi } from '@/api/monitor'
import Pagination from '@/components/Pagination.vue'
import Loading from '@/components/Loading.vue'
import dayjs from 'dayjs'
import * as echarts from 'echarts'
import Spinner from '@/components/Spinner.vue'
import axios from 'axios'
import wgTools from '@/composition/wgTools'

export default {
	components: {
		Spinner,
		Pagination,
		Loading,
	},
	props: {
		isPopupShow: {
			type: Boolean,
			default: false,
		},
		clickedGroupCd: {
			type: String,
			default: '',
		},
		clickedGroupNm: {
			type: String,
			default: '',
		},
	},
	emits: ['closePopup'],
	setup(props, { emit }) {
		onMounted(async () => {
			areaStore.setGroupStatType('price')
			await getStatForClickedGroup(areaStore.clickedGroup)
			await onBusinessInfoClick()
			$('#areaGroupPopup').draggable({
				containment: 'body',
				scroll: false,
				handle: '.head',
			})
		})

		const areaStore = useAreaStore()
		const modalStore = useModalStore()
		const statTab = ref(true)
		const groupTab = ref(false)
		const priceTab = ref(true)
		const areaTab = ref(false)
		const volumeTab = ref(false)
		const isDraw = ref(false)
		const isPriceChart = ref(true)
		const isAreaChart = ref(false)
		const isTradeChart = ref(false)
		const statDataArray = ref([])
		const tradeArray = ref([])
		const monthListArray = ref([])
		const monthDataArray = ref([])
		const standMonthText = ref(dayjs(areaStore.groupPopStandMonth).format('YYYY-MM'))
		const prevMonthText = ref(dayjs(areaStore.groupPopStandMonth).subtract(11, 'month').format('YYYY-MM'))
		const subTextContent = ref('')
		const areaList = ref([])
		const areaName = ref('')
		const fieldCheck = ref(false)
		const diffInMonths = ref(0)
		const dataArray = ref([])
		const isKab = ref(true)
		const isRtms = ref(false)
		const dataOptionName = ref('')
		let isLoading = ref(false)
		let isBottomChartLoading = ref(false)
		let loadingText = {
			title: '잠시만 기다려주세요.',
			subTitle: '통계 자료를 불러오고 있습니다.',
		}
		const groupDetailArr = ref([
			{
				mngGrpCd: '',
				mngGrpNm: '',
				mngAddr: '',
				mngArea: '',
				mngDeptNm: '',
				notiDt1: '',
				notiDt2: '',
				notiDt3: '',
				mngStartDt: '',
				mngCloseDt: '',
				appointReason: '',
				mngEtc: '',
				mngGrpImgNm: '',
			},
		])
		// 페이징 정보
		let pagination = reactive({
			page: 1,
			size: 10,
			unitPage: 5,
			totalCount: 0,
		})
		let selectedLayer = null
		let areaFieldGroupLayer = null
		watch(
			() => areaStore.groupPopStandMonth,
			() => {
				if (areaStore.groupPopStandMonth > dayjs().format('YYYY-MM')) {
					modalStore.showAlert('종료일은 현재 달을 초과할 수 없습니다.')
					areaStore.setGroupPopStandMonth(dayjs().format('YYYY-MM'))
				}
				if (areaStore.groupPopStandPreMonth > areaStore.groupPopStandMonth) {
					modalStore.showAlert('시작일은 종료일을 초과할 수 없습니다.')
					areaStore.setGroupPopStandMonth(
						dayjs(areaStore.groupPopStandPreMonth)
							.add(diffInMonths.value - 1, 'month')
							.format('YYYY-MM')
					)
				}
				const endDate = new Date(areaStore.groupPopStandMonth)
				const startDate = new Date(areaStore.groupPopStandPreMonth)

				diffInMonths.value =
					endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear()) + 1
				const standMonth = areaStore.groupPopStandMonth
				if (diffInMonths.value > 36) {
					modalStore.showAlert('검색 가능 최대 기간은 3년입니다.')
					if (dayjs(areaStore.groupPopStandPreMonth).add(36, 'month').format('YYYY-MM') < dayjs().format('YYYY-MM')) {
						areaStore.setGroupPopStandMonth(dayjs(areaStore.groupPopStandPreMonth).add(35, 'month').format('YYYY-MM'))
					} else {
						areaStore.setGroupPopStandMonth(dayjs().format('YYYY-MM'))
					}
					return
				}
				monthListArray.value = []
				for (let k = 0; k < diffInMonths.value; k++) {
					let inputMonth = dayjs(areaStore.groupPopStandMonth).subtract(k, 'month').format('YYYY-MM')
					monthListArray.value.push(inputMonth)
				}
				if (isTradeChart.value == true) {
					getTradeInfo()
				}
				getStatForClickedGroup(areaStore.clickedGroup)
			}
		)

		watch(
			() => areaStore.groupPopStandPreMonth,
			() => {
				if (areaStore.groupPopStandPreMonth > areaStore.groupPopStandMonth) {
					modalStore.showAlert('시작일은 종료일을 초과할 수 없습니다.')
					areaStore.setGroupPopStandPreMonth(
						dayjs(areaStore.groupPopStandMonth)
							.subtract(diffInMonths.value - 1, 'month')
							.format('YYYY-MM')
					)
				}
				const endDate = new Date(areaStore.groupPopStandMonth)
				const startDate = new Date(areaStore.groupPopStandPreMonth)

				diffInMonths.value =
					endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear()) + 1

				//const standMonth = areaStore.groupPopStandMonth
				if (diffInMonths.value > 36) {
					modalStore.showAlert('검색 가능 최대 기간은 3년입니다.')
					areaStore.setGroupPopStandPreMonth(
						dayjs(areaStore.groupPopStandMonth).subtract(35, 'month').format('YYYY-MM')
					)
				}
				monthListArray.value = []
				for (let k = 0; k < diffInMonths.value; k++) {
					let inputMonth = dayjs(areaStore.groupPopStandMonth).subtract(k, 'month').format('YYYY-MM')
					monthListArray.value.push(inputMonth)
				}
				getStatForClickedGroup(areaStore.clickedGroup)
				if (isTradeChart.value == true) {
					getTradeInfo()
				}
			}
		)

		watch(
			() => areaStore.groupStatType,
			() => {
				getStatForClickedGroup(areaStore.clickedGroup)
				onBusinessInfoClick()
				if (isTradeChart.value == true) {
					getTradeInfo()
				}
			}
		)

		watch(
			() => areaStore.dataOption,
			() => {
				getStatForClickedGroup(areaStore.clickedGroup)
				onBusinessInfoClick()
				if (isTradeChart.value == true) {
					getTradeInfo()
				}
			}
		)

		watch(
			() => areaStore.clickedGroup,
			() => {
				getStatForClickedGroup(areaStore.clickedGroup)
				onBusinessInfoClick()
				getAreaFeatureInfo()
			}
		)

		const groupImageSrc = computed(
			() =>
				`${import.meta.env.VITE_BI_PROTOCOL}://${import.meta.env.VITE_BI_HOST}:${
					import.meta.env.VITE_BI_PORT
				}/reports/WEB_IMAGES/` + groupDetailArr.value[0].mngGrpImgNm
		)
		const getStatForClickedGroup = async (clickedGroupCd) => {
			isLoading.value = true
			const endDate = new Date(areaStore.groupPopStandMonth)
			const startDate = new Date(areaStore.groupPopStandPreMonth)

			diffInMonths.value =
				endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear()) + 1
			monthListArray.value = []
			monthDataArray.value = []
			for (let k = 0; k < diffInMonths.value; k++) {
				let inputMonth = dayjs(areaStore.groupPopStandMonth).subtract(k, 'month').format('YYYY-MM')
				let dataForMonth = dayjs(areaStore.groupPopStandMonth).subtract(k, 'month').format('YYYY-MM').replace('-', '')
				monthListArray.value.push(inputMonth)
				monthDataArray.value.push(dataForMonth)
			}
			const params = {
				standardDate: areaStore.groupPopStandMonth.replace('-', ''),
				statType: areaStore.groupStatType,
				dataOption: areaStore.dataOption,
				mngGrpCd: clickedGroupCd,
				diffMonth: diffInMonths.value,
				fieldCheck: fieldCheck.value,
			}
			const { data } = await areaApi.getGroupStat(params, monthDataArray.value)
			statDataArray.value = data
			if (data.length > 0) {
				isDraw.value = true
				drawChart(data)
			}
			isLoading.value = false
		}

		/* const update = () => {
			const presentDate = standMonthText.value
			areaStore.setGroupPopStandMonth(dayjs(prevMonthText.value).add(11, 'month').format('YYYY-MM'))
			if (areaStore.groupPopStandMonth > dayjs().format('YYYY-MM')) {
				modalStore.showAlert('종료일은 현재 달을 초과할 수 없습니다.')
				areaStore.setGroupPopStandMonth(presentDate)
				prevMonthText.value = dayjs(areaStore.groupPopStandMonth).subtract(11, 'month').format('YYYY-MM')
				return
			}
		} */

		const getParamString = (params) => {
			return Object.keys(params)
				.map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
				.join('&')
		}
		//필드 리스트 삭제된 필드 허부
		const onFieldDeleteCheck = async (event) => {
			let groupCd = areaStore.clickedGroup
			if (isAreaChart.value == true) {
				getAreaFeatureInfo()
			}
			if (isTradeChart.value == true) {
				getTradeInfo()
			}
			if (isAreaChart.value == false || isTradeChart.value == false) {
				getStatForClickedGroup(areaStore.clickedGroup)
			}
			const fieldChecked = event.target.checked
			if (fieldChecked) {
				const paramsForArea = {
					service: 'WFS',
					version: '1.0.0',
					request: 'GetFeature',
					typeName: 'spta:GIS_PERM_AREA',
					outputformat: 'application/json',
					format_options: 'CHARSET:EUC-KR',
					cql_filter: `MNG_GRP_CD='${groupCd}'AND IMP_FILE='N'`,
				}

				const areaObjectInfo = await axios.get('/gis/wfs?' + getParamString(paramsForArea))
				const geometry = areaObjectInfo.data.features.map((item) => item.geometry)
				selectedLayer = WGMap.getLayerById('areaFieldGroup')
				if (!selectedLayer) {
					const source = new wg.source.Vector()
					selectedLayer = new wg.layer.Vector({
						id: 'areaFieldGroup',
						source: source,
						style: new wg.style.Style({
							stroke: new wg.style.Stroke({
								color: '#f00',
								width: 3,
							}),
						}),
						visible: true,
						zIndex: 7,
					})
					geometry.forEach((geom) => {
						let feature = new wg.format.GeoJSON().readFeature(geom)
						//feature.getGeometry().transform('EPSG:4326', 'EPSG:3857')
						source.addFeature(feature)
					})
					WGMap.addLayer(selectedLayer)
				} else {
					const newVectorSource = new wg.source.Vector()
					geometry.forEach((geom) => {
						let feature = new wg.format.GeoJSON().readFeature(geom)
						//feature.getGeometry().transform('EPSG:4326', 'EPSG:3857')
						newVectorSource.addFeature(feature)
					})
					selectedLayer.setSource(newVectorSource)
				}
			} else {
				WGMap.removeLayer(selectedLayer)
			}
		}
		// 차트 그리기
		const drawChart = (statData) => {
			let monthArr = new Array(diffInMonths.value)
			monthArr[diffInMonths.value - 1] = areaStore.groupPopStandMonth.replace('-', '')
			const timeStandard = dayjs(areaStore.groupPopStandMonth)
			for (let k = 1; k < diffInMonths.value; k++) {
				let prevDate = timeStandard.subtract(k, 'month')
				if (k == diffInMonths.value - 1) {
					monthArr[0] = areaStore.groupPopStandPreMonth
				} else {
					monthArr[k] = ''
				}
			}

			dataArray.value = []
			for (let j = 1; j < diffInMonths.value + 1; j++) {
				let as = 'm' + (diffInMonths.value - j)
				dataArray.value.push(statData[0][as])
			}

			if (areaStore.groupStatType === 'price') {
				subTextContent.value = '평균가격'
			} else if (areaStore.groupStatType === 'area') {
				subTextContent.value = '1㎡가격'
			} else if (areaStore.groupStatType === 'volume') {
				subTextContent.value = '거래량'
			}

			const option = {
				/* grid: {
					right: 10,
				}, */
				xAxis: {
					type: 'category',
					name: statData[0].mngGrpNm,
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
					axisLabel: {
						show: false, // Y 축 레이블 숨김
					},
					splitLine: {
						show: false,
					},
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
			const chartSpace = document.getElementById('chartSpace')
			if (chartSpace) {
				echarts.dispose(chartSpace)
			}
			const element = document.getElementById('chartSpace')
			const chart = echarts.init(element)
			chart.setOption(option)
		}
		const onTypeClick = (event) => {
			if (event.target.id === 'priceChart') {
				priceTab.value = true
				areaTab.value = false
				volumeTab.value = false
				areaStore.setGroupStatType('price')
			} else if (event.target.id === 'areaChart') {
				priceTab.value = false
				areaTab.value = true
				volumeTab.value = false
				areaStore.setGroupStatType('area')
			} else if (event.target.id === 'volumeChart') {
				priceTab.value = false
				areaTab.value = false
				volumeTab.value = true
				areaStore.setGroupStatType('volume')
			}
		}
		const closePoupClick = () => {
			const areaFeatureLayer = WGMap.getLayerById('areaFeatureLayer')
			const areaFieldGroup = WGMap.getLayerById('areaFieldGroup')
			if (areaFeatureLayer) {
				const layerSource = areaFeatureLayer.getSource()
				if (layerSource) {
					layerSource.clear()
				}
			}

			if (areaFieldGroup) {
				const layerFieldSource = areaFieldGroup.getSource()
				if (layerFieldSource) {
					layerFieldSource.clear()
				}
			}

			emit('closePopup')
		}
		const onTabClick = (event) => {
			if (event.target.id === 'statTab') {
				statTab.value = true
				groupTab.value = false
			} else if (event.target.id === 'groupTab') {
				statTab.value = false
				groupTab.value = true
			}
		}

		const onBottomListClick = (event) => {
			if (event.target.id === 'priceChart') {
				isPriceChart.value = true
				isAreaChart.value = false
				isTradeChart.value = false
			} else if (event.target.id === 'areaChart') {
				isPriceChart.value = false
				isAreaChart.value = true
				isTradeChart.value = false
				getAreaFeatureInfo()
			} else if (event.target.id === 'tradeChart') {
				isPriceChart.value = false
				isAreaChart.value = false
				isTradeChart.value = true
				getTradeInfo()
			}
		}

		const getAreaFeatureInfo = async (pageNum = 1) => {
			isBottomChartLoading.value = true
			pagination.totalCount = 0
			pagination.page = pageNum
			areaList.value = []
			const { data } = await areaApi.getGroupFeatureInfo(areaStore.clickedGroup, fieldCheck.value, pagination)
			pagination = reactive(Object.assign(pagination, data.pagination))
			if (data.contents.length > 0) {
				areaList.value = data.contents
				areaName.value = data.contents[0].mngGrpNm
			}
			isBottomChartLoading.value = false
		}

		const onAreaTrClick = async (event, pnu) => {
			const activeTr = document.querySelectorAll('tr.active')

			for (let i = 0; i < activeTr.length; i++) {
				activeTr[i].classList.remove('active')
			}
			event.target.parentElement.classList.add('active')

			const { data } = await BottomListApi.getGeometryByPnu(pnu)
			let coordiToGeometry
			if (data.geometry.type == 'Polygon') {
				coordiToGeometry = new wg.geom.Polygon(data.geometry.coordinates)
			} else if (data.geometry.type == 'MultiPolygon') {
				coordiToGeometry = new wg.geom.MultiPolygon(data.geometry.coordinates)
			}
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

		const getTradeInfo = async (pageNum = 1) => {
			isLoading.value = true
			const params = {
				dataOption: areaStore.dataOption,
				standardDate: areaStore.groupPopStandMonth.replace('-', ''),
				prevDate: areaStore.groupPopStandPreMonth.replace('-', ''),
				groupCd: areaStore.clickedGroup,
				fieldCheck: fieldCheck.value,
			}
			pagination.totalCount = 0
			pagination.page = pageNum
			const { data, status } = await areaApi.selectAreaTradeList(params, pagination)
			if (status.code === 200) {
				pagination = reactive(Object.assign(pagination, data.pagination))
				tradeArray.value = data.contents
			} else {
				pagination = reactive(Object.assign(pagination, { totalCount: 0, page: 1, pageSize: 10 }))
				tradeArray.value = []
			}
			// pagination = reactive(Object.assign(pagination, data.pagination))
			// tradeArray.value = data.contents
			isLoading.value = false
		}

		const getTradeExcel = async () => {
			isLoading.value = true
			const params = {
				dataOption: areaStore.dataOption,
				standardDate: areaStore.groupPopStandMonth.replace('-', ''),
				prevDate: areaStore.groupPopStandPreMonth.replace('-', ''),
				groupCd: areaStore.clickedGroup,
				fieldCheck: fieldCheck.value,
			}
			const { status, data } = await areaApi.selectAreaTradeExcel(params)
			const url = window.URL.createObjectURL(data)
			var link = document.createElement('a')
			link.href = url

			let popupName = '허가구역 상세정보-'
			if (areaStore.dataOption === 'kab') {
				dataOptionName.value = '실거래공개-거래리스트'
			} else if (areaStore.dataOption === 'rtms') {
				dataOptionName.value = '자치구RTMS-거래리스트'
			}
			let fileName = popupName + dataOptionName.value

			link.download = fileName + '.xlsx'

			link.click()
			if (status.code === 200) {
				isLoading.value = false
				modalStore.showToast('success', `거래리스트 다운로드를 완료하였습니다.`)
			} else {
				modalStore.showToast('error', `거래리스트 다운로드에 실패하였습니다.`)
			}
		}

		const onBusinessInfoClick = async () => {
			const { data } = await areaApi.getGroupDetailInfo(areaStore.clickedGroup)
			groupDetailArr.value = data
		}

		const onExcelDownClick = async () => {
			isLoading.value = true
			const { data } = await areaApi.groupDetailExcel(areaStore.clickedGroup, fieldCheck.value)

			const url = window.URL.createObjectURL(data)
			var link = document.createElement('a')

			link.href = url
			let popupName = '허가구역 상세정보-'
			if (areaStore.dataOption === 'kab') {
				dataOptionName.value = '필지리스트'
			} else if (areaStore.dataOption === 'rtms') {
				dataOptionName.value = '필지리스트'
			}
			let fileName = popupName + dataOptionName.value

			link.download = fileName + '.xlsx'
			//link.download = '공간영역 토지 조서-' + groupDetailArr.value[0].mngGrpNm + '.xlsx'
			link.click()
			isLoading.value = false
		}

		const formatNumber = (amount) => {
			if (amount === 0) {
				return amount
			}

			const amountStr = amount.toString()
			const length = amountStr.length

			let result = ''
			if (priceTab.value == true) {
				if (areaStore.dataOption === 'kab') {
					if (length > 4) {
						const milloinStr = amountStr.slice(-4).replace(/(^0+)/, '')
						if (milloinStr.length != 0) {
							result = amountStr.slice(0, -4) + '억' + milloinStr.slice(-4) + '만'
						} else {
							result = amountStr.slice(0, -4) + '억'
						}
					} else {
						result = amount + '만'
					}
					return result
				} else if (areaStore.dataOption === 'rtms') {
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
				if (areaStore.dataOption === 'kab') {
					if (length > 4) {
						const milloinStr = amountStr.slice(-4).replace(/(^0+)/, '')
						if (milloinStr.length != 0) {
							result = amountStr.slice(0, -4) + '억' + milloinStr.slice(-4) + '만'
						} else {
							result = amountStr.slice(0, -4) + '억'
						}
					} else {
						result = amount + '만'
					}
					return result
				} else if (areaStore.dataOption === 'rtms') {
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
		return {
			onTabClick,
			closePoupClick,
			onTypeClick,
			onBottomListClick,
			getAreaFeatureInfo,
			onAreaTrClick,
			onBusinessInfoClick,
			onExcelDownClick,
			formatNumber,
			onFieldDeleteCheck,
			groupImageSrc,
			statTab,
			groupTab,
			priceTab,
			areaTab,
			volumeTab,
			standMonthText,
			prevMonthText,
			statDataArray,
			monthListArray,
			subTextContent,
			isPriceChart,
			isAreaChart,
			pagination,
			areaList,
			groupDetailArr,
			areaName,
			isLoading,
			isBottomChartLoading,
			loadingText,
			areaStore,
			fieldCheck,
			dataArray,
			diffInMonths,
			monthDataArray,
			getTradeInfo,
			getTradeExcel,
			isTradeChart,
			tradeArray,
			isKab,
			isRtms,
		}
	},
}
</script>

<style scoped>
.layer-popup .body {
	min-height: 680px;
	/* min-width: 850px; */
}
a {
	cursor: pointer;
}
.average-price {
	height: auto;
	max-height: 369px;
}

.head {
	cursor: move;
}
.groupName {
	margin-bottom: 15px;
	text-align: center;
	font-size: 20px;
}
.action-btn-group {
	margin-top: 10px !important;
}
.form-control {
	width: 25%;
}
.red-text {
	color: red;
}
</style>
