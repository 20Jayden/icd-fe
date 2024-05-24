<template>
	<div class="tab-pane">
		<div v-if="keyword === 'ePrice'" class="tab">
			<ul>
				<li :class="{ 'active': isPrice === 'deal' }" @click="onPriceGbnChange('deal')">
					<a href="#"><span>매매</span></a>
				</li>
				<li :class="{ 'active': isPrice === 'lease' }" @click="onPriceGbnChange('lease')">
					<a href="#"><span>전세</span></a>
				</li>
				<li :class="{ 'active': isPrice === 'rent' }" @click="onPriceGbnChange('rent')">
					<a href="#"><span>월세</span></a>
				</li>
			</ul>
		</div>
		<div id="marketDetailLineChart" class="chart"></div>
	</div>
</template>

<script>
import { ref, watch, onMounted, reactive } from 'vue'
import dayjs from 'dayjs'
import * as echarts from 'echarts'
import { useUtil } from '@/composition/util'

export default {
	props: {
		params: {
			type: Object,
			default: () => {},
		},
		list: {
			type: Array,
			default: () => [],
		},
		keyword: {
			type: String,
			default: '',
		},
	},
	setup(props) {
		const { numberToKorean } = useUtil()

		let chart = null
		let isPrice = ref('deal')

		watch(
			() => props.list,
			() => {
				drawChart(props.keyword)
			}
		)

		watch(
			() => props.keyword,
			() => {
				drawChart(props.keyword)
			}
		)

		watch(
			() => isPrice.value,
			() => {
				drawChart(props.keyword)
			}
		)

		onMounted(() => {
			const chartDom = document.getElementById('marketDetailLineChart')
			chart = echarts.init(chartDom)
			drawChart(props.keyword)
		})

		/**
		 * echarts 옵션설정
		 * @param {*} keyword
		 */
		const drawChart = (keyword) => {
			let option = {}
			const { column, resultData } = chartData(keyword)
			option = echartsOption(column, resultData)

			chart.setOption(option, true)
		}

		const chartData = (keyword) => {
			let column = {},
				resultData = []

			let series = []

			// 매물건수 데이터
			if (keyword === 'eCount') {
				let data = eCountChartData()

				// 날짜
				column = data.map((item) => item.createdDt)

				// 매매 매물건수
				resultData.push(['매매', ...data.map((d) => (d.dealCount === undefined ? undefined : d.dealCount || 0))])
				console.log('resultData :', resultData)
				// 전세 매물건수
				resultData.push(['전세', ...data.map((d) => (d.leaseCount === undefined ? undefined : d.leaseCount || 0))])
				// 월세 매물건수
				resultData.push(['월세', ...data.map((d) => (d.rentCount === undefined ? undefined : d.rentCount || 0))])

				return { column, resultData }
			}
			// 매물가격 데이터
			else if (keyword === 'ePrice') {
				let data = ePriceChartData()

				column = data.map((item) => item.createdDt)

				// 매매 매물가격
				if (isPrice.value === 'deal') {
					resultData.push([
						'최소금액',
						...data.map((d) => (d.minDealPrice === undefined ? undefined : d.minDealPrice || 0)),
					])
					resultData.push([
						'평균금액',
						...data.map((d) => (d.medianDealPrice === undefined ? undefined : d.medianDealPrice || 0)),
					])
					resultData.push([
						'최대금액',
						...data.map((d) => (d.maxDealPrice === undefined ? undefined : d.maxDealPrice || 0)),
					])
				}
				// 전세 매물가격
				else if (isPrice.value === 'lease') {
					resultData.push([
						'최소금액',
						...data.map((d) => (d.minLeasePrice === undefined ? undefined : d.minLeasePrice || 0)),
					])
					resultData.push([
						'평균금액',
						...data.map((d) => (d.medianLeasePrice === undefined ? undefined : d.medianLeasePrice || 0)),
					])
					resultData.push([
						'최대금액',
						...data.map((d) => (d.maxLeasePrice === undefined ? undefined : d.maxLeasePrice || 0)),
					])
				}
				// 월세 매물가격
				else if (isPrice.value === 'rent') {
					resultData.push([
						'최소금액',
						...data.map((d) => (d.minRentPrice === undefined ? undefined : d.minRentPrice || 0)),
					])
					resultData.push([
						'평균금액',
						...data.map((d) => (d.medianRentPrice === undefined ? undefined : d.medianRentPrice || 0)),
					])
					resultData.push([
						'최대금액',
						...data.map((d) => (d.maxRentPrice === undefined ? undefined : d.maxRentPrice || 0)),
					])
				}

				return { column, resultData }
			}
			// 평당가격 데이터
			else if (keyword === 'mPrice') {
				let data = mPriceChartData()

				column = data.map((item) => item.createdDt)

				// 매매 매물건수
				resultData.push([
					'매매',
					...data.map((d) => (d.medianDealUnitPrice === undefined ? undefined : d.medianDealUnitPrice || 0)),
				])
				// 전세 매물건수
				resultData.push([
					'전세',
					...data.map((d) => (d.medianLeaseUnitPrice === undefined ? undefined : d.medianLeaseUnitPrice || 0)),
				])

				return { column, resultData }
			}
		}

		/**
		 * 매물건수 데이터
		 */
		const eCountChartData = () => {
			const eCountData = props.list.map(({ createdDt, dealCount, leaseCount, rentCount }) => ({
				createdDt,
				dealCount,
				leaseCount,
				rentCount,
			}))
			console.log('eCountData', eCountData)
			return eCountData
		}

		/**
		 * 매물가격 데이터
		 */
		const ePriceChartData = () => {
			const ePriceData = props.list.map(
				({
					createdDt,
					minDealPrice,
					minLeasePrice,
					minRentPrice,
					maxDealPrice,
					maxLeasePrice,
					maxRentPrice,
					medianDealPrice,
					medianLeasePrice,
					medianRentPrice,
				}) => ({
					createdDt,
					minDealPrice,
					minLeasePrice,
					minRentPrice,
					maxDealPrice,
					maxLeasePrice,
					maxRentPrice,
					medianDealPrice,
					medianLeasePrice,
					medianRentPrice,
				})
			)
			return ePriceData
		}

		/**
		 * 평당가격 데이터
		 */
		const mPriceChartData = () => {
			const mPriceData = props.list.map(({ createdDt, medianDealUnitPrice, medianLeaseUnitPrice }) => ({
				createdDt,
				medianDealUnitPrice,
				medianLeaseUnitPrice,
			}))
			return mPriceData
		}

		/**
		 * 차트 옵션 생성
		 */
		const echartsOption = (column, data) => {
			return {
				legend: {
					// data: legend,
					top: 0,
				},
				xAxis: {
					type: 'category',
					data: column,
				},
				yAxis: {
					type: 'value',
					axisLabel: {
						formatter: (value) => (props.keyword !== 'eCount' ? numberToKorean(value * 10000) : value.toLocaleString()),
					},
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow',
					},
					valueFormatter: (value) =>
						props.keyword !== 'eCount'
							? value === undefined
								? '-'
								: numberToKorean(value * 10000)
							: value === undefined
							? '-'
							: value.toLocaleString(),
				},
				series: data.map((d) => {
					const [estateGbn, ...data] = d
					return {
						name: estateGbn,
						data: data,
						type: 'line',
						smooth: true,
					}
				}),
			}
		}

		const onPriceGbnChange = (gbnCode) => {
			isPrice.value = gbnCode
		}

		return { isPrice, onPriceGbnChange }
	},
}
</script>

<style scoped>
.chart {
	min-height: 300px;
	zoom: 133.3%;
}
.tab > ul {
	justify-content: right !important;
}
</style>
