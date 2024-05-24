<template>
	<!-- layer : 실매물 상세정보-->
	<div id="marketSummaryDetail" class="layer-popup show" style="width: 800px; top: 350px; right: 15%; z-index: 5">
		<div class="head">
			<div class="tit">실매물 상세정보</div>
			<a href="#" class="btn-close" @click="$emit('close')"><span>팝업창 닫기</span></a>
		</div>
		<div class="body">
			<Spinner
				v-if="isLoading"
				style="align-items: center; width: 100px; height: 100px; margin-top: 100px; margin-bottom: 100px"
			/>
			<template v-if="!isLoading">
				<!-- 실매물 상세정보(pnu) -->
				<MarketDetailPnu v-if="level === 'pnu'" :basicInfo="detail" :detailInfo="detailInfo" />
				<!-- 실매물 상세정보(자치구/읍면동) -->
				<MarketDetailSggUmd v-else :basicInfo="detail" :detailInfo="detailInfo" :level="level" />

				<div class="tit">
					{{ chartKeywordName }} 추이통계
					<em
						>{{ dayjs(params.startStatYmd).format('YYYY.MM.DD') }} ~
						{{ dayjs(params.endStatYmd).format('YYYY.MM.DD') }}</em
					>
				</div>
				<div class="tab" v-bind:style="{ 'height': isChart === 'line' ? '450px' : '384px' }">
					<ul>
						<li :class="{ 'active': isChart === 'line' }" @click="onChartTabClick('line')">
							<a href="#"><span>차트</span></a>
							<!-- 차트 컴포넌트 -->
							<MarketDetailLineChart
								v-if="isChart === 'line'"
								:params="params"
								:list="detailChartList"
								:keyword="isChartKeyword"
							/>
						</li>
						<li :class="{ 'active': isChart === 'table' }" @click="onChartTabClick('table')">
							<a href="#"><span>도표</span></a>
							<!-- 도표 컴포넌트 -->
							<MarketDetailTableChart
								v-if="isChart === 'table'"
								:params="params"
								:list="detailChartList"
								:keyword="isChartKeyword"
							/>
						</li>
					</ul>
				</div>
				<div class="action-btn-group">
					<div class="left">
						<button
							type="button"
							class="btn btn-primary"
							@click="onChartKeywordChange('eCount', $event.target.textContent)"
						>
							매물건수
						</button>
						<button
							type="button"
							class="btn btn-primary"
							@click="onChartKeywordChange('ePrice', $event.target.textContent)"
						>
							매물가격
						</button>
						<button
							type="button"
							class="btn btn-primary"
							@click="onChartKeywordChange('mPrice', $event.target.textContent)"
						>
							평당가격
						</button>
					</div>
				</div>
			</template>
		</div>
	</div>
	<!--// layer : 실매물 상세정보-->
</template>

<script>
import dayjs from 'dayjs'
import { ref, watch, onMounted, reactive } from 'vue'
import { useUtil } from '@/composition/util'
import { marketMonitoring as monitoringApi } from '@/api/monitor'
import MarketDetailPnu from './marketDetail/MarketDetailPnu.vue'
import MarketDetailSggUmd from './marketDetail/MarketDetailSggUmd.vue'
import MarketDetailLineChart from './marketDetail/MarketDetailLineChart.vue'
import MarketDetailTableChart from './marketDetail/MarketDetailTableChart.vue'
import Spinner from '@/components/Spinner.vue'

export default {
	components: {
		MarketDetailPnu,
		MarketDetailSggUmd,
		MarketDetailLineChart,
		MarketDetailTableChart,
		Spinner,
	},
	props: {
		// zoom
		level: {
			type: String,
			default: 'sgg',
		},
		// 선택물건 object
		detail: {
			type: Object,
			default: () => {},
		},
		// 검색조건
		params: {
			type: Object,
			default: () => {},
		},
	},
	emits: ['close'],
	setup(props) {
		const { numberToKorean } = useUtil()

		const isLoading = ref(false)

		const isChart = ref('line') // 차트타입 : 차트(line)/도표(table)
		const isChartKeyword = ref('eCount') // 차트키워드 : 매물건수(eCount) / 매물가격(ePrice) / 평당가격(mPrice)
		const chartKeywordName = ref('매물건수')

		const detailInfo = ref([]) // 실매물 상세정보
		const detailChartList = ref([]) // 실매물 추이통계

		let pnu = ref(null) // pnu

		/**
		 * 컴포넌트 Mount
		 */
		onMounted(() => {
			searchDetail()

			$('#marketSummaryDetail').draggable({
				containment: 'body',
				scroll: false,
				handle: '.head',
			})
		})

		/**
		 * 상세정보 대상 감지
		 */
		watch(
			() => props.detail,
			() => {
				searchDetail()
			}
		)

		watch(
			// () => [props.params.startStatYmd, props.params.endStatYmd],
			props.params,
			() => {
				console.log('파라미터 변경됨')
				searchDetail()
			}
		)

		/**
		 * 부동산 시장 상세정보 조회
		 */
		const searchDetail = async () => {
			isLoading.value = true
			console.log('props.detai', props.detail)
			// level이 pnu일 경우
			if (props.level === 'pnu') {
				pnu.value = props.detail.pnu
			} else {
				pnu.value = props.detail.bjdCd
			}

			// 상세정보 조회
			const { data: detail } = await monitoringApi.summaryDetail(pnu.value, props.detail.id, props.level, props.params)
			// 추이통계 조회
			const { data: detailChart } = await monitoringApi.summaryDetailStat(
				pnu.value,
				props.detail.id,
				props.level,
				props.params
			)

			console.log('detail', detail)
			// 상세정보 데이터 입력
			detailInfo.value = detail
			// 추이통계 데이터 입력
			detailChartList.value = preprocessChartData(detailChart)
			isLoading.value = false
		}

		/**
		 * (추이통계)차트 데이터 전처리
		 * 데이터가 없을 경우, 이전 날짜의 데이터를 가져옴
		 * @param {*} chartData
		 */
		const preprocessChartData = (chartData) => {
			let result = [] // 데이터 전처리 결과
			let prevObj = null // 이전날짜 데이터

			// 통계범위 날짜리스트 추출
			const statDateArray = getDatesBetween(props.params.startStatYmd, props.params.endStatYmd)

			/**
			 * 통계 데이터 전처리
			 */
			for (let i = 0; i < statDateArray.length; i++) {
				let dateCheck = false // 현재 날짜에 해당하는 데이터가 있는지 확인하는 플래그

				for (let j = 0; j < chartData.length; j++) {
					// 해당하는 날짜에 데이터가 있을 경우 데이터 삽입
					if (statDateArray[i] === chartData[j].createdDt) {
						result.push(chartData[j])
						prevObj = { ...chartData[j] }

						dateCheck = true
					}
				}

				// 현재 날짜에 해당하는 데이터가 없고, 이전 객체도 없을 경우
				if (!dateCheck && !prevObj) {
					let newObj = { createdDt: statDateArray[i], ...0 }
					result.push(newObj)
				}

				// 현재 날짜에 해당하는 데이터가 없고, 이전 객체가 유효한 경우
				if (!dateCheck && prevObj) {
					// 이전 객체를 복사하고 날짜만 현재 날짜로 변경
					let newObj = { ...null, createdDt: statDateArray[i] }
					console.log('newObj', newObj)
					result.push(newObj)
				}
			}

			console.log('result ::: ', result)
			return result // 결과값 리턴
		}

		/**
		 * 통계기간 간의 날짜리스트 추출
		 * @param {*} startDate
		 * @param {*} endDate
		 */
		const getDatesBetween = (startDate, endDate) => {
			const dates = []
			let currentDate = dayjs(startDate)

			while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
				dates.push(currentDate.format('YYYY-MM-DD'))
				currentDate = currentDate.add(1, 'day')
			}

			return dates
		}

		/**
		 * 추이통계 유형 클릭 (차트/도표)
		 * @param {*} chartType
		 */
		const onChartTabClick = (chartType) => {
			isChart.value = chartType
		}

		/**
		 * 추이통계 키워드 클릭 (매물건수/매물가격/평당가격)
		 * @param {*} chartType
		 */
		const onChartKeywordChange = (keyword, name) => {
			isChartKeyword.value = keyword
			chartKeywordName.value = name
		}

		return {
			isLoading,
			isChart,
			isChartKeyword,
			chartKeywordName,
			detailInfo,
			detailChartList,
			onChartTabClick,
			onChartKeywordChange,
			dayjs,
		}
	},
}
</script>

<style scoped></style>
