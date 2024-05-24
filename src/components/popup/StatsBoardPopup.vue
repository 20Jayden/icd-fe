<template>
	<div class="stat-board show">
		<div class="head">
			<div class="tit">통계 보드</div>
			<a :class="['btn-fold', { 'active': !isFold }]" @click="onFoldClick"><span>접기/펼치기</span></a>
			<a class="btn-close" @click="$emit('close')"><span>팝업창 닫기</span></a>
		</div>
		<div id="statBody" class="body">
			<div class="tit" v-html="statsStore.name || '통계'"></div>
			<div class="tab">
				<ul>
					<li :class="{ 'active': activeTab === 'chart' }">
						<a @click="onChartTabClick"><span>차트</span></a>
						<div class="tab-pane" v-show="activeTab === 'chart'">
							<div v-show="isDataEmpty" style="padding-top: 30px">데이터가 없습니다.</div>
							<div v-show="!isDataEmpty" id="statsChart"></div>
						</div>
					</li>
					<li :class="{ 'active': activeTab === 'table' }">
						<a @click="onTableTabClick"><span>도표</span></a>
						<div class="tab-pane" v-show="activeTab === 'table'">
							<table class="table data-table mb-0">
								<caption>
									통계 도표
								</caption>
								<thead>
									<tr>
										<th scope="col" v-for="(title, i) in tableData.head" :key="i">{{ title }}</th>
									</tr>
								</thead>
								<tbody id="statsChartTableBody" v-show="!isDataEmpty">
									<tr
										v-for="(d, i) in tableData.body"
										:id="d[0]"
										class="table-data"
										:key="i"
										@mouseover="onTableItemMouseHandler(d, $event)"
										@mouseout="onTableItemMouseHandler(d, $event)"
									>
										<template v-if="d.length > 3">
											<th scope="row">{{ d[1] }}</th>
											<td>{{ d[2] }}</td>
											<td>{{ d[3] }}</td>
										</template>
										<template v-else>
											<th scope="row">{{ d[1] }}</th>
											<td>{{ d[2] }}</td>
										</template>
									</tr>
								</tbody>
								<tbody v-show="isDataEmpty">
									<tr>
										<th colspan="2">데이터가 없습니다.</th>
									</tr>
								</tbody>
							</table>
							<div class="source">
								<span class="left" v-html="tableData.foot?.left"></span>
								<span class="right">{{ tableData.foot?.right ? '자료: ' + tableData.foot.right : '' }}</span>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, onMounted, reactive, computed, watch } from 'vue'
import dayjs from 'dayjs'
import * as echarts from 'echarts'
import { useStatsStore } from '@/stores/stats'
import useStyle from '@/composition/style'
import { useViewStore } from '@/stores/view'

export default {
	emits: ['close'],
	setup() {
		const style = useStyle()

		// 통계보드 컨텐츠 접힘여부 (타이틀만 남음)
		let isFold = ref(false)

		// 통계보드 탭 선택
		let activeTab = ref('chart')

		// 통계 스토어
		let statsStore = useStatsStore()
		const viewStore = useViewStore()

		let tableData = reactive({
			head: [],
			body: [],
			foot: {},
		})

		let chart = null

		let isDataEmpty = computed(() => Object.keys(statsStore.data).length === 0)

		onMounted(() => {
			console.log('통계보드 마운트')
			// UI 세팅 (퍼블)
			var $tab_list = $('.tab')
			$tab_list.each(function () {
				var $this = $(this)
				$this.height($this.find('li.active>.tab-pane').height() + 80)
			})

			const chartContainer = document.getElementById('statsChart')
			const tabContainer = chartContainer.closest('.tab')
			let height = 350
			// 시군구일 경우
			if (statsStore.data.length < 26) {
				height = statsStore.data.length > 5 ? 350 : 250
			} else {
				// 읍면동일 경우
				height = statsStore.data.length > 5 ? statsStore.data.length * 20 + 150 : 250
			}
			chartContainer.style.height = `${height}px`
			tabContainer.style.height = `${height + 50}px`

			onChartTabClick()
			addEventHandler()
		})

		watch(
			() => statsStore.data,
			(data) => {
				const chartContainer = document.getElementById('statsChart')
				const tabContainer = chartContainer.closest('.tab')
				let height = 350

				// 시군구일 경우
				if (data.length < 26) {
					height = data.length > 5 ? 350 : 250
				} else {
					// 읍면동일 경우
					height = data.length > 5 ? data.length * 20 + 200 : 250
				}
				chartContainer.style.height = `${height}px`
				tabContainer.style.height = `${height + 50}px`
				drawChart()
				drawTable()
			}
		)

		/**
		 * 차트 생성
		 */
		const drawChart = () => {
			const { type, id, data } = statsStore
			if (!isDataEmpty.value) {
				const chartDom = document.getElementById('statsChart')
				chart = echarts.init(chartDom)

				chart.resize()

				let option = null

				console.log('drawChart :: data ==> ', data)
				if (type === 'house' && id === 'rebuildAptPriceRate') {
					const colors = ['#5470C6', '#EE6666']
					option = {
						grid: {
							left: 55,
							top: 0,
							right: 50,
							bottom: 30,
						},
						dataset: [
							{
								dimensions: ['statYm', 'bjdNm', 'rebuildChgRt', 'aptChgRt'],
								source: data,
							},
							{
								transform: {
									type: 'sort',
									config: { dimension: 'bjdNm', order: 'asc' },
								},
							},
						],
						tooltip: {
							trigger: 'axis',
							axisPointer: {
								type: 'shadow',
							},
						},
						yAxis: {
							type: 'category',
							axisLabel: { interval: 0 /*, rotate: 30 */ },
						},
						xAxis: {},
						series: [
							{
								type: 'bar',
								name: '재건축',
								encode: { x: 'rebuildChgRt', y: 'bjdNm' },
								itemStyle: {
									color: colors[0],
									// emphasis: {
									// 	color: 'yellow',
									// },
								},
							},
							{
								type: 'bar',
								name: '일반아파트',
								encode: { x: 'aptChgRt', y: 'bjdNm' },
								itemStyle: {
									color: colors[1],
									// emphasis: {
									// 	color: 'yellow',
									// },
								},
							},
						],
					}
				} else {
					console.log('sort asc')
					option = {
						grid: {
							left: 65,
							top: 3,
							right: 30,
							bottom: 20,
						},
						// grid: {
						// 	left: '3%',
						// 	right: '3%',
						// 	bottom: '3%',
						// 	top: '5%',
						// 	containLabel: true,
						// },
						dataset: [
							{
								dimensions: ['statYm', 'bjdNm', 'value'],
								source: data,
							},
							{
								transform: {
									type: 'sort',
									config: { dimension: 'value', order: 'asc' },
								},
							},
						],
						tooltip: {
							trigger: 'axis',
							axisPointer: {
								type: 'shadow',
							},
							valueFormatter: (value) => (value ? value?.toFixed(2) : '-'),
						},
						yAxis: {
							type: 'category',
							axisLabel: {
								interval: 0,
								/*, rotate: 30 */
							},
						},
						xAxis: {},
						series: {
							type: 'bar',
							encode: { x: 'value', y: 'bjdNm' },
							itemStyle: {
								color: (d) => (d.value.value >= 0 ? '#f00' : '#00f'),
								emphasis: {
									color: 'yellow',
								},
							},
							datasetIndex: 1,
						},
					}
				}

				// if (statsStore.data.length > 100) {
				// 	option.yAxis.axisLabel.show = false
				// }
				option && chart.setOption(option, true)

				statsStore.setChart(chart)

				chart
					.on('mouseover', 'series', (e) => {
						if (e.length > 3) {
							return
						}

						let layerSource = WGMap.getLayerById(`${statsStore.type}Trend`).getSource()

						console.log(e)

						layerSource.getFeatures().forEach((f) => {
							if (
								f.get('BJCD') === e.value.bjdCd ||
								f.get('SIG_CD') + '00000' === e.value.bjdCd ||
								f.get('EMD_CD') + '00' === e.value.bjdCd
							) {
								const layerStyle = getStyle(e.value)
								const { stroke, fill } = style.getSelectedStyle()
								const selectedStyle = [...layerStyle, stroke(), fill()]

								f.setStyle(selectedStyle)
							} else {
								f.setStyle(undefined)
							}
						})
					})
					.on('mouseout', (e) => {
						let layerSource = WGMap.getLayerById(`${statsStore.type}Trend`).getSource()
						layerSource.getFeatures().forEach((f) => {
							if (
								f.get('BJCD') === e.value.bjdCd ||
								f.get('SIG_CD') + '00000' === e.value.bjdCd ||
								f.get('EMD_CD') + '00' === e.value.bjdCd
							) {
								f.setStyle(undefined)
							}
						})
					})
			}
		}

		const drawTable = () => {
			const { type, id, data, paramNames } = statsStore
			tableData.foot = {}
			// 주택동향
			if (type === 'house') {
				if (id === 'priceRate') {
					tableData.head = ['자치구', '변동률']
					tableData.foot.right = '한국부동산원'
				} else if (id === 'priceIndex') {
					tableData.head = ['자치구', '지수']
					tableData.foot.right = '한국부동산원'
				} else if (id === 'rtmsPriceRate') {
					tableData.head = ['자치구', '변동률']
					tableData.foot.right = '한국부동산원'
				} else if (id === 'rtmsPriceIndex') {
					tableData.head = ['자치구', '지수']
				} else if (id === 'aptPriceRate') {
					tableData.head = ['자치구', '변동률']
					tableData.foot.right = '부동산R114'
				} else if (id === 'rebuildAptPriceRate') {
					tableData.head = ['자치구', '재건축', '일반아파트']
					tableData.foot.right = '부동산R114'
				}

				tableData.foot.left = paramNames.map((p) => `${p[0]}: ${p[1]}`).join('<br>')

				if (id === 'rebuildAptPriceRate') {
					// 재건축vs일반아파트 레이어만 테이블 형태가 다름
					tableData.body = data.map((d) => [d.bjdCd, d.bjdNm, d.rebuildChgRt, d.aptChgRt])
				} else {
					tableData.body = data
						.sort((a, b) => Number(b.value) - Number(a.value))
						.map((d) => [d.bjdCd, d.bjdNm, d.value])
				}
			}
			// 토지동향
			else if (type === 'land') {
				if (id === 'landPriceRate') {
					tableData.head = ['자치구', '변동률']
					tableData.foot.right = '한국부동산원'
				} else if (id === 'buildingDealIndex') {
					tableData.head = ['자치구', '거래건수']
					tableData.foot.right = '한국부동산원'
				}
				tableData.foot.left = paramNames.map((p) => `${p[0]}: ${p[1]}`).join('<br>')
				tableData.body = data.sort((a, b) => Number(b.value) - Number(a.value)).map((d) => [d.bjdCd, d.bjdNm, d.value])
			}
			// 실시간 부동산
			else if (type === 'rtms') {
				if (id === 'lawAuction') {
					tableData.head = ['자치구', paramNames[1][1]]
				} else if (id === 'rtmsTypeRate') {
					tableData.head = ['자치구', '거래건수']
				} else {
					tableData.head = ['자치구', '변동률']
				}
				tableData.foot.left = paramNames.map((p) => `${p[0]}: ${p[1]}`).join('<br>')
				tableData.body = data.sort((a, b) => Number(b.value) - Number(a.value)).map((d) => [d.bjdCd, d.bjdNm, d.value])
			}
		}

		const onChartTabClick = () => {
			activeTab.value = 'chart'
			statsStore.activeTab = 'chart'
			drawChart()
		}

		const onTableTabClick = () => {
			activeTab.value = 'table'
			statsStore.activeTab = 'table'
			drawTable()
		}

		// 통계보드 접기/펼치기
		const onFoldClick = () => {
			isFold.value = !isFold.value
			$('.stat-board .body').slideToggle(100)
		}

		// 팝업 이동
		const addEventHandler = () => {
			$(function () {
				$('.stat-board').draggable({ containment: 'body', scroll: false, handle: '.head' })
			})
		}

		/**
		 * 스타일 생성
		 * @param {*} feature
		 */
		const getStyle = (e) => {
			const { stroke, fill, title, subTitle } = style.getStyle()

			// 차트가 있을 경우 레이어에 적용되는 색상
			const isChartFillColor = '#fff'
			const isChartFillStyle = new wg.style.Style({
				fill: new wg.style.Fill({
					color: isChartFillColor,
				}),
			})

			return [stroke(), isChartFillStyle, title(e.bjdNm || e[1]), subTitle(Number(e.value || e[2]).toFixed(2))]
		}

		const onTableItemMouseHandler = (item, event) => {
			let layerSource = WGMap.getLayerById(`${statsStore.type}Trend`).getSource()
			if (event.type == 'mouseover') {
				layerSource.getFeatures().forEach((f) => {
					if (
						f.get('SIG_CD') + '00000' === item[0] ||
						f.get('BJCD') === item[0] ||
						f.get('EMD_CD') + '00' === item[0]
					) {
						const layerStyle = getStyle(item)
						const { stroke, fill } = style.getSelectedStyle()
						const selectedStyle = [...layerStyle, stroke(), fill()]
						f.setStyle(selectedStyle)
					} else {
						f.setStyle(undefined)
					}
				})
			} else if (event.type == 'mouseout') {
				layerSource.getFeatures().forEach((f) => {
					if (
						f.get('SIG_CD') + '00000' === item[0] ||
						f.get('BJCD') === item[0] ||
						f.get('EMD_CD') + '00' === item[0]
					) {
						f.setStyle(undefined)
					}
				})
			}
		}

		return {
			statsStore,
			isDataEmpty,
			activeTab,
			isFold,
			tableData,
			onFoldClick,
			onChartTabClick,
			onTableTabClick,
			onTableItemMouseHandler,
		}
	},
}
</script>

<style scoped>
.stat-board {
	width: 450px;
}
.stat-board .body {
	/* min-height: 500px; */
	height: 500px;
	overflow-y: auto;
}

.source {
	margin: 10px 0 20px 0;
	text-align: left;
	font-size: 0.85rem;
}
#statsChart {
	width: 300px;
	height: 330px;
	zoom: 133.3%;
}
.head {
	cursor: move;
}
table > tbody > tr:hover {
	background-color: #f7f7f7;
}
table > tbody > tr.hover {
	background-color: #ffff00;
}
</style>
