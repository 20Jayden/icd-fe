<template>
	<div class="time-series layer-popup show">
		<div class="head">
			<div class="tit">시계열</div>
			<a href="#" class="btn-close" @click="$emit('close')"><span>팝업창 닫기</span></a>
		</div>
		<div class="body">
			<form class="search-condition">
				<fieldset>
					<legend>검색조건</legend>
					<div class="tr">
						<div class="form-group">
							<select class="form-control" @change="onSearch($event.target.value)">
								<option v-for="(tm, idx) in timelines.filter((t) => t.group === layerId)" :key="idx" :value="tm.id">
									{{ tm.title }}
								</option>
							</select>
						</div>
						<div
							v-if="['aptPriceRate', 'rebuildAptPriceRate'].includes(activeTimeline.group)"
							class="form-group form-date"
						>
							<label class="lable">조회기간</label>
							<template v-if="activeTimeline.id === 'rebuildAptPriceRate1'">
								<input type="week" class="form-control" v-model="timelineParams.statCmpWkTmp" />
								<div class="hyphen">~</div>
							</template>
							<template v-if="true">
								<input type="week" class="form-control" v-model="timelineParams.statWkTmp" />
							</template>
						</div>
						<div v-else class="form-group form-date">
							<label class="lable">조회기간</label>
							<template v-if="['priceRate2', 'rtmsPriceRate2'].includes(activeTimeline.id)">
								<input type="month" class="form-control" v-model="timelineParams.statCmpYmTmp" />
								<div class="hyphen">~</div>
							</template>
							<template v-if="true">
								<input type="month" class="form-control" v-model="timelineParams.statYmTmp" />
							</template>
						</div>
						<div class="action-btn-group">
							<button type="button" class="btn btn-dark" @click="onReset()"><i class="ico ico-reset"></i>초기화</button>
							<button type="button" class="btn btn-primary" @click="onSearch(activeTimeline.id)">
								<i class="ico ico-search"></i>조회
							</button>
						</div>
					</div>
				</fieldset>
			</form>

			<div class="tit">
				<span ref="timelineTitle">{{ activeTimeline.title }}</span>
				<a
					style="cursor: pointer; margin-left: 5px"
					v-if="
						activeTimeline.id === 'rebuildAptPriceRate1' &&
						timelineParams.bjdCd &&
						timelineParams.bjdCd !== '1100000000'
					"
					@click="
						() => {
							timelineParams.bjdCd = '1100000000'
							onSearch(activeTimeline.id)
						}
					"
					>X</a
				>
			</div>
			<div>
				<YearLineChart v-if="activeTimeline.type === 'yearLineChart'" :column="chartColumn" :data="chartData" />
				<CompareBarLineChart
					v-if="activeTimeline.type === 'compareBarLineChart'"
					:column="chartColumn"
					:data="chartData"
					:dataLabel="chartDataLabel"
				/>
				<WeekOfYearLineChart
					v-if="activeTimeline.type === 'weekOfYearLineChart'"
					:column="chartColumn"
					:data="chartData"
				/>
				<CompareLineLineChart
					v-if="activeTimeline.type === 'compareLineLineChart'"
					:column="chartColumn"
					:data="chartData"
					:dataLabel="chartDataLabel"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import dayjs from 'dayjs'
import houseTrendApi from '@/api/houseTrend'
import YearLineChart from '@/components/chart/timeline/YearLineChart.vue'
import CompareBarLineChart from '@/components/chart/timeline/CompareBarLineChart.vue'
import WeekOfYearLineChart from '@/components/chart/timeline/WeekOfYearLineChart.vue'
import CompareLineLineChart from '@/components/chart/timeline/CompareLineLineChart.vue'

export default {
	components: {
		YearLineChart,
		CompareBarLineChart,
		WeekOfYearLineChart,
		CompareLineLineChart,
	},
	props: {
		layerId: {
			type: String,
			default: '',
		},
		searchParams: {
			type: Object,
			default: () => {},
		},
	},
	setup(props) {
		let chartColumn = ref([])
		let chartData = ref([])
		let chartDataLabel = ref([])

		// 선택된 시계열
		let activeTimeline = ref({})

		let timelines = ref([
			// 가격변동률 현황
			{ group: 'priceRate', type: 'yearLineChart', id: 'priceRate1', title: '가격변동률 추이' },
			{ group: 'priceRate', type: 'compareBarLineChart', id: 'priceRate2', title: '가격변동률(가격지수)비교 추이' },
			// 가격지수 현황
			{ group: 'priceIndex', type: 'yearLineChart', id: 'priceIndex1', title: '가격지수 추이' },
			// 실거래 가격변동률 현황
			{ group: 'rtmsPriceRate', type: 'yearLineChart', id: 'rtmsPriceRate1', title: '실거래 가격변동률 추이' },
			// eslint-disable-next-line prettier/prettier
			{ group: 'rtmsPriceRate', type: 'compareBarLineChart', id: 'rtmsPriceRate2', title: '실거래 가격변동률(가격지수)비교 추이' },
			// 실거래 가격지수 현황
			{ group: 'rtmsPriceIndex', type: 'yearLineChart', id: 'rtmsPriceIndex1', title: '실거래 가격지수 추이' },
			// 아파트 가격변동률 현황
			{ group: 'aptPriceRate', type: 'weekOfYearLineChart', id: 'aptPriceRate1', title: '아파트 가격변동률 추이' },
			// 재건축vs일반아파트 가격변동률 현황
			// eslint-disable-next-line prettier/prettier
			{ group: 'rebuildAptPriceRate', type: 'compareLineLineChart', id: 'rebuildAptPriceRate1', title: '재건축 VS 일반 아파트 가격변동률 추이' },
		])

		// 시계열 조회 파라미터
		let timelineParams = reactive({})

		// 시계열팝업 제목 엘리먼트
		let timelineTitle = ref(null)

		onMounted(() => {
			Object.assign(timelineParams, props.searchParams, { statYm: props.searchParams.statYmTmp?.replace('-', '') })
			onSearch()
			addEventHandler()
		})

		// 통계레이어가 변경되면 시계열 첫번째레이어 활성화 및 조회
		watch(
			() => props.layerId,
			() => {
				onSearch()
			}
		)

		// 통계레이어 조회조건이 변경되면 시계열 조회
		watch(
			() => props.searchParams,
			() => {
				Object.assign(timelineParams, props.searchParams, {
					statYm: props.searchParams.statYmTmp?.replace('-', ''),
					statWk: props.searchParams.statWkTmp?.replace('-', ''),
				})
				onSearch(activeTimeline.value?.id)
			},
			{ deep: true }
		)

		const onSearch = async (id) => {
			if (id) {
				activeTimeline.value = timelines.value.filter((tm) => tm.id === id)[0]
			} else {
				activeTimeline.value = timelines.value.filter((tm) => tm.group === props.layerId)[0]
			}

			// 통계조건 패널을 안열은경우 현재날짜 디폴트값 부여
			if (!timelineParams.statYmTmp) {
				timelineParams.statYmTmp = dayjs().format('YYYY-MM')
			}
			if (!timelineParams.statWkTmp) {
				let d = dayjs()
				timelineParams.statWkTmp = `${d.isoWeekYear()}-W${d.isoWeek().toString().padStart(2, '0')}`
			}

			// 가격변동률 > 가격변동률 추이
			if (activeTimeline.value.id === 'priceRate1') {
				timelineParams.statType = '1' // 1: 변동률, 2: 지수
				timelineParams.bjdCd = '1100000000'
				timelineParams.statYm = timelineParams.statYmTmp?.replace('-', '')

				const { data } = await houseTrendApi.getTimelinePriceRate(timelineParams)

				chartColumn.value = undefined
				chartData.value = data.map((d) => {
					return [d.year, d.m1, d.m2, d.m3, d.m4, d.m5, d.m6, d.m7, d.m8, d.m9, d.m10, d.m11, d.m12]
				})
			}
			// 가격변동률 > 가격변동률(가격지수) 비교 추이
			else if (activeTimeline.value.id === 'priceRate2') {
				timelineParams.bjdCd = '1100000000'
				timelineParams.statYm = timelineParams.statYmTmp.replace('-', '')
				// 비교년월
				if (!timelineParams.statCmpYmTmp) {
					timelineParams.statCmpYmTmp = `${timelineParams.statYm.substring(0, 4)}-01`
					timelineParams.statCmpYm = `${timelineParams.statYm.substring(0, 4)}01`
				} else {
					timelineParams.statCmpYm = timelineParams.statCmpYmTmp.replace('-', '')
				}

				const { data } = await houseTrendApi.getTimelinePriceRateCompare(timelineParams)

				chartColumn.value = data.map((d) => d.statYm)
				chartData.value = [data.map((d) => d.changeRt), data.map((d) => d.indices)]
			}
			// 가격지수 > 가격지수 추이
			else if (activeTimeline.value.id === 'priceIndex1') {
				timelineParams.statType = '2' // 1: 변동률, 2: 지수
				timelineParams.bjdCd = '1100000000'
				timelineParams.statYm = timelineParams.statYmTmp.replace('-', '')

				const { data } = await houseTrendApi.getTimelinePriceRate(timelineParams)

				chartColumn.value = undefined
				chartData.value = data.map((d) => {
					return [d.year, d.m1, d.m2, d.m3, d.m4, d.m5, d.m6, d.m7, d.m8, d.m9, d.m10, d.m11, d.m12]
				})
			}
			// 실거래 가격변동률 > 실거래 가격변동률 추이
			else if (activeTimeline.value.id === 'rtmsPriceRate1') {
				timelineParams.statType = '1' // 1: 변동률, 2: 지수
				timelineParams.bjdCd = '1100000000'
				timelineParams.statYm = timelineParams.statYmTmp.replace('-', '')

				const { data } = await houseTrendApi.getTimelineRtmsPriceRate(timelineParams)

				chartColumn.value = undefined
				chartData.value = data.map((d) => {
					return [d.year, d.m1, d.m2, d.m3, d.m4, d.m5, d.m6, d.m7, d.m8, d.m9, d.m10, d.m11, d.m12]
				})
			}
			// 실거래 가격변동률 > 실거래 가격변동률(가격지수) 비교 추이
			else if (activeTimeline.value.id === 'rtmsPriceRate2') {
				timelineParams.bjdCd = '1100000000'
				timelineParams.statYm = timelineParams.statYmTmp.replace('-', '')
				// 비교년월
				if (!timelineParams.statCmpYmTmp) {
					timelineParams.statCmpYmTmp = `${timelineParams.statYm.substring(0, 4)}-01`
					timelineParams.statCmpYm = `${timelineParams.statYm.substring(0, 4)}01`
				} else {
					timelineParams.statCmpYm = timelineParams.statCmpYmTmp.replace('-', '')
				}

				const { data } = await houseTrendApi.getTimelineRtmsPriceRateCompare(timelineParams)

				chartColumn.value = data.map((d) => d.statYm)
				chartData.value = [data.map((d) => d.changeRt), data.map((d) => d.indices)]
			}
			// 실거래 가격지수 > 실거래 가격지수 추이
			else if (activeTimeline.value.id === 'rtmsPriceIndex1') {
				timelineParams.statType = '2' // 1: 변동률, 2: 지수
				timelineParams.bjdCd = '1100000000'
				timelineParams.statYm = timelineParams.statYmTmp.replace('-', '')

				const { data } = await houseTrendApi.getTimelineRtmsPriceRate(timelineParams)

				chartColumn.value = undefined
				chartData.value = data.map((d) => {
					return [d.year, d.m1, d.m2, d.m3, d.m4, d.m5, d.m6, d.m7, d.m8, d.m9, d.m10, d.m11, d.m12]
				})
			}
			// 아파트 가격변동률 > 아파트 가격변동률 추이
			else if (activeTimeline.value.id === 'aptPriceRate1') {
				timelineParams.bjdCd = '1100000000'
				timelineParams.statWk = timelineParams.statWkTmp.replace('-', '')

				const { data } = await houseTrendApi.getTimelineAptPriceRate(timelineParams)

				chartColumn.value = undefined
				chartData.value = data.map((d) => Object.keys(d).map((k) => d[k]))
			}
			// 재건축vs일반아파트 가격변동률 > 재건축vs일반아파트 가격변동률 추이
			else if (activeTimeline.value.id === 'rebuildAptPriceRate1') {
				timelineParams.statWk = timelineParams.statWkTmp.replace('-', '')
				// 비교년월
				if (!timelineParams.statCmpWkTmp) {
					timelineParams.statCmpWkTmp = `${timelineParams.statWk.substring(0, 4)}-W01`
					timelineParams.statCmpWk = `${timelineParams.statWk.substring(0, 4)}W01`
				} else {
					timelineParams.statCmpWk = timelineParams.statCmpWkTmp.replace('-', '')
				}

				const { data } = await houseTrendApi.getTimelineRebuildAptPriceRate(timelineParams)

				chartColumn.value = data.map((d) => d.receiveDt)
				chartData.value = [data.map((d) => d.rebuildChgRt), data.map((d) => d.aptChgRt)]
				chartDataLabel.value = ['재건축', '일반아파트']

				if (data.length > 0) {
					let title = timelines.value.filter((tm) => tm.id === 'rebuildAptPriceRate1')[0].title
					timelineTitle.value.innerText = `${title} (${data[0].bjdNm})`
				}
			}

			console.log(chartData.value)
		}

		// 시계열 초기화
		const onReset = async () => {
			timelineParams.statYmTmp = dayjs().format('YYYY-MM')
			timelineParams.statWkTmp = ''
			timelineParams.statCmpWkTmp = ''
			timelineParams.statWk = ''
			timelineParams.statCmpWk = ''

			// 아파트 가격변동률 초기화
			if (activeTimeline.value.id === 'aptPriceRate1') {
				timelineParams.bjdCd = '1100000000'
				timelineParams.statYm = ''
			} else if (activeTimeline.value.id === 'rebuildAptPriceRate1') {
				// 재건축 vs 일반 아파트 가격변동률 현황 초기화
				timelineParams.statYm = ''
				timelineParams.statCmpYmTmp = ''
				timelineParams.statCmpYm = ''
			}

			await onSearch(activeTimeline.value?.id)
		}

		const addEventHandler = () => {
			$(function () {
				$('.time-series').draggable({ containment: 'body', scroll: false, handle: '.head' })
			})
		}
		return {
			chartData,
			chartColumn,
			chartDataLabel,
			activeTimeline,
			timelineTitle,
			// activeTimelineId,
			// activeTimelineTitle,
			// activeTimelineType,
			timelines,
			timelineParams,
			onSearch,
			onReset,
		}
	},
}
</script>

<style scoped>
.form-date {
	max-width: 380px;
}
/* select {
	max-width: 190px;
} */
.time-series {
	max-height: 400px;
}
.head {
	cursor: move;
}
</style>
