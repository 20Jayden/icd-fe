<template>
	<!-- layer : 실거래 상세정보-->
	<div id="rtmsSummaryDetail" class="layer-popup show" style="width: 400px; top: 250px; right: 15%">
		<div class="head">
			<div class="tit">실거래 상세정보</div>
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
					<li>
						<div style="width: 60%">
							<strong>거래금액</strong>
							<p>{{ (detail.objAmtAvrg / 10000).toFixed(1) }}억</p>
							<span v-if="detail.objAmtRate > 0" class="text-danger ml-5">▲ {{ detail.objAmtRate }}%</span>
							<span v-else-if="detail.objAmtRate < 0" class="text-info ml-5">▼ {{ detail.objAmtRate }}%</span>
							<span v-else class="text-normal ml-5">&nbsp; 0%</span>
						</div>
						<div style="width: 40%">
							<strong>공시지가</strong>
							<p style="float: right">{{ detail.jiga ? new Intl.NumberFormat().format(detail.jiga) + '원' : '-' }}</p>
						</div>
					</li>
					<li>
						<div style="width: 60%">&nbsp;</div>
						<div style="width: 40%">
							<strong>건수</strong>
							<p style="float: right">{{ detail.dealCnt }}건</p>
						</div>
					</li>
				</ul>
				<table class="table data-table">
					<caption>
						아파트 물건 상세 정보이며 준공, 면적별, 면적(㎡)을 제공합니다.
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

				<div class="tit">실거래 리스트</div>
				<table class="table data-table color-blue">
					<caption>
						실거래 리스트 정보이며 층수, 동호수, 최근거래금액 거래일자, 직전거래금액 거래일자, 면적을 제공합니다.
					</caption>
					<colgroup>
						<col style="width: 55px" />
						<col style="width: 80px" />
						<col style="width: 150px" />
						<col style="width: 100px" />
						<col style="width: 55px" />
					</colgroup>
					<thead>
						<tr>
							<th scope="col">층수</th>
							<th scope="col">동호수</th>
							<th scope="col">최근거래금액<br />거래일자</th>
							<th scope="col">직전거래금액<br />거래일자</th>
							<th scope="col">면적</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, i) in list" :key="i">
							<th scope="row">{{ item.bldgFlr || '-' }}</th>
							<td>{{ item.bldgDong && item.bldgDong + '-' }}{{ item.bldgHo }}</td>
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
							<td>{{ item.dealAreaNm }}</td>
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

		let list = ref([]) // 실거래 리스트

		const isLoading = ref(false)

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
			$('#rtmsSummaryDetail').draggable({
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
			const { data } = await monitoringApi.summaryDetail(pnu, props.params, pagination)
			console.log('!!!!!!!', data)
			list.value = data.contents
			pagination.totalCount = 0 // 페이징 초기화
			pagination = Object.assign(pagination, data.pagination)
			isLoading.value = false
		}

		const formatDate = (yyyymmdd) => (yyyymmdd ? dayjs(yyyymmdd, 'YYYYMMDD').format('YYYY-MM-DD') : '')

		return {
			list,
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
