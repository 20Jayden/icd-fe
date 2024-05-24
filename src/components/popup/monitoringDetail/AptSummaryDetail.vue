<template>
	<div id="aptSummaryDetail" class="layer-popup show" style="width: 780px; top: 150px; right: 15%">
		<div class="head">
			<div class="tit">아파트 임계치 상세정보</div>
			<a class="btn-close" @click="$emit('close')"><span>팝업창 닫기</span></a>
		</div>
		<div class="body">
			<Spinner
				v-if="isLoading"
				style="align-items: center; width: 100px; height: 100px; margin-top: 100px; margin-bottom: 100px"
			/>
			<template v-if="!isLoading">
				<div class="large-tit text-center">{{ detail.objNm || detail.objTitle || '(물건명 없음)' }}</div>
				<div class="trade-detail">
					<table style="width: 100%">
						<colgroup>
							<col width="13%" />
							<col width="20%" />
							<col width="13%" />
							<col width="20%" />
							<col width="13%" />
							<col width="20%" />
						</colgroup>
						<tbody>
							<tr>
								<td rowspan="2">
									<strong>평균<br />거래금액</strong>
								</td>
								<td rowspan="2">
									<p style="float: left">{{ (detail.objAmtAvrg / 10000).toFixed(1) }}억</p>
									<span v-if="detail.objAmtRate > 0" class="text-danger ml-5">▲ {{ detail.objAmtRate }}%</span>
									<span v-else-if="detail.objAmtRate < 0" class="text-info ml-5">▼ {{ detail.objAmtRate }}%</span>
									<span v-else class="text-normal ml-5">&nbsp; 0%</span>
								</td>
								<td rowspan="2">
									<strong>평균<br />직전거래금액</strong>
								</td>
								<td rowspan="2">
									<p style="text-align: center">{{ (detail.preObjAmtAvrg / 10000).toFixed(1) }}억</p>
								</td>
								<td>
									<strong>공시지가</strong>
								</td>
								<td>
									<strong style="float: right">
										{{ detail.jiga ? new Intl.NumberFormat().format(detail.jiga) + '원' : '-' }}
									</strong>
								</td>
							</tr>
							<tr>
								<td>
									<strong>
										<span :style="{ color: detail.menu.color }">{{ detail.menu.title }}</span>
										건수
									</strong>
								</td>
								<td>
									<strong style="float: right"> {{ detail.sumGapRtLevelCnt || detail.menu.count }}건 </strong>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<table class="table data-table">
					<caption>
						아파트 임계치 상세 정보이며 준공, 면적별, 면적(㎡)을 제공합니다.
					</caption>
					<colgroup>
						<col style="width: 175px" />
						<col style="width: 175px" />
					</colgroup>
					<thead>
						<tr>
							<th scope="col">준공</th>
							<th scope="col">총 거래 면적(㎡)</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th scope="row">{{ detail.buildYear }}</th>
							<td>{{ detail.dealAreaSum }}</td>
						</tr>
					</tbody>
				</table>
				<div class="text-center mb-20">{{ detail.addr }}</div>

				<div style="width: 100%">
					<div class="tit" style="float: left">임계치 모니터링 리스트</div>
					<span style="position: absolute; right: 20px">거래건수: {{ pagination.totalCount }}건</span>
				</div>
				<table class="table data-table color-blue">
					<caption>
						임계치 모니터링 리스트 정보이며 층수, 시세(만원), 최근거래금액 거래일자, 직전, 최고, 평균, 신고, 면적,
						상한가, 하한가를 제공합니다.
					</caption>
					<colgroup>
						<col style="width: 55px" />
						<col style="width: 110px" />
						<col style="width: 110px" />
						<col style="width: 70px" />
						<col style="width: 70px" />
						<col style="width: 70px" />
						<col style="width: 45px" />
						<col style="width: 45px" />
						<col style="width: 75px" />
						<col style="width: 75px" />
					</colgroup>
					<thead>
						<tr>
							<th scope="col">층수</th>
							<th scope="col">최근거래금액<br />거래일자</th>
							<th scope="col">직전거래금액<br />거래일자</th>
							<th scope="col" :style="{ 'background-color': params.analGbn === '1' ? '#F00' : '#0a32c6' }">직전</th>
							<th scope="col" :style="{ 'background-color': params.analGbn === '3' ? '#F00' : '#0a32c6' }">최고</th>
							<th scope="col" :style="{ 'background-color': params.analGbn === '2' ? '#F00' : '#0a32c6' }">평균</th>
							<th scope="col">신고</th>
							<th scope="col">면적</th>
							<th scope="col">상한가</th>
							<th scope="col">하한가</th>
						</tr>
					</thead>
					<tbody>
						<tr v-if="list.length === 0">
							<td colspan="10">데이터가 없습니다.</td>
						</tr>
						<tr v-else v-for="(item, i) in list" :key="i">
							<th scope="row">{{ item.bldgFlr || '-' }}</th>
							<td>
								{{ new Intl.NumberFormat().format(item.objAmt) }}
								<span v-if="item.objAmtRate > 0" class="text-danger ml-5">({{ item.objAmtRate }}%)</span>
								<span v-else-if="item.objAmtRate < 0" class="text-info ml-5">({{ item.objAmtRate }}%)</span>
								<span v-else class="text-normal ml-5">(0%)</span>
								<br />
								<span class="text-secondary">{{ formatDate(item.dealYmd) }}</span>
							</td>
							<td>
								{{ item.preObjAmt ? new Intl.NumberFormat().format(item.preObjAmt) : '' }}<br />
								<span class="text-secondary">{{ formatDate(item.preDealYmd) }}</span>
							</td>
							<td :style="{ 'background-color': getColor(item.preGapRtLevel) }">{{ item.preGapRt }}</td>
							<td :style="{ 'background-color': getColor(item.highGapRtLevel) }">{{ item.highGapRt }}</td>
							<td :style="{ 'background-color': getColor(item.avgGapRtLevel) }">{{ item.avgGapRt }}</td>
							<td>{{ item.dposGbn }}</td>
							<td>{{ item.dealAreaNm }}</td>
							<td>{{ item.dealHprc ? new Intl.NumberFormat().format(item.dealHprc) : '' }}</td>
							<td>{{ item.dealRprc ? new Intl.NumberFormat().format(item.dealRprc) : '' }}</td>
						</tr>
					</tbody>
				</table>

				<Pagination
					:currPage="pagination.page"
					:countPerPage="pagination.size"
					:unitPage="pagination.unitPage"
					:totalCount="pagination.totalCount"
					@movePage="onPageMove"
				/>
			</template>
		</div>
	</div>
</template>

<script>
import { onMounted, ref, reactive, watch } from 'vue'
import dayjs from 'dayjs'
import { useUtil } from '@/composition/util'
import { aptMonitoring as monitoringApi } from '@/api/monitor'
import Pagination from '@/components/Pagination.vue'
import Spinner from '@/components/Spinner.vue'

export default {
	components: {
		Pagination,
		Spinner,
	},
	props: {
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

		let list = ref([]) // 실거래 리스트

		// 페이징 정보
		let pagination = reactive({
			page: 1,
			size: 3,
			unitPage: 5,
			totalCount: 0,
		})

		onMounted(() => {
			console.log('detail', props.detail)
			console.log('params', props.params)
			onPageMove()
			$('#aptSummaryDetail').draggable({
				containment: 'body',
				scroll: false,
				handle: '.head',
			})
		})

		watch(
			() => props.detail,
			() => {
				onPageMove()
			}
		)

		const onPageMove = async (pageNum = 1) => {
			isLoading.value = true
			pagination.page = pageNum
			const { pnu, menu } = props.detail
			const { data } = await monitoringApi.summaryDetail(pnu, menu.level, props.params, pagination)
			console.log('!!!!!!!', data)
			list.value = data.contents
			pagination.totalCount = 0 // 페이징 초기화
			pagination = Object.assign(pagination, data.pagination)
			isLoading.value = false
		}

		const formatDate = (yyyymmdd) => (yyyymmdd ? dayjs(yyyymmdd, 'YYYYMMDD').format('YYYY-MM-DD') : '')

		const getColor = (level) => {
			return {
				'-3': 'rgba(0, 100, 148, 0.8)',
				'-2': 'rgba(5, 130, 202, 0.8)',
				'-1': 'rgba(0, 166, 251, 0.8)',
				'0': 'rgba(112, 224, 0, 0.8)',
				'1': 'rgba(252, 191, 73, 0.8)',
				'2': 'rgba(247, 127, 0, 0.8)',
				'3': 'rgba(214, 40, 40, 0.8)',
			}[level]
		}
		return {
			list,
			pagination,
			isLoading,
			numberToKorean,
			onPageMove,
			formatDate,
			getColor,
		}
	},
}
</script>

<style scoped>
.head {
	cursor: move;
}
</style>
