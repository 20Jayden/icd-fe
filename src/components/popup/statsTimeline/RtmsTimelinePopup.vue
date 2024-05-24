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
						<div class="form-group">
							<template v-if="activeTimeline.id === 'lawAuction1'">
								<label class="lable">조회기간</label>
								<input type="month" class="form-control" v-model="timelineParams.statCmpYmTmp" />
								<div class="hyphen">~</div>
							</template>
							<input type="month" class="form-control" v-model="timelineParams.statYmTmp" />
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
				<CompareBarBarLineChart
					v-if="activeTimeline.type === 'compareBarBarLineChart'"
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
import rtmsApi from '@/api/rtmsTrend'
import YearLineChart from '@/components/chart/timeline/YearLineChart.vue'
import CompareBarBarLineChart from '@/components/chart/timeline/CompareBarBarLineChart.vue'

export default {
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
	components: {
		YearLineChart,
		CompareBarBarLineChart,
	},
	setup(props) {
		// 선택된 시계열
		let activeTimeline = ref({})

		// 시계열 레이어
		let timelines = ref([
			{ group: 'rtmsPriceRate', type: 'yearLineChart', id: 'rtmsPriceRate1', title: '실거래 가격 변동률 추이' },
			{ group: 'rtmsTradeRate', type: 'yearLineChart', id: 'rtmsTradeRate1', title: '실거래 거래량 변동률 추이' },
			{ group: 'lawAuction', type: 'compareBarBarLineChart', id: 'lawAuction1', title: '법원 경매 정보 추이' },
		])

		// 시계열 조회 파라미터
		let timelineParams = reactive({})

		let chartColumn = ref([])
		let chartData = ref([])
		let chartDataLabel = ref([])

		onMounted(() => {
			console.log('마운트', props.searchParams)
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

			// 법원 경매정보 추이
			if (activeTimeline.value.id === 'lawAuction1') {
				console.log('lawAuction1')
				timelineParams.statYm = timelineParams.statYmTmp.replace('-', '')
				if (!timelineParams.statCmpYmTmp) {
					timelineParams.statCmpYmTmp = `${timelineParams.statYm.substring(0, 4)}-01`
					timelineParams.statCmpYm = `${timelineParams.statYm.substring(0, 4)}01`
				} else {
					timelineParams.statCmpYm = timelineParams.statCmpYmTmp.replace('-', '')
				}
				const { statYm, statCmpYm, pBjdCd = '1100000000' } = timelineParams
				const { data } = await rtmsApi.getTimelineLawAuction({ statYm, statCmpYm, pBjdCd })
				console.log(data)

				let statYmArr = []
				let auctionCntArr = []
				let sellCntArr = []
				let sellValueRtArr = []

				data.forEach((d) => {
					statYmArr.push(d.statYm)
					auctionCntArr.push(d.auctionCnt)
					sellCntArr.push(d.sellCnt)
					sellValueRtArr.push(d.sellValueRt)
				})
				chartColumn.value = statYmArr
				chartData.value = [auctionCntArr, sellCntArr, sellValueRtArr]
				chartDataLabel.value = ['경매건수', '매각건수', '매각가율']
			}
			// 실거래 거래량변동률 추이
			else if (activeTimeline.value.id === 'rtmsTradeRate1') {
				console.log('rtmsTradeRate1')
				timelineParams.statYm = timelineParams.statYmTmp.replace('-', '')
				const { data } = await rtmsApi.getTimelineRtmsTradeRate(timelineParams)

				chartColumn.value = undefined
				chartData.value = data.map((d) => {
					return [d.year, d.m1, d.m2, d.m3, d.m4, d.m5, d.m6, d.m7, d.m8, d.m9, d.m10, d.m11, d.m12]
				})
			}
			// 실거래 가격변동률 추이
			else {
				console.log('rtmsPriceRate1')
				timelineParams.statYm = timelineParams.statYmTmp.replace('-', '')
				const { data } = await rtmsApi.getTimelineRtmsPriceRate(timelineParams)

				chartColumn.value = undefined
				chartData.value = data.map((d) => {
					return [d.year, d.m1, d.m2, d.m3, d.m4, d.m5, d.m6, d.m7, d.m8, d.m9, d.m10, d.m11, d.m12]
				})
			}

			console.log('onSearch', activeTimeline.value)
		}

		// 팝업 이동
		const addEventHandler = () => {
			$(function () {
				$('.time-series').draggable({ containment: 'body', scroll: false, handle: '.head' })
			})
		}

		// 시계열 초기화
		const onReset = async () => {
			timelineParams.statYmTmp = dayjs().format('YYYY-MM')
			timelineParams.statCmpYmTmp = ''

			await onSearch(activeTimeline.value?.id)
		}

		return {
			activeTimeline,
			timelines,
			timelineParams,
			chartData,
			chartColumn,
			chartDataLabel,
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

.time-series {
	max-height: 400px;
}

.head {
	cursor: move;
}
</style>
