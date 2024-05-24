<template>
	<!-- layer : 전월세 상세정보-->
	<div id="rentSummaryDetail" class="layer-popup show" style="width: 600px; top: 250px; right: 15%">
		<div class="head">
			<div class="tit">전월세 상세정보</div>
			<a class="btn-close" @click="$emit('close')"><span>팝업창 닫기</span></a>
		</div>
		<div class="body">
			<Spinner
				v-if="isLoading"
				style="align-items: center; width: 100px; height: 100px; margin-top: 100px; margin-bottom: 100px"
			/>
			<template v-if="!isLoading">
				<div class="large-tit text-center">{{ detail.objNm || '(물건명 없음)' }}</div>
				<ul class="trade-detail">
					<li style="display: flex; justify-content: space-between">
						<div>
							<strong>전세</strong>
							<p>{{ rentCnt.rentGtnCnt }}건</p>
						</div>
						<div>
							<strong>월세</strong>
							<p>{{ rentCnt.rentFeeCnt }}건</p>
						</div>
					</li>
				</ul>
				<div class="text-center mb-20">{{ detail.addr }}</div>

				<div class="tit">전월세 리스트</div>
				<table class="table data-table color-blue">
					<caption>
						전월세 리스트 정보이며 층수, 동호수, 거래금액(만원), 전월세 비율, 계약일을 제공합니다.
					</caption>
					<colgroup>
						<col style="width: 30px" />
						<col style="width: 100px" />
						<col style="width: 170px" />
						<col style="width: 100px" />
						<col style="width: 120px" />
					</colgroup>
					<thead>
						<tr>
							<th scope="col">층수</th>
							<th scope="col">동호수</th>
							<th scope="col">거래금액(만원)</th>
							<th scope="col">전월세 비율</th>
							<th scope="col">계약일</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, i) in list" :key="i">
							<td>{{ item.flrNo || '-' }}</td>
							<td>{{ item.dongNm || '0' }}-{{ item.hoNm || '0' }}</td>
							<td class="text-left">
								{{ item.rentGbnNm }} {{ numberToKorean(item.rentGtn * 10000)
								}}{{ item.rentFee !== null && item.rentFee !== '0' ? '/' + numberToKorean(item.rentFee) : '' }}
							</td>
							<td>{{ item.rentRatio }}%</td>
							<td>{{ formatDate(item.cntrctDe) }}</td>
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
	<!--// layer : 실거래 상세정보-->
</template>

<script>
import { ref, watch, onMounted, reactive } from 'vue'
import dayjs from 'dayjs'
import { useUtil } from '@/composition/util'
import { rtmsMonitoring as monitoringApi } from '@/api/monitor'
import { rentMonitoring as rentMonitoringApi } from '@/api/monitor'
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

		let list = ref([]) // 전월세 리스트
		let rentCnt = ref({}) // 전월세 건수

		const isLoading = ref(false)

		// 페이징 정보
		let pagination = reactive({
			page: 1,
			size: 4,
			unitPage: 5,
			totalCount: 0,
		})

		onMounted(() => {
			console.log('detail', props.detail)
			console.log('params', props.params)
			onPageMove()
			$('#rentSummaryDetail').draggable({
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
			const { pnu } = props.detail
			const { data } = await rentMonitoringApi.summaryDetail(pnu, props.params, pagination)
			console.log('!!!!!!!', data)
			list.value = data.list.contents
			rentCnt.value = data.count
			pagination.totalCount = 0 // 페이징 초기화
			pagination = Object.assign(pagination, data.list.pagination)
			isLoading.value = false
		}

		const formatDate = (yyyymmdd) => (yyyymmdd ? dayjs(yyyymmdd, 'YYYYMMDD').format('YYYY-MM-DD') : '')

		return {
			list,
			rentCnt,
			pagination,
			isLoading,
			numberToKorean,
			onPageMove,
			formatDate,
		}
	},
}
</script>

<style scoped>
.head {
	cursor: move;
}
</style>
