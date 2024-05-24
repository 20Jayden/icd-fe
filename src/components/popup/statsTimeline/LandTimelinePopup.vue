<template>
	<div class="time-series layer-popup show">
		<div class="head">
			<div class="tit">시계열</div>
			<a class="btn-close" @click="$emit('close')"><span>팝업창 닫기</span></a>
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
						<div class="form-group form-date">
							<label class="lable">조회기간</label>
							<template v-if="['priceIndex', 'dealIndex'].includes(activeTimeline.id)">
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
					:isPercent="chartIsPercent"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import dayjs from 'dayjs'
import landTrendApi from '@/api/landTrend'
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
		let chartIsPercent = ref(false)
		// 선택된 실계열
		let activeTimeline = ref({})

		let timelines = ref([
			// 가격변동률 현황
			{ group: 'landPriceRate', type: 'yearLineChart', id: 'priceRate1', title: '지가변동률 추이' },
			{ group: 'landPriceRate', type: 'compareBarLineChart', id: 'priceIndex', title: '지가변동률(가격지수)비교 추이' },
			// 가격지수 현황
			{ group: 'buildingDealIndex', type: 'compareLineLineChart', id: 'dealIndex', title: '거래건수 추이' },
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
					statYm: props.searchParams.statCmpYmTmp?.replace('-', ''),
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

			if (!timelineParams.statYmTmp) {
				timelineParams.statYmTmp = dayjs().format('YYYY-MM')
			}

			if (activeTimeline.value.id === 'priceRate1') {
				timelineParams.bjdCd = '1100000000'
				timelineParams.statYm = timelineParams.statYmTmp?.replace('-', '')

				const { data } = await landTrendApi.getTimelineLandPriceRate(timelineParams)

				chartColumn.value = undefined
				chartData.value = data.map((d) => {
					return [d.year, d.m1, d.m2, d.m3, d.m4, d.m5, d.m6, d.m7, d.m8, d.m9, d.m10, d.m11, d.m12]
				})
			} else if (activeTimeline.value.id === 'priceIndex') {
				timelineParams.bjdCd = '1100000000'
				timelineParams.statYm = timelineParams.statYmTmp.replace('-', '')

				// 비교년월
				if (!timelineParams.statCmpYmTmp) {
					timelineParams.statCmpYmTmp = `${timelineParams.statYm.substring(0, 4)}-01`
					timelineParams.statCmpYm = `${timelineParams.statYm.substring(0, 4)}01`
				} else {
					timelineParams.statCmpYm = timelineParams.statCmpYmTmp.replace('-', '')
				}

				const { data } = await landTrendApi.getTimelineLandPriceIndex(timelineParams)

				chartColumn.value = data.map((d) => d.statYm)
				chartData.value = [data.map((d) => d.changeRt), data.map((d) => d.indices)]
				chartDataLabel.value = ['변동률', '지수']
			} else if (activeTimeline.value.id === 'dealIndex') {
				// 지역별 토지, 건축물 거래 추이
				timelineParams.statYm = timelineParams.statYmTmp.replace('-', '')

				// 비교년월
				if (!timelineParams.statCmpYmTmp) {
					timelineParams.statCmpYmTmp = `${timelineParams.statYm.substring(0, 4)}-01`
					timelineParams.statCmpYm = `${timelineParams.statYm.substring(0, 4)}01`
				} else {
					timelineParams.statCmpYm = timelineParams.statCmpYmTmp.replace('-', '')
				}

				const { data } = await landTrendApi.getTimelineLandDealIndex(timelineParams)

				const capitalData = data.filter((d) => d.bjdCd === '1000000000')
				const seoulData = data.filter((d) => d.bjdCd === '1100000000')
				chartColumn.value = capitalData.map((d) => d.statYm)
				chartData.value = [capitalData.map((d) => d.cnt), seoulData.map((d) => d.cnt)]
				chartIsPercent.value = true
				chartDataLabel.value = ['수도권', '서울특별시']
			}
		}

		// 시계열 초기화
		const onReset = async () => {
			timelineParams.statYmTmp = dayjs().format('YYYY-MM')
			timelineParams.statCmpYmTmp = ''

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
			timelines,
			timelineParams,
			onSearch,
			chartIsPercent,
			onReset,
		}
	},
}
</script>

<style scoped>
.form-date {
	max-width: 380px;
}
a {
	cursor: pointer;
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
